import http from 'node:http';
import https from 'node:https';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8000);
const host = process.env.HOST || '0.0.0.0';
const adminPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'tdung123321');
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
const stateFile = path.join(root, 'server-state.json');
const supabaseUrl = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const useSupabase = Boolean(supabaseUrl && supabaseServiceKey);
const sessions = new Map();
const loginAttempts = new Map();
const loginWindowMs = 15 * 60 * 1000;
const maxLoginAttempts = 8;
const sensitiveFiles = new Set(['server.mjs', 'server-state.json', '.env', '.env.example']);
const defaultState = { files: [], users: [], giftcodes: [], events: [], spinWeights: [], bankConfig: {}, supportLinks: {}, maxDeposit: 1000000, maintenance: false, cart: [], depositRequests: [], processedDeposits: [] };
let revision = 0;
let state = loadState();

if (!adminPassword) throw new Error('ADMIN_PASSWORD is required when NODE_ENV=production');

function loadState() {
    try {
        const saved = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
        revision = Number(saved.revision) || 0;
        return { ...defaultState, ...(saved.state || {}) };
    } catch { return { ...defaultState }; }
}
function saveState(nextState) {
    revision += 1;
    state = { ...defaultState, ...nextState };
    const temp = `${stateFile}.tmp`;
    fs.writeFileSync(temp, JSON.stringify({ revision, state }, null, 2), 'utf8');
    fs.renameSync(temp, stateFile);
}

async function loadSupabaseState() {
    if (!useSupabase) return;
    const response = await fetch(`${supabaseUrl}/rest/v1/app_state?id=eq.main&select=id,revision,state`, {
        headers: { apikey: supabaseServiceKey, Authorization: `Bearer ${supabaseServiceKey}` }
    });
    if (!response.ok) throw new Error(`Supabase load failed: HTTP ${response.status}`);
    const rows = await response.json();
    if (rows[0]) {
        revision = Number(rows[0].revision) || 0;
        state = { ...defaultState, ...(rows[0].state || {}) };
        return;
    }
    await saveSupabaseState(state, revision);
}

async function saveSupabaseState(nextState, nextRevision = revision + 1) {
    const response = await fetch(`${supabaseUrl}/rest/v1/app_state`, {
        method: 'POST',
        headers: {
            apikey: supabaseServiceKey,
            Authorization: `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify({ id: 'main', revision: nextRevision, state: { ...defaultState, ...nextState }, updated_at: new Date().toISOString() })
    });
    if (!response.ok) throw new Error(`Supabase save failed: HTTP ${response.status}`);
    revision = nextRevision;
    state = { ...defaultState, ...nextState };
}

async function persistState(nextState) {
    const nextRevision = revision + 1;
    if (useSupabase) return saveSupabaseState(nextState, nextRevision);
    saveState(nextState);
}
function securityHeaders() {
    return { 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'SAMEORIGIN', 'Referrer-Policy': 'no-referrer', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', 'Content-Security-Policy': "default-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com https://images.unsplash.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; connect-src 'self' https: wss:; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; frame-ancestors 'self'" };
}
function json(res, status, payload) {
    const body = JSON.stringify(payload);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body), 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': allowedOrigin, 'Access-Control-Allow-Headers': 'Content-Type, Authorization', ...securityHeaders() });
    res.end(body);
}
function publicState() {
    const users = Array.isArray(state.users) ? state.users.filter(user => user?.role !== 'admin').map(({ password, ...user }) => ({ id: user.id, username: user.username, email: user.email, role: user.role === 'admin' ? 'user' : user.role, balance: user.balance || 0, totalDeposit: user.totalDeposit || 0, vipLevel: user.vipLevel || 0, vipPoints: user.vipPoints || 0, locked: Boolean(user.locked), avatar: user.avatar, joinDate: user.joinDate, history: Array.isArray(user.history) ? user.history : [], depositRequests: Array.isArray(user.depositRequests) ? user.depositRequests : [], purchasedFiles: Array.isArray(user.purchasedFiles) ? user.purchasedFiles : [] })) : [];
    return { ...state, users, depositRequests: [], processedDeposits: [] };
}
function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; if (body.length > 5000000) req.destroy(new Error('request-too-large')); });
        req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('invalid-json')); } });
        req.on('error', reject);
    });
}
function token(req) { const value = req.headers.authorization || ''; return value.startsWith('Bearer ') ? value.slice(7) : ''; }
function session(req) { const key = token(req); const value = sessions.get(key); if (!value || value.expiresAt < Date.now()) { if (key) sessions.delete(key); return null; } return value; }
function newSession() { const value = crypto.randomBytes(32).toString('hex'); sessions.set(value, { role: 'admin', expiresAt: Date.now() + 8 * 60 * 60 * 1000 }); return value; }
function passwordsMatch(received, expected) { const a = Buffer.from(String(received || '')); const b = Buffer.from(String(expected || '')); return a.length === b.length && crypto.timingSafeEqual(a, b); }
function blocked(ip) { const entry = loginAttempts.get(ip); return entry && Date.now() - entry.startedAt < loginWindowMs && entry.count >= maxLoginAttempts; }
function failed(ip) { const entry = loginAttempts.get(ip); if (!entry || Date.now() - entry.startedAt >= loginWindowMs) loginAttempts.set(ip, { startedAt: Date.now(), count: 1 }); else entry.count += 1; }
function safePath(urlPath) { const decoded = decodeURIComponent(urlPath.split('?')[0]); const requested = decoded === '/' ? '/index.html' : decoded; const resolved = path.resolve(root, `.${requested}`); const relative = path.relative(root, resolved); const first = relative.split(path.sep)[0]; const inside = relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative); return inside && !sensitiveFiles.has(first) ? resolved : null; }
function contentType(file) { return { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8' }[path.extname(file)] || 'application/octet-stream'; }

const handler = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': allowedOrigin, 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', ...securityHeaders() }); return res.end(); }
    try {
        if (url.pathname === '/api/health' && req.method === 'GET') return json(res, 200, { ok: true, revision });
        if (url.pathname === '/api/auth/login' && req.method === 'POST') {
            const ip = req.socket.remoteAddress || 'unknown';
            if (blocked(ip)) return json(res, 429, { success: false, message: 'Quá nhiều lần đăng nhập. Thử lại sau 15 phút.' });
            const body = await readBody(req);
            if (body.username !== 'admin' || !passwordsMatch(body.password, adminPassword)) { failed(ip); return json(res, 401, { success: false, message: 'Sai tài khoản hoặc mật khẩu quản trị.' }); }
            loginAttempts.delete(ip);
            return json(res, 200, { success: true, token: newSession(), user: { id: 'admin_001', username: 'admin', email: 'admin@shop.com', role: 'admin', balance: 0, totalDeposit: 0, vipLevel: 0, vipPoints: 0, history: [], depositRequests: [], reviews: [], spinHistory: [], purchasedFiles: [], locked: false } });
        }
        if (url.pathname === '/api/auth/session' && req.method === 'GET') return session(req) ? json(res, 200, { valid: true, role: 'admin' }) : json(res, 401, { valid: false });
        if (url.pathname === '/api/sync/state' && req.method === 'GET') {
            const requested = Number(url.searchParams.get('revision') || 0);
            if (requested >= revision) return json(res, 200, { changed: false, revision });
            return json(res, 200, { changed: true, revision, backendAuthorized: true, action: 'full_state_force', force: true, data: session(req)?.role === 'admin' ? state : publicState() });
        }
        if (url.pathname === '/api/sync/state' && req.method === 'POST') {
            if (!session(req)) return json(res, 403, { success: false, message: 'Chỉ admin đã xác thực mới được đồng bộ state.' });
            const body = await readBody(req);
            if (!body.state || typeof body.state !== 'object') return json(res, 400, { success: false, message: 'State không hợp lệ.' });
            await persistState(body.state);
            return json(res, 200, { success: true, revision, backendAuthorized: true });
        }
        const file = safePath(url.pathname);
        if (req.method === 'GET' && file && fs.existsSync(file) && fs.statSync(file).isFile()) { res.writeHead(200, { 'Content-Type': contentType(file), 'Cache-Control': 'no-store', ...securityHeaders() }); return fs.createReadStream(file).pipe(res); }
        return json(res, 404, { error: 'not-found' });
    } catch (error) { return json(res, 500, { error: error.message || 'server-error' }); }
};

const tlsKey = process.env.HTTPS_KEY_FILE;
const tlsCert = process.env.HTTPS_CERT_FILE;
const server = tlsKey && tlsCert ? https.createServer({ key: fs.readFileSync(tlsKey), cert: fs.readFileSync(tlsCert) }, handler) : http.createServer(handler);
async function startServer() {
    await loadSupabaseState();
    server.listen(port, host, () => console.log(`Shop backend running at ${(tlsKey && tlsCert) ? 'https' : 'http'}://${host}:${port} (${useSupabase ? 'Supabase' : 'local file'} storage)`));
}

startServer().catch(error => {
    console.error('[STARTUP] Cannot initialize storage:', error);
    process.exitCode = 1;
});
setInterval(() => { const now = Date.now(); for (const [key, value] of sessions) if (value.expiresAt < now) sessions.delete(key); for (const [ip, value] of loginAttempts) if (now - value.startedAt >= loginWindowMs) loginAttempts.delete(ip); }, loginWindowMs).unref();
