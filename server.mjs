import http from 'node:http';
import https from 'node:https';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8000);
const adminPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'tdung123321');
const httpsKeyFile = process.env.HTTPS_KEY_FILE;
const httpsCertFile = process.env.HTTPS_CERT_FILE;
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
const stateFile = path.join(root, 'server-state.json');
const sessions = new Map();
const loginAttempts = new Map();
const loginWindowMs = 15 * 60 * 1000;
const maxLoginAttempts = 8;
const sensitiveFiles = new Set(['server.mjs', 'server-state.json', '.env', '.env.example']);

if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD is required when NODE_ENV=production');
}

const defaultState = {
    files: [],
    users: [],
    giftcodes: [],
    events: [],
    spinWeights: [],
    bankConfig: {},
    supportLinks: {},
    maxDeposit: 1000000,
    maintenance: false,
    cart: [],
    depositRequests: [],
    processedDeposits: []
};

let revision = 0;
let state = loadState();

function loadState() {
    try {
        const saved = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
        revision = Number(saved.revision) || 0;
        return { ...defaultState, ...(saved.state || {}) };
    } catch {
        return { ...defaultState };
    }
}

function saveState(nextState) {
    revision += 1;
    state = { ...defaultState, ...nextState };
    const tempFile = `${stateFile}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify({ revision, state }, null, 2), 'utf8');
    fs.renameSync(tempFile, stateFile);
}

function securityHeaders() {
    return {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'no-referrer',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': "default-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com https://images.unsplash.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; connect-src 'self' https: wss:; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; frame-ancestors 'self'"
    };
}

function json(res, status, payload) {
    const body = JSON.stringify(payload);
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        ...securityHeaders()
    });
    res.end(body);
}

function publicState() {
    const publicUsers = Array.isArray(state.users)
        ? state.users
            .filter(user => user?.role !== 'admin')
            .map(({ password, ...user }) => ({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role === 'admin' ? 'user' : user.role,
                balance: user.balance || 0,
                totalDeposit: user.totalDeposit || 0,
                vipLevel: user.vipLevel || 0,
                vipPoints: user.vipPoints || 0,
                locked: Boolean(user.locked),
                avatar: user.avatar,
                joinDate: user.joinDate,
                history: Array.isArray(user.history) ? user.history : [],
                depositRequests: Array.isArray(user.depositRequests) ? user.depositRequests : [],
                purchasedFiles: Array.isArray(user.purchasedFiles) ? user.purchasedFiles : []
            }))
        : [];
    return {
        ...state,
        users: publicUsers,
        depositRequests: [],
        processedDeposits: []
    };
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 5_000_000) req.destroy(new Error('request-too-large'));
        });
        req.on('end', () => {
            try { resolve(body ? JSON.parse(body) : {}); }
            catch { reject(new Error('invalid-json')); }
        });
        req.on('error', reject);
    });
}

function getToken(req) {
    const header = req.headers.authorization || '';
    return header.startsWith('Bearer ') ? header.slice(7) : '';
}

function getSession(req) {
    const token = getToken(req);
    const session = sessions.get(token);
    if (!session || session.expiresAt < Date.now()) {
        if (token) sessions.delete(token);
        return null;
    }
    return session;
}

function createAdminSession() {
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { role: 'admin', expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
    return token;
}

function passwordsMatch(received, expected) {
    const receivedBuffer = Buffer.from(String(received || ''));
    const expectedBuffer = Buffer.from(String(expected || ''));
    if (receivedBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}

function isLoginBlocked(ip) {
    const now = Date.now();
    const entry = loginAttempts.get(ip);
    if (!entry || now - entry.startedAt >= loginWindowMs) {
        loginAttempts.set(ip, { startedAt: now, count: 0 });
        return false;
    }
    return entry.count >= maxLoginAttempts;
}

function recordLoginFailure(ip) {
    const now = Date.now();
    const entry = loginAttempts.get(ip);
    if (!entry || now - entry.startedAt >= loginWindowMs) {
        loginAttempts.set(ip, { startedAt: now, count: 1 });
    } else {
        entry.count += 1;
    }
}

function clearLoginFailures(ip) {
    loginAttempts.delete(ip);
}

function safeFilePath(urlPath) {
    const decoded = decodeURIComponent(urlPath.split('?')[0]);
    const requested = decoded === '/' ? '/index.html' : decoded;
    const resolved = path.resolve(root, `.${requested}`);
    const relative = path.relative(root, resolved);
    const firstSegment = relative.split(path.sep)[0];
    const insideRoot = relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
    return insideRoot && !sensitiveFiles.has(firstSegment) ? resolved : null;
}

function contentType(filePath) {
    return {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.txt': 'text/plain; charset=utf-8',
        '.json': 'application/json; charset=utf-8'
    }[path.extname(filePath)] || 'application/octet-stream';
}

const requestHandler = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            ...securityHeaders()
        });
        return res.end();
    }

    try {
        if (url.pathname === '/api/health' && req.method === 'GET') {
            return json(res, 200, { ok: true, revision });
        }

        if (url.pathname === '/api/auth/login' && req.method === 'POST') {
            const ip = req.socket.remoteAddress || 'unknown';
            if (isLoginBlocked(ip)) return json(res, 429, { success: false, message: 'Quá nhiều lần đăng nhập. Thử lại sau 15 phút.' });
            const body = await readBody(req);
            if (body.username !== 'admin' || !passwordsMatch(body.password, adminPassword)) {
                recordLoginFailure(ip);
                return json(res, 401, { success: false, message: 'Sai tài khoản hoặc mật khẩu quản trị.' });
            }
            clearLoginFailures(ip);
            return json(res, 200, {
                success: true,
                token: createAdminSession(),
                user: { id: 'admin_001', username: 'admin', email: 'admin@shop.com', role: 'admin', balance: 0, totalDeposit: 0, vipLevel: 0, vipPoints: 0, history: [], depositRequests: [], reviews: [], spinHistory: [], purchasedFiles: [], locked: false }
            });
        }

        if (url.pathname === '/api/auth/session' && req.method === 'GET') {
            const session = getSession(req);
            return session ? json(res, 200, { valid: true, role: session.role }) : json(res, 401, { valid: false });
        }

        if (url.pathname === '/api/sync/state' && req.method === 'GET') {
            const session = getSession(req);
            const requestedRevision = Number(url.searchParams.get('revision') || 0);
            if (requestedRevision >= revision) return json(res, 200, { changed: false, revision });
            return json(res, 200, {
                changed: true,
                revision,
                backendAuthorized: true,
                action: 'full_state_force',
                force: true,
                data: session?.role === 'admin' ? state : publicState()
            });
        }

        if (url.pathname === '/api/sync/state' && req.method === 'POST') {
            const session = getSession(req);
            if (!session || session.role !== 'admin') return json(res, 403, { success: false, message: 'Chỉ admin đã xác thực mới được đồng bộ state.' });
            const body = await readBody(req);
            if (!body.state || typeof body.state !== 'object') return json(res, 400, { success: false, message: 'State không hợp lệ.' });
            saveState(body.state);
            return json(res, 200, { success: true, revision, backendAuthorized: true });
        }

        const filePath = safeFilePath(url.pathname);
        if (req.method === 'GET' && filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.writeHead(200, { 'Content-Type': contentType(filePath), 'Cache-Control': 'no-store', ...securityHeaders() });
            return fs.createReadStream(filePath).pipe(res);
        }

        return json(res, 404, { error: 'not-found' });
    } catch (error) {
        return json(res, 500, { error: error.message || 'server-error' });
    }
};

const server = httpsKeyFile && httpsCertFile
    ? https.createServer({ key: fs.readFileSync(httpsKeyFile), cert: fs.readFileSync(httpsCertFile) }, requestHandler)
    : http.createServer(requestHandler);

server.listen(port, process.env.HOST || '127.0.0.1', () => {
    const protocol = httpsKeyFile && httpsCertFile ? 'https' : 'http';
    console.log(`Shop sync server running at ${protocol}://${process.env.HOST || '127.0.0.1'}:${port}`);
    console.log(`Admin password source: ${process.env.ADMIN_PASSWORD ? 'environment variable' : 'default development password'}`);
    console.log(`TLS: ${httpsKeyFile && httpsCertFile ? 'enabled' : 'disabled (use reverse proxy or HTTPS_* variables in production)'}`);
});

setInterval(() => {
    const now = Date.now();
    for (const [token, session] of sessions) {
        if (session.expiresAt < now) sessions.delete(token);
    }
    for (const [ip, attempt] of loginAttempts) {
        if (now - attempt.startedAt >= loginWindowMs) loginAttempts.delete(ip);
    }
}, 15 * 60 * 1000).unref();
