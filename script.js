// ============================================================
//  SHOP TẤN DŨNG FF - ULTIMATE SYNC v31.0 FIX DEPOSIT
//  TOÀN BỘ CODE JS HOÀN CHỈNH
// ============================================================

// ============================================================
//  TOAST CONTROLLER - CHỐNG SPAM
// ============================================================
let toastDebounce = {};
let _isSyncProcessing = false;
let _lastToastTime = 0;

function showToast(message, iconClass = 'fas fa-bell', type = '') {
    try {
        const syncKeywords = ['đồng bộ', 'sync', 'bảo trì'];
        for (let kw of syncKeywords) {
            if (message.toLowerCase().includes(kw)) {
                if (_isSyncProcessing) {
                    console.log('🔇 Ẩn toast đồng bộ:', message);
                    return;
                }
            }
        }

        const now = Date.now();
        if (now - _lastToastTime < 1000) {
            console.log('🔇 Toast quá nhanh, bỏ qua:', message);
            return;
        }

        const key = message.substring(0, 30);
        if (toastDebounce[key] && now - toastDebounce[key] < 5000) {
            return;
        }
        toastDebounce[key] = now;
        _lastToastTime = now;
        
        const keys = Object.keys(toastDebounce);
        if (keys.length > 50) {
            keys.forEach(k => {
                if (now - toastDebounce[k] > 5000) delete toastDebounce[k];
            });
        }

        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position:fixed;top:80px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:400px;width:100%;';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            background: rgba(4, 8, 20, 0.96);
            backdrop-filter: blur(25px);
            border: 1px solid rgba(0, 240, 255, 0.3);
            color: #fff;
            padding: 14px 20px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 14px;
            font-size: 14px;
            font-weight: 600;
            animation: slideInToast 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards,
                       fadeOutToast 0.4s ease 3.2s forwards;
            pointer-events: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.8);
            transform-origin: right center;
        `;
        if (type === 'error') {
            toast.style.borderColor = '#ff4d4d';
        } else if (type === 'success') {
            toast.style.borderColor = '#00ff88';
        } else if (type === 'warning') {
            toast.style.borderColor = '#ffaa00';
        }
        toast.innerHTML = `<i class="${iconClass}" style="font-size:18px;color:${type === 'error' ? '#ff4d4d' : type === 'success' ? '#00ff88' : type === 'warning' ? '#ffaa00' : '#00f0ff'};"></i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 3600);
    } catch(e) {}
}

// ============================================================
//  SECURITY LOG
// ============================================================
function securityLog(message) {
    try {
        const logContainer = document.getElementById('securityLog');
        if (!logContainer) {
            const newLog = document.createElement('div');
            newLog.id = 'securityLog';
            newLog.style.cssText = 'display:none;';
            document.body.appendChild(newLog);
            return;
        }
        const entry = document.createElement('div');
        const time = new Date().toLocaleString();
        entry.textContent = `[${time}] ${message}`;
        logContainer.prepend(entry);
        while (logContainer.children.length > 50) logContainer.removeChild(logContainer.lastChild);
    } catch(e) {}
}

// ============================================================
//  ANTI-COPY PRO
// ============================================================
document.addEventListener('gesturestart', function(e) { e.preventDefault(); return false; });
document.addEventListener('touchmove', function(e) {
    if (e.touches && e.touches.length > 1) { e.preventDefault(); return false; }
}, { passive: false });

(function antiCopyPro() {
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'v' || e.key === 'V' || e.key === 'a' || e.key === 'A')) {
            e.preventDefault(); e.stopPropagation();
            securityLog('⚠️ Phát hiện Copy/Paste/Select - Đã chặn');
            showToast('🚫 Chức năng này bị vô hiệu hóa!', 'fas fa-shield-halved', 'error');
            return false;
        }
    }, { capture: true, passive: false });
    document.addEventListener('copy', function(e) { e.preventDefault(); e.stopPropagation(); return false; }, { capture: true, passive: false });
    document.addEventListener('cut', function(e) { e.preventDefault(); e.stopPropagation(); return false; }, { capture: true, passive: false });
    document.addEventListener('paste', function(e) { e.preventDefault(); e.stopPropagation(); return false; }, { capture: true, passive: false });
    document.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, { capture: true, passive: false });
    document.addEventListener('dragstart', function(e) { e.preventDefault(); return false; }, { capture: true, passive: false });
    document.addEventListener('drop', function(e) { e.preventDefault(); return false; }, { capture: true, passive: false });
    document.addEventListener('mousedown', function(e) {
        if (e.button === 2) {
            e.preventDefault();
            securityLog('⚠️ Phát hiện Right Click - Đã chặn');
            showToast('🚫 Menu chuột phải bị vô hiệu hóa!', 'fas fa-shield-halved', 'error');
            return false;
        }
    }, { capture: true, passive: false });
})();

// ============================================================
//  CONSTANTS
// ============================================================
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const VIP_CONFIG = [
    { level: 0, name: 'Thường', discount: 0, minDeposit: 0, icon: 'fa-user', color: '#94a3b8' },
    { level: 1, name: 'VIP 1', discount: 5, minDeposit: 100000, icon: 'fa-crown', color: '#cd7f32' },
    { level: 2, name: 'VIP 2', discount: 10, minDeposit: 300000, icon: 'fa-crown', color: '#c0c0c0' },
    { level: 3, name: 'VIP 3', discount: 15, minDeposit: 700000, icon: 'fa-crown', color: '#ffd700' },
    { level: 4, name: 'VIP 4', discount: 20, minDeposit: 1500000, icon: 'fa-crown', color: '#ff6b00' },
    { level: 5, name: 'VIP 5', discount: 30, minDeposit: 3000000, icon: 'fa-crown', color: '#ff0044' }
];

const DEFAULT_BANK_CONFIG = {
    Momo: { name: 'Ví Momo', account: '0388888888', accountName: 'SHOP TANDUNG FF', bankId: 'MOMO', qrImage: '' },
    MBBank: { name: 'MB Bank', account: '0388888888', accountName: 'SHOP TANDUNG FF', bankId: '970422', qrImage: '' }
};

const STORAGE_KEY_FILES = 'ff_files_data';
const STORAGE_KEY_USERS = 'ff_users';
const STORAGE_KEY_CURRENT_USER = 'ff_current_user';
const STORAGE_KEY_REVIEWS = 'ff_reviews';
const STORAGE_KEY_GIFTCODES = 'ff_giftcodes';
const STORAGE_KEY_EVENTS = 'ff_events';
const STORAGE_KEY_SPIN_WEIGHTS = 'ff_spin_weights';
const STORAGE_KEY_SUPPORT = 'ff_support_links';
const STORAGE_KEY_BANK = 'ff_bank_config';
const STORAGE_KEY_CART = 'ff_cart';
const STORAGE_KEY_REMEMBER = 'ff_remember';
const STORAGE_KEY_MISSIONS = 'ff_missions_';
const STORAGE_KEY_ACHIEVEMENTS = 'ff_achievements';
const STORAGE_KEY_THEME = 'ff_theme';
const STORAGE_KEY_MAINTENANCE = 'ff_maintenance';
const STORAGE_KEY_LOGIN_ATTEMPTS = 'ff_login_attempts';
const STORAGE_KEY_ACTIVITY = 'ff_activity';
const BACKUP_KEY = 'ff_backup_data';
const STORAGE_KEY_PROCESSED_DEPOSITS = 'ff_processed_deposits';

const SPIN_PRIZES = [
    { name: 'File Reg Free', value: 0, icon: '🎯', color: '#00f0ff' },
    { name: '50% Giảm Giá', value: 0, icon: '💎', color: '#7000ff' },
    { name: 'Kim Cương x10', value: 0, icon: '💎', color: '#ff0077' },
    { name: 'File Menu VIP', value: 0, icon: '👑', color: '#00ff88' },
    { name: 'Chúc may mắn!', value: 0, icon: '🍀', color: '#ffaa00' },
    { name: 'File Config Free', value: 0, icon: '⚡', color: '#ff6600' },
    { name: '100.000đ', value: 100000, icon: '💰', color: '#00f0ff' },
    { name: 'Thẻ cào 50k', value: 50000, icon: '📱', color: '#7000ff' },
    { name: 'Bypass Pro', value: 0, icon: '🛡️', color: '#ff0077' },
    { name: 'Giảm 30%', value: 0, icon: '🔥', color: '#00ff88' },
    { name: 'File Reg Auto', value: 0, icon: '🎯', color: '#ffaa00' },
    { name: 'Xin chúc mừng!', value: 0, icon: '🎉', color: '#ff0044' }
];

let EVENTS = [
    { id: 1, name: '🎄 Giáng Sinh Vui Vẻ', desc: 'Nạp tiền nhận gấp đôi điểm VIP', reward: 'x2 Điểm VIP', icon: '🎄', status: 'active', time: '24/12 - 26/12' },
    { id: 2, name: '🎆 Tết Nguyên Đán', desc: 'Mua file giảm 30% tất cả sản phẩm', reward: 'Giảm 30%', icon: '🧧', status: 'coming', time: '28/01 - 05/02' },
    { id: 3, name: '🔥 Khai Trương Tháng 3', desc: 'Tặng 50.000đ cho lần nạp đầu tiên', reward: '50.000đ', icon: '🎉', status: 'active', time: '01/03 - 15/03' },
    { id: 4, name: '🏆 Top Nạp Tháng', desc: 'Top 3 nạp nhiều nhất nhận phần thưởng đặc biệt', reward: 'Thưởng đặc biệt', icon: '🏆', status: 'active', time: '01/03 - 31/03' },
    { id: 5, name: '🎂 Sinh Nhật Shop', desc: 'Quà tặng miễn phí cho tất cả thành viên', reward: 'File VIP miễn phí', icon: '🎂', status: 'ended', time: '10/02 - 12/02' },
    { id: 6, name: '💎 Sale Cuối Tuần', desc: 'Giảm 20% cho tất cả file cấu hình', reward: 'Giảm 20%', icon: '💎', status: 'coming', time: '15/03 - 17/03' }
];

const MISSIONS = [
    { id: 1, name: 'Đăng nhập hàng ngày', desc: 'Đăng nhập vào shop', icon: '✅', reward: '1.000đ', progress: 0, total: 1, claimed: false },
    { id: 2, name: 'Xem 5 file', desc: 'Xem ít nhất 5 file', icon: '👀', reward: '2.000đ', progress: 0, total: 5, claimed: false },
    { id: 3, name: 'Nạp tiền 1 lần', desc: 'Nạp tiền vào tài khoản', icon: '💰', reward: '5.000đ', progress: 0, total: 1, claimed: false },
    { id: 4, name: 'Mua 1 file', desc: 'Mua bất kỳ file nào', icon: '📦', reward: '3.000đ', progress: 0, total: 1, claimed: false },
    { id: 5, name: 'Đánh giá 1 file', desc: 'Viết đánh giá cho file', icon: '⭐', reward: '2.000đ', progress: 0, total: 1, claimed: false },
    { id: 6, name: 'Quay vòng quay 3 lần', desc: 'Quay vòng quay 3 lần', icon: '🎡', reward: '5.000đ', progress: 0, total: 3, claimed: false },
];

const ACHIEVEMENTS = [
    { id: 'first_login', name: '🥇 Người mới', desc: 'Đăng nhập lần đầu', icon: '🌟' },
    { id: 'first_deposit', name: '💰 Nhà tài trợ', desc: 'Nạp tiền lần đầu', icon: '💵' },
    { id: 'first_purchase', name: '🛒 Khách hàng', desc: 'Mua file lần đầu', icon: '📦' },
    { id: 'first_review', name: '✍️ Nhà phê bình', desc: 'Viết đánh giá lần đầu', icon: '⭐' },
    { id: 'first_spin', name: '🎡 Người chơi', desc: 'Quay vòng quay lần đầu', icon: '🎰' },
    { id: 'vip_1', name: '👑 VIP 1', desc: 'Đạt VIP 1', icon: '👑' },
    { id: 'vip_3', name: '💎 VIP 3', desc: 'Đạt VIP 3', icon: '💎' },
    { id: 'vip_5', name: '🌟 VIP 5', desc: 'Đạt VIP 5', icon: '🌟' },
    { id: 'spin_10', name: '🎯 Tay quay', desc: 'Quay 10 lần', icon: '🎯' },
    { id: 'spin_50', name: '🏆 Quay thủ', desc: 'Quay 50 lần', icon: '🏆' },
    { id: 'purchase_10', name: '🛍️ Người sành điệu', desc: 'Mua 10 file', icon: '🛍️' },
    { id: 'purchase_50', name: '💼 Đại gia', desc: 'Mua 50 file', icon: '💼' },
    { id: 'deposit_1m', name: '💰 Nhà đầu tư', desc: 'Nạp 1.000.000đ', icon: '💰' },
    { id: 'deposit_10m', name: '💎 Đại gia VIP', desc: 'Nạp 10.000.000đ', icon: '💎' },
    { id: 'review_10', name: '📝 Người phê bình', desc: 'Viết 10 đánh giá', icon: '📝' }
];

// ============================================================
//  FILE DATA
// ============================================================
function getGlobalFiles() {
    try {
        const data = localStorage.getItem(STORAGE_KEY_FILES);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}
    const defaultFiles = [
        { id: 1, name: 'Reg Headshot V9 Max', category: 'reg', price: 50000, badge: 'Hot', sold: 340, rating: 4.9, img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400', note: '🔧 Hướng dẫn: Tải file về, giải nén và copy vào thư mục game.', date: '2024-01-15', downloadLink: 'https://example.com/download/reg-headshot-v9.zip' },
        { id: 2, name: 'Menu FF OBB V12.5', category: 'menu', price: 100000, badge: 'VIP', sold: 290, rating: 4.8, img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400', note: '📱 Menu OBB cài đặt đơn giản, copy vào thư mục Android/obb.', date: '2024-01-20', downloadLink: 'https://example.com/download/menu-obb-v12.5.zip' },
        { id: 3, name: 'Config M1014 Long Tộc', category: 'config', price: 30000, badge: 'New', sold: 210, rating: 4.9, img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', note: '⚡ Config M1014 bá đạo, bắn 1 phát ăn ngay.', date: '2024-01-25', downloadLink: 'https://example.com/download/config-m1014.zip' },
        { id: 4, name: 'Bypass Giả Lập PC Pro', category: 'bypass', price: 150000, badge: 'Pro', sold: 180, rating: 4.9, img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400', note: '🖥️ Bypass giả lập PC, chạy mượt như điện thoại.', date: '2024-02-01', downloadLink: 'https://example.com/download/bypass-pc-pro.zip' },
        { id: 5, name: 'Reg Headshot Auto Aim', category: 'reg', price: 45000, badge: 'Sale', sold: 410, rating: 4.7, img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', note: '🎯 Auto aim headshot, khóa mục tiêu cực nhanh.', date: '2024-02-05', downloadLink: 'https://example.com/download/reg-auto-aim.zip' },
        { id: 6, name: 'Config XM8 Siêu Phẩm', category: 'config', price: 35000, badge: 'Hot', sold: 260, rating: 4.8, img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400', note: '🔥 Config XM8 không giật, không bay, ổn định.', date: '2024-02-10', downloadLink: 'https://example.com/download/config-xm8.zip' },
        { id: 7, name: 'Menu OBB V11.0 Lite', category: 'menu', price: 80000, badge: 'Free', sold: 520, rating: 4.6, img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400', note: '📦 Menu lite miễn phí, đủ dùng.', date: '2024-02-15', downloadLink: 'https://example.com/download/menu-obb-lite.zip' },
        { id: 8, name: 'Tool Bypass AntiBan', category: 'bypass', price: 200000, badge: 'Ultra', sold: 95, rating: 4.9, img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400', note: '🛡️ Tool chống ban cao cấp, bảo vệ acc tuyệt đối.', date: '2024-02-20', downloadLink: 'https://example.com/download/bypass-antiban.zip' },
        { id: 9, name: 'Config Súng Ngắm Bắn Tỉa', category: 'config', price: 25000, badge: 'New', sold: 150, rating: 4.5, img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', note: '🔭 Config cho súng bắn tỉa, ngắm chuẩn, bắn dính.', date: '2024-02-25', downloadLink: 'https://example.com/download/config-sniper.zip' },
        { id: 10, name: 'Reg Headshot Fast Scan', category: 'reg', price: 55000, badge: 'VIP', sold: 320, rating: 4.8, img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400', note: '⚡ Fast scan headshot, tốc độ ánh sáng.', date: '2024-03-01', downloadLink: 'https://example.com/download/reg-fast-scan.zip' },
        { id: 11, name: 'Config AK47 Bá Đạo', category: 'config', price: 40000, badge: 'Hot', sold: 190, rating: 4.7, img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', note: '💥 Config AK47 bá đạo, bắn là trúng.', date: '2024-03-05', downloadLink: 'https://example.com/download/config-ak47.zip' },
        { id: 12, name: 'Menu OBB V13.0 Pro', category: 'menu', price: 120000, badge: 'VIP', sold: 150, rating: 4.9, img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400', note: '🎮 Menu OBB V13.0 Pro full tính năng, chống khóa mới nhất.', date: '2024-03-10', downloadLink: 'https://example.com/download/menu-obb-v13.zip' },
    ];
    saveGlobalFiles(defaultFiles);
    return defaultFiles;
}

function saveGlobalFiles(files) {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
    try { localStorage.setItem('ff_sync_trigger', Date.now().toString()); } catch (e) {}
    if (!_isSyncProcessing) {
        publishMqtt('files_sync', { action: 'update', files: files });
        broadcastSync({ type: 'files_sync', action: 'update', files: files });
        forceSyncToAllUsers(true);
    }
}

let FILE_DATA = getGlobalFiles();

// ============================================================
//  PROCESSED DEPOSITS - TRÁNH TRÙNG LẶP
// ============================================================
function getProcessedDeposits() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_PROCESSED_DEPOSITS)) || [];
    } catch { return []; }
}

function addProcessedDeposit(requestId) {
    const list = getProcessedDeposits();
    if (!list.includes(requestId)) {
        list.push(requestId);
        localStorage.setItem(STORAGE_KEY_PROCESSED_DEPOSITS, JSON.stringify(list));
    }
}

function isDepositProcessed(requestId) {
    return getProcessedDeposits().includes(requestId);
}

// ============================================================
//  THEME & MAINTENANCE
// ============================================================
function getTheme() {
    try { return localStorage.getItem(STORAGE_KEY_THEME) || 'dark'; } catch { return 'dark'; }
}
function setTheme(theme) {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    applyTheme(theme);
}
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}
function toggleTheme() {
    const themes = ['dark', 'light', 'cyber', 'neon'];
    const idx = themes.indexOf(getTheme());
    const next = themes[(idx + 1) % themes.length];
    setTheme(next);
    showToast('🎨 Theme: ' + next, 'fas fa-palette', 'success');
}

function getMaintenance() {
    try { return localStorage.getItem(STORAGE_KEY_MAINTENANCE) === 'true'; } catch { return false; }
}
function setMaintenance(status, silent = false) {
    localStorage.setItem(STORAGE_KEY_MAINTENANCE, status ? 'true' : 'false');
    if (!_isSyncProcessing) {
        publishMqtt('system_event', { event: 'maintenance', status: status });
        broadcastSync({ type: 'system_event', event: 'maintenance', status: status });
        forceSyncToAllUsers(true);
    }
    if (!silent) {
        if (status) {
            showToast('🔧 Đã bật chế độ bảo trì!', 'fas fa-tools', 'warning');
        } else {
            showToast('✅ Đã tắt chế độ bảo trì!', 'fas fa-check', 'success');
        }
    }
}
function isMaintenance() {
    const maintenance = getMaintenance();
    if (maintenance && !APP.isAdmin) {
        document.body.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;background:#0a0e17;color:#e6edf3;text-align:center;padding:20px;"><div style="font-size:80px;margin-bottom:20px;">🔧</div><h1 style="color:#ffaa00;">Đang bảo trì</h1><p style="color:#94a3b8;max-width:400px;">Shop đang được nâng cấp. Vui lòng quay lại sau!</p></div>`;
        return true;
    }
    return false;
}

// ============================================================
//  BRUTE FORCE
// ============================================================
function getLoginAttempts(username) {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY_LOGIN_ATTEMPTS) || '{}');
        return data[username] || { count: 0, lastAttempt: 0, blocked: false };
    } catch { return { count: 0, lastAttempt: 0, blocked: false }; }
}
function saveLoginAttempts(username, attempts) {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY_LOGIN_ATTEMPTS) || '{}');
        data[username] = attempts;
        localStorage.setItem(STORAGE_KEY_LOGIN_ATTEMPTS, JSON.stringify(data));
    } catch (e) {}
}
function checkBruteForce(username) {
    const attempts = getLoginAttempts(username);
    const now = Date.now();
    if (attempts.blocked && now - attempts.blockedAt < 300000) {
        return { blocked: true, remaining: Math.ceil((300000 - (now - attempts.blockedAt)) / 60000) };
    }
    if (attempts.blocked) {
        attempts.blocked = false;
        attempts.count = 0;
        saveLoginAttempts(username, attempts);
        return { blocked: false };
    }
    if (attempts.count >= 5) {
        attempts.blocked = true;
        attempts.blockedAt = now;
        saveLoginAttempts(username, attempts);
        return { blocked: true, remaining: 5 };
    }
    return { blocked: false };
}
function recordFailedLogin(username) {
    const attempts = getLoginAttempts(username);
    attempts.count = (attempts.count || 0) + 1;
    attempts.lastAttempt = Date.now();
    saveLoginAttempts(username, attempts);
    if (attempts.count >= 5) {
        attempts.blocked = true;
        attempts.blockedAt = Date.now();
        saveLoginAttempts(username, attempts);
        securityLog(`🚨 Brute Force: ${username} bị khóa 5 phút`);
        showToast(`🚫 Tài khoản ${username} bị khóa 5 phút do nhập sai quá nhiều!`, 'fas fa-shield-halved', 'error');
    }
}
function resetLoginAttempts(username) {
    const attempts = getLoginAttempts(username);
    attempts.count = 0;
    attempts.blocked = false;
    attempts.blockedAt = null;
    saveLoginAttempts(username, attempts);
}

// ============================================================
//  ACTIVITY LOG
// ============================================================
function logActivity(action) {
    try {
        const logs = JSON.parse(localStorage.getItem(STORAGE_KEY_ACTIVITY) || '[]');
        logs.unshift({
            timestamp: new Date().toISOString(),
            user: APP.isLoggedIn ? APP.currentUser?.username : 'anonymous',
            action: action,
            ip: 'local'
        });
        if (logs.length > 500) logs.length = 500;
        localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(logs));
    } catch (e) {}
}
function clearActivityLogs() {
    localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify([]));
    showToast('✅ Đã xóa log hoạt động!', 'fas fa-check', 'success');
}

// ============================================================
//  ACHIEVEMENTS
// ============================================================
function getAchievements(userId) {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY_ACHIEVEMENTS) || '{}');
        return data[userId] || { unlocked: [] };
    } catch { return { unlocked: [] }; }
}
function saveAchievements(userId, achievements) {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY_ACHIEVEMENTS) || '{}');
        data[userId] = achievements;
        localStorage.setItem(STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(data));
    } catch (e) {}
}
function unlockAchievement(userId, achievementId) {
    const achievements = getAchievements(userId);
    if (achievements.unlocked.includes(achievementId)) return false;
    const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!ach) return false;
    achievements.unlocked.push(achievementId);
    saveAchievements(userId, achievements);
    showToast(`🏆 Mở khóa thành tích: ${ach.name}! ${ach.icon}`, 'fas fa-trophy', 'success');
    triggerConfetti();
    return true;
}
function checkAchievements(userId) {
    const user = Auth.getUserById(userId);
    if (!user) return;
    const ach = getAchievements(userId);
    const unlocked = ach.unlocked;
    if (!unlocked.includes('first_login')) unlockAchievement(userId, 'first_login');
    if ((user.totalDeposit || 0) > 0 && !unlocked.includes('first_deposit')) unlockAchievement(userId, 'first_deposit');
    const purchases = (user.history || []).filter(h => h.amount && h.amount.startsWith('-'));
    if (purchases.length > 0 && !unlocked.includes('first_purchase')) unlockAchievement(userId, 'first_purchase');
    const reviews = Auth.getReviews().filter(r => r.userId === userId);
    if (reviews.length > 0 && !unlocked.includes('first_review')) unlockAchievement(userId, 'first_review');
    if ((user.spinCount || 0) > 0 && !unlocked.includes('first_spin')) unlockAchievement(userId, 'first_spin');
    if ((user.vipLevel || 0) >= 1 && !unlocked.includes('vip_1')) unlockAchievement(userId, 'vip_1');
    if ((user.vipLevel || 0) >= 3 && !unlocked.includes('vip_3')) unlockAchievement(userId, 'vip_3');
    if ((user.vipLevel || 0) >= 5 && !unlocked.includes('vip_5')) unlockAchievement(userId, 'vip_5');
    if ((user.spinCount || 0) >= 10 && !unlocked.includes('spin_10')) unlockAchievement(userId, 'spin_10');
    if ((user.spinCount || 0) >= 50 && !unlocked.includes('spin_50')) unlockAchievement(userId, 'spin_50');
    if (purchases.length >= 10 && !unlocked.includes('purchase_10')) unlockAchievement(userId, 'purchase_10');
    if (purchases.length >= 50 && !unlocked.includes('purchase_50')) unlockAchievement(userId, 'purchase_50');
    if ((user.totalDeposit || 0) >= 1000000 && !unlocked.includes('deposit_1m')) unlockAchievement(userId, 'deposit_1m');
    if ((user.totalDeposit || 0) >= 10000000 && !unlocked.includes('deposit_10m')) unlockAchievement(userId, 'deposit_10m');
    if (reviews.length >= 10 && !unlocked.includes('review_10')) unlockAchievement(userId, 'review_10');
}
function renderAchievements() {
    if (!APP.isLoggedIn) return;
    const container = document.getElementById('achievementsContainer');
    if (!container) return;
    const ach = getAchievements(APP.currentUser.id);
    const unlocked = ach.unlocked;
    container.innerHTML = ACHIEVEMENTS.map(a => {
        const isUnlocked = unlocked.includes(a.id);
        return `<div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${a.name}</div>
                <div class="achievement-desc">${a.desc}</div>
            </div>
            <div class="achievement-status">${isUnlocked ? '✅' : '🔒'}</div>
        </div>`;
    }).join('');
}

// ============================================================
//  WEBHOOK & EXPORT
// ============================================================
function sendWebhook(event, data) {
    const webhookUrl = localStorage.getItem('ff_webhook_url') || '';
    if (!webhookUrl) return;
    const payload = { event, data, shop: 'Tấn Dũng FF', timestamp: new Date().toISOString() };
    fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});
}
function saveWebhookUrl(url) {
    localStorage.setItem('ff_webhook_url', url);
    showToast('✅ Đã lưu webhook URL!', 'fas fa-check', 'success');
}
function exportToCSV(data, filename = 'report.csv') {
    if (!data || data.length === 0) { showToast('Không có dữ liệu để xuất!', 'fas fa-triangle-exclamation', 'error'); return; }
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';
    data.forEach(row => {
        const values = headers.map(h => {
            let val = row[h] || '';
            if (typeof val === 'string' && val.includes(',')) val = '"' + val + '"';
            return val;
        });
        csv += values.join(',') + '\n';
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📊 Xuất file CSV thành công!', 'fas fa-file-excel', 'success');
}
function saveDraft(key, data) {
    localStorage.setItem('draft_' + key, JSON.stringify(data));
}
function getDraft(key) {
    try { return JSON.parse(localStorage.getItem('draft_' + key)); } catch { return null; }
}
function clearDraft(key) {
    localStorage.removeItem('draft_' + key);
}

// ============================================================
//  CLEAN CACHE
// ============================================================
function cleanOldCache() {
    const now = Date.now();
    const keys = Object.keys(localStorage);
    let count = 0;
    keys.forEach(key => {
        if (key.startsWith('draft_') || key.startsWith('ff_sync_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (data && data.timestamp && now - data.timestamp > 86400000) {
                    localStorage.removeItem(key);
                    count++;
                }
            } catch (e) {}
        }
    });
    if (count > 0) console.log(`🧹 Đã xóa ${count} cache cũ`);
}
setInterval(cleanOldCache, 3600000);
setTimeout(cleanOldCache, 5000);

// ============================================================
//  BROADCAST CHANNEL - SYNC TẤT CẢ THIẾT BỊ
// ============================================================
let syncChannel = null;
try {
    syncChannel = new BroadcastChannel('shop_sync');
    syncChannel.onmessage = function(e) {
        if (!e.data) return;
        console.log('📡 Broadcast nhận:', e.data);
        handleSyncMessage(e.data);
    };
} catch(e) { console.log('Broadcast Channel không hỗ trợ'); }

function broadcastSync(data) {
    try {
        if (syncChannel) syncChannel.postMessage({ ...data, senderIsAdmin: APP.isAdmin === true, timestamp: Date.now() });
        localStorage.setItem('ff_sync_trigger', Date.now().toString());
    } catch(e) {}
}

// ============================================================
//  MQTT SYNC - REAL-TIME TOÀN CẦU
// ============================================================
let mqttClient = null;
let mqttConnected = false;
let _lastSentStateHash = '';

function getMqttConfig() {
    return {
        broker: 'broker.emqx.io',
        port: 8084,
        clientId: 'ff_shop_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
        username: '',
        password: '',
        topicBase: 'tandung_ff/shop',
        enabled: true
    };
}

function initMqttClient() {
    if (mqttClient && mqttClient.connected) return;
    try {
        if (typeof mqtt === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mqtt/4.3.7/mqtt.min.js';
            script.onload = () => { setTimeout(initMqttClient, 500); };
            script.onerror = () => { setTimeout(initMqttClient, 5000); };
            document.head.appendChild(script);
            return;
        }
        const config = getMqttConfig();
        const brokerUrl = `wss://${config.broker}:${config.port}/mqtt`;
        const options = {
            clientId: config.clientId,
            keepalive: 60,
            reconnectPeriod: 3000,
            connectTimeout: 30000,
            clean: true,
            will: {
                topic: `${config.topicBase}/status`,
                payload: JSON.stringify({ status: 'offline', clientId: config.clientId, timestamp: Date.now() }),
                qos: 1,
                retain: true
            }
        };
        mqttClient = mqtt.connect(brokerUrl, options);
        mqttClient.on('connect', () => {
            mqttConnected = true;
            console.log('📡 MQTT Connected');
            updateSyncStatus('Kết nối thành công', true);
            showToast('📡 Đã kết nối MQTT!', 'fas fa-wifi', 'success');
            const config = getMqttConfig();
            const topics = [
                `${config.topicBase}/deposit`,
                `${config.topicBase}/deposit_updated`,
                `${config.topicBase}/deposit_approved`,
                `${config.topicBase}/files_sync`,
                `${config.topicBase}/user_sync`,
                `${config.topicBase}/giftcode_sync`,
                `${config.topicBase}/event_sync`,
                `${config.topicBase}/settings_sync`,
                `${config.topicBase}/spin_weights_sync`,
                `${config.topicBase}/system_event`,
                `${config.topicBase}/full_state`,
                `${config.topicBase}/full_state_force`,
                `${config.topicBase}/sync_request`,
                `${config.topicBase}/cart_sync`,
                `${config.topicBase}/review_sync`,
                `${config.topicBase}/admin_action`
            ];
            topics.forEach(topic => { mqttClient.subscribe(topic, { qos: 1 }); });
            mqttClient.publish(`${config.topicBase}/status`, JSON.stringify({ status: 'online', clientId: config.clientId, timestamp: Date.now(), isAdmin: APP.isAdmin }), { qos: 1, retain: true });
            setTimeout(publishFullState, 1500);
        });
        mqttClient.on('message', (topic, message) => {
            try { const payload = JSON.parse(message.toString()); handleMqttMessage(topic, payload); } catch (e) {}
        });
        mqttClient.on('error', () => { mqttConnected = false; updateSyncStatus('Lỗi kết nối', false); setTimeout(initMqttClient, 5000); });
        mqttClient.on('offline', () => { mqttConnected = false; updateSyncStatus('Mất kết nối', false); });
        mqttClient.on('close', () => { mqttConnected = false; updateSyncStatus('Đã đóng kết nối', false); setTimeout(initMqttClient, 5000); });
        window.mqttClient = mqttClient;
    } catch (error) {
        console.error('📡 MQTT init error:', error);
        updateSyncStatus('Không thể khởi tạo MQTT', false);
        setTimeout(initMqttClient, 5000);
    }
}

function publishMqtt(topic, payload) {
    const config = getMqttConfig();
    if (!config.enabled || !mqttClient || !mqttClient.connected) {
        if (!window._mqttQueue) window._mqttQueue = [];
        window._mqttQueue.push({ topic, payload });
        if (!mqttConnected) setTimeout(initMqttClient, 1000);
        return;
    }
    const fullTopic = `${config.topicBase}/${topic}`;
    const message = JSON.stringify({ ...payload, sender: config.clientId, senderIsAdmin: APP.isAdmin, timestamp: Date.now() });
    mqttClient.publish(fullTopic, message, { qos: 1, retain: false });
}

function handleMqttMessage(topic, payload) {
    const config = getMqttConfig();
    const baseTopic = config.topicBase;
    if (payload.sender === config.clientId) return;
    if (payload.timestamp && Date.now() - payload.timestamp > 30000) return;
    handleSyncMessage({ ...payload, action: topic.replace(`${baseTopic}/`, '') });
}

// ============================================================
//  UPDATE SYNC STATUS UI
// ============================================================
function updateSyncStatus(text, connected) {
    const statusEl = document.getElementById('syncStatus');
    const textEl = document.getElementById('syncStatusText');
    if (!statusEl || !textEl) return;
    textEl.textContent = text;
    statusEl.classList.remove('connected', 'disconnected');
    if (connected) {
        statusEl.classList.add('connected');
    } else {
        statusEl.classList.add('disconnected');
    }
}

// ============================================================
//  STATE TRACKING
// ============================================================
let lastSyncTimestamp = 0;
let isProcessingSync = false;
let lastStateHash = '';
let syncQueue = [];

function getCurrentStateHash() {
    try {
        const state = {
            files: FILE_DATA,
            users: Auth.getUsers(),
            giftcodes: Auth.getGiftcodes(),
            events: Auth.getEvents(),
            spinWeights: Auth.getSpinWeights(),
            bankConfig: getBankConfig(),
            supportLinks: getSupportLinks(),
            maxDeposit: APP.maxDeposit || 1000000,
            maintenance: getMaintenance(),
            cart: getCart(),
            depositRequests: Auth.getAllDepositRequests()
        };
        return JSON.stringify(state);
    } catch(e) {
        return Date.now().toString();
    }
}

function processSyncQueue() {
    if (syncQueue.length === 0 || isProcessingSync) return;
    const nextData = syncQueue.shift();
    isProcessingSync = true;
    try {
        handleSyncMessage(nextData);
    } catch(e) {
        console.error('Queue sync error:', e);
    } finally {
        isProcessingSync = false;
        if (syncQueue.length > 0) {
            setTimeout(processSyncQueue, 100);
        }
    }
}

// ============================================================
//  XỬ LÝ SYNC MESSAGE - NÂNG CẤP HOÀN HẢO (FIX DEPOSIT)
// ============================================================
function handleSyncMessage(data) {
    if (isProcessingSync) {
        syncQueue.push(data);
        return;
    }
    if (data.timestamp && data.timestamp <= lastSyncTimestamp) return;
    
    const action = data.action || data.type || 'unknown';
    console.log('🔄 Sync:', action);

    _isSyncProcessing = true;

    try {
        // Force sync
        if (data.force === true || action === 'full_state_force') {
            if (data.senderIsAdmin !== true) {
                console.warn('🔒 Bỏ qua force full-state không đến từ admin');
                _isSyncProcessing = false;
                processSyncQueue();
                return;
            }
            if (data.data) {
                try {
                    const currentState = getCurrentStateHash();
                    const newState = JSON.stringify(data.data);
                    if (currentState !== newState) {
                        lastSyncTimestamp = data.timestamp || Date.now();
                        lastStateHash = newState;
                        applyFullState(data.data, true);
                        updateRevenueChart();
                        if (!data.silent) {
                            showToast('🔄 Dữ liệu đã được đồng bộ!', 'fas fa-sync', 'success');
                        }
                    }
                } catch(e) {
                    console.error('Sync error:', e);
                } finally {
                    _isSyncProcessing = false;
                    processSyncQueue();
                }
                return;
            }
        }

        // === DEPOSIT - FIX CỘNG TIỀN CHÍNH XÁC (CÓ KIỂM TRA TRÙNG) ===
        if (action === 'deposit_approved' || action === 'deposit_updated' || action === 'deposit') {
            try {
                if (data.status === 'approved' || data.action === 'approved') {
                    // KIỂM TRA TRÙNG LẶP
                    if (isDepositProcessed(data.requestId)) {
                        console.log('⚠️ Deposit đã được xử lý trước đó:', data.requestId);
                        _isSyncProcessing = false;
                        processSyncQueue();
                        return;
                    }
                    
                    const users = Auth.getUsers();
                    const user = users.find(u => u.id === data.userId);
                    if (user) {
                        const amount = Number(data.amount || 0);

                        // If admin full-state arrived first, the balance/request may
                        // already be applied. Mark the transaction processed instead
                        // of adding a second history entry or changing the balance again.
                        const currentReq = (user.depositRequests || []).find(r => r.id === data.requestId);
                        if (data.newBalance !== undefined &&
                            Number(user.balance || 0) === Number(data.newBalance) &&
                            currentReq && currentReq.status === 'approved') {
                            addProcessedDeposit(data.requestId);
                            lastSyncTimestamp = data.timestamp || Date.now();
                            console.log('✅ Deposit đã có sẵn từ admin full-state:', data.requestId);
                            _isSyncProcessing = false;
                            processSyncQueue();
                            return;
                        }
                        const oldBalance = user.balance || 0;
                        user.balance = data.newBalance !== undefined ? data.newBalance : (oldBalance + amount);
                        user.totalDeposit = data.newTotalDeposit !== undefined ? data.newTotalDeposit : (user.totalDeposit + amount);
                        if (data.newVipLevel !== undefined) user.vipLevel = data.newVipLevel;
                        if (data.newVipPoints !== undefined) user.vipPoints = data.newVipPoints;
                        
                        user.history = user.history || [];
                        user.history.unshift({
                            id: '#DEP-' + Date.now().toString(36).toUpperCase(),
                            desc: `Nạp tiền (đồng bộ từ admin)`,
                            amount: `+${amount.toLocaleString()}đ`,
                            status: 'Thành công',
                            time: new Date().toLocaleString('vi-VN')
                        });
                        
                        if (user.depositRequests) {
                            const req = user.depositRequests.find(r => r.id === data.requestId);
                            if (req) req.status = 'approved';
                        }
                        
                        Auth.saveUsers(users);
                        addProcessedDeposit(data.requestId);
                        
                        // Cập nhật UI cho user đang đăng nhập
                        if (APP.isLoggedIn && APP.currentUser.id === data.userId) {
                            APP.balance = user.balance;
                            APP.totalDeposit = user.totalDeposit;
                            APP.vipLevel = user.vipLevel;
                            APP.vipPoints = user.vipPoints;
                            if (DOM.userBalance) DOM.userBalance.textContent = APP.balance.toLocaleString();
                            if (DOM.profileBalance) DOM.profileBalance.textContent = APP.balance.toLocaleString() + 'đ';
                            renderHistory();
                            updateVIPUI(user);
                            // Chỉ hiển thị toast khi user nhận tiền
                            if (!data.sender || data.sender !== mqttClient?.options?.clientId) {
                                showToast(`💰 Đã nhận ${amount.toLocaleString()}đ từ admin!`, 'fas fa-wallet', 'success');
                                triggerConfetti();
                            }
                            updateRevenueChart();
                        }
                        
                        // Cập nhật admin UI
                        if (APP.isAdmin) {
                            renderDepositRequests();
                            renderAdminDashboard();
                            renderAdminUsers();
                            const pendingCount = Auth.getAllDepositRequests().filter(r => r.status === 'pending').length;
                            if (DOM.pendingBadge) {
                                DOM.pendingBadge.textContent = pendingCount;
                                DOM.pendingBadge.className = `badge ${pendingCount > 0 ? 'warning' : 'success'}`;
                            }
                            if (!data.sender || data.sender !== mqttClient?.options?.clientId) {
                                showToast(`✅ Đã duyệt ${amount.toLocaleString()}đ cho ${user.username}!`, 'fas fa-check-circle', 'success');
                            }
                        }
                        updateRealStats();
                        lastSyncTimestamp = data.timestamp || Date.now();
                        forceSyncToAllUsers(true);
                    }
                }
                if (data.status === 'pending' || data.action === 'pending') {
                    if (APP.isAdmin) {
                        renderDepositRequests();
                        renderAdminDashboard();
                        const pendingCount = Auth.getAllDepositRequests().filter(r => r.status === 'pending').length;
                        if (DOM.pendingBadge) { 
                            DOM.pendingBadge.textContent = pendingCount; 
                            DOM.pendingBadge.className = `badge ${pendingCount > 0 ? 'warning' : 'success'}`; 
                        }
                        showToast(`📢 Yêu cầu nạp ${(data.amount || 0).toLocaleString()}đ từ ${data.username || 'User'}!`, 'fas fa-bell', 'warning');
                    }
                }
                if (data.status === 'rejected' || data.action === 'rejected') {
                    if (APP.isAdmin) {
                        renderDepositRequests();
                        renderAdminDashboard();
                        showToast(`📢 ${data.username || 'User'} đã bị từ chối!`, 'fas fa-bell', 'warning');
                    }
                }
            } catch(e) {
                console.error('Deposit sync error:', e);
            } finally {
                _isSyncProcessing = false;
                processSyncQueue();
            }
            return;
        }

        // === USER ===
        if (action.includes('user')) {
            try {
                if (APP.isAdmin) { renderAdminUsers(); renderAdminDashboard(); }
                if (APP.isLoggedIn && APP.currentUser.id === data.userId) {
                    if (data.action === 'locked') { 
                        Auth.logout(); 
                        showToast('🔒 Tài khoản bị khóa!', 'fas fa-lock', 'error'); 
                        setTimeout(() => location.reload(), 2000); 
                    }
                    if (data.action === 'password_changed') { 
                        showToast('🔑 Mật khẩu đã thay đổi! Đăng nhập lại.', 'fas fa-key', 'warning'); 
                        setTimeout(() => { Auth.logout(); location.reload(); }, 3000); 
                    }
                    if (data.action === 'deleted') { 
                        Auth.logout(); 
                        showToast('❌ Tài khoản đã bị xóa!', 'fas fa-user-slash', 'error'); 
                        setTimeout(() => location.reload(), 2000); 
                    }
                    if (data.action === 'updated' || data.action === 'unlocked') {
                        const updatedUser = Auth.getUserById(data.userId);
                        if (updatedUser) { 
                            APP.balance = updatedUser.balance || 0; 
                            APP.vipLevel = updatedUser.vipLevel || 0; 
                            APP.vipPoints = updatedUser.vipPoints || 0; 
                            if (DOM.userBalance) DOM.userBalance.textContent = APP.balance.toLocaleString(); 
                            updateVIPUI(updatedUser); 
                        }
                    }
                }
                lastSyncTimestamp = data.timestamp || Date.now();
                forceSyncToAllUsers(true);
            } catch(e) {
                console.error('User sync error:', e);
            } finally {
                _isSyncProcessing = false;
                processSyncQueue();
            }
            return;
        }

        // === FILES ===
        if (action.includes('files')) {
            try {
                let changed = false;
                if (data.action === 'created' && data.file) {
                    FILE_DATA = getGlobalFiles();
                    if (!FILE_DATA.some(f => f.id === data.file.id)) { 
                        FILE_DATA.push(data.file); 
                        saveGlobalFiles(FILE_DATA);
                        changed = true;
                        showToast(`📁 Đã thêm file: ${data.file.name}`, 'fas fa-file', 'success');
                    }
                }
                if (data.action === 'updated' && data.file) {
                    FILE_DATA = getGlobalFiles();
                    const idx = FILE_DATA.findIndex(f => f.id === data.file.id);
                    if (idx !== -1) { 
                        FILE_DATA[idx] = { ...FILE_DATA[idx], ...data.file }; 
                        saveGlobalFiles(FILE_DATA);
                        changed = true;
                        showToast(`📁 Đã cập nhật: ${data.file.name}`, 'fas fa-file', 'success');
                    }
                }
                if (data.action === 'deleted' && data.fileId) {
                    FILE_DATA = getGlobalFiles();
                    const deleted = FILE_DATA.find(f => f.id === data.fileId);
                    FILE_DATA = FILE_DATA.filter(f => f.id !== data.fileId);
                    saveGlobalFiles(FILE_DATA);
                    changed = true;
                    if (deleted) showToast(`📁 Đã xóa: ${deleted.name}`, 'fas fa-trash', 'warning');
                }
                if (data.action === 'update' && data.files) { 
                    FILE_DATA = data.files; 
                    saveGlobalFiles(FILE_DATA);
                    changed = true;
                }
                if (changed) {
                    APP.files = [...FILE_DATA]; 
                    APP.filteredFiles = [...FILE_DATA];
                    renderFiles(); 
                    renderFileGrid();
                    if (APP.isAdmin) renderAdminFiles();
                    updateRealStats();
                    forceSyncToAllUsers(true);
                }
                lastSyncTimestamp = data.timestamp || Date.now();
            } catch(e) {
                console.error('Files sync error:', e);
            } finally {
                _isSyncProcessing = false;
                processSyncQueue();
            }
            return;
        }

        // === GIFTCODE ===
        if (action.includes('giftcode')) {
            try {
                if (data.action === 'created' && data.code) {
                    const codes = Auth.getGiftcodes();
                    if (!codes.some(c => c.code === data.code.code)) { 
                        codes.push(data.code); 
                        Auth.saveGiftcodes(codes);
                        showToast(`🎫 Giftcode ${data.code.code} đã được tạo!`, 'fas fa-ticket', 'success');
                    }
                }
                if (data.action === 'deleted' && data.code) {
                    const codes = Auth.getGiftcodes();
                    Auth.saveGiftcodes(codes.filter(c => c.code !== data.code));
                    showToast(`🎫 Giftcode ${data.code} đã được xóa!`, 'fas fa-ticket', 'warning');
                }
                if (APP.isAdmin) renderAdminGiftcodes();
                forceSyncToAllUsers(true);
                lastSyncTimestamp = data.timestamp || Date.now();
            } catch(e) {
                console.error('Giftcode sync error:', e);
            } finally {
                _isSyncProcessing = false;
                processSyncQueue();
            }
            return;
        }

        // === EVENTS ===
        if (action.includes('event')) {
            try {
                if (data.action === 'created' && data.event) {
                    const events = Auth.getEvents();
                    if (!events.some(e => e.id === data.event.id)) { 
                        events.push(data.event); 
                        Auth.saveEvents(events);
                        showToast(`📅 Sự kiện "${data.event.name}" đã được tạo!`, 'fas fa-calendar-day', 'success');
                    }
                }
                if (data.action === 'updated' && data.event) {
                    const events = Auth.getEvents();
                    const idx = events.findIndex(e => e.id === data.event.id);
                    if (idx !== -1) { 
                        events[idx] = { ...events[idx], ...data.event }; 
                        Auth.saveEvents(events);
                        showToast(`📅 Sự kiện "${data.event.name}" đã được cập nhật!`, 'fas fa-calendar-day', 'success');
                    }
                }
                if (data.action === 'deleted' && data.eventId) {
                    const events = Auth.getEvents();
                    const deleted = events.find(e => e.id === data.eventId);
                    Auth.saveEvents(events.filter(e => e.id !== data.eventId));
                    if (deleted) showToast(`📅 Đã xóa sự kiện: ${deleted.name}`, 'fas fa-calendar-day', 'warning');
                }
                renderEvents();
                if (APP.isAdmin) renderAdminEvents();
                forceSyncToAllUsers(true);
                lastSyncTimestamp = data.timestamp || Date.now();
            } catch(e) {
                console.error('Events sync error:', e);
            } finally {
                _isSyncProcessing = false;
                processSyncQueue();
            }
            return;
        }

        // === SPIN WEIGHTS ===
        if (action.includes('spin')) {
            try {
                if (data.weights) { 
                    Auth.saveSpinWeights(data.weights); 
                    if (APP.isAdmin) renderAdminSpinWeights(); 
                    showToast('🎡 Tỉ lệ vòng quay đã được cập nhật!', 'fas fa-dharmachakra', 'success');
                    forceSyncToAllUsers(true);
                }
                lastSyncTimestamp = data.timestamp || Date.now();
            } catch(e) {
                console.error('Spin weights sync error:', e);
            } finally {
                _isSyncProcessing = false;
                processSyncQueue();
            }
            return;
        }

        // === SETTINGS ===
        if (action.includes('settings')) {
            try {
                let changed = false;
                if (data.maxDeposit && data.maxDeposit !== APP.maxDeposit) { 
                    APP.maxDeposit = data.maxDeposit; 
                    changed = true;
                }
                if (data.bankConfig) { 
                    APP.bankConfig = data.bankConfig; 
                    saveBankConfig(data.bankConfig);
                    if (APP.isAdmin) renderAdminQRConfig(); 
                    changed = true;
                }
                if (data.supportLinks) { 
                    updateSupportUI(data.supportLinks); 
                    localStorage.setItem(STORAGE_KEY_SUPPORT, JSON.stringify(data.supportLinks));
                    changed = true;
                }
                if (changed) {
                    showToast('⚙️ Cài đặt đã được cập nhật!', 'fas fa-gear', 'success');
                    forceSyncToAllUsers(true);
                }
                lastSyncTimestamp = data.timestamp || Date.now();
            } catch(e) {
                console.error('Settings sync error:', e);
            } finally {
                _isSyncProcessing = false;
                processSyncQueue();
            }
            return;
        }

        // === CART ===
        if (action.includes('cart') && data.cart) {
            try {
                localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(data.cart));
                updateCartUI(); renderCart();
                lastSyncTimestamp = data.timestamp || Date.now();
                forceSyncToAllUsers(true);
            } catch(e) {
                console.error('Cart sync error:', e);
            } finally {
                _isSyncProcessing = false;
                processSyncQueue();
            }
            return;
        }

        // === REVIEW ===
        if (action.includes('review') && data.review) {
            try {
                const reviews = Auth.getReviews();
                if (!reviews.some(r => r.id === data.review.id)) { 
                    reviews.unshift(data.review); 
                    Auth.saveReviews(reviews); 
                    renderReviews(); 
                    showToast('⭐ Đã có đánh giá mới!', 'fas fa-star', 'success');
                    forceSyncToAllUsers(true);
                }
                lastSyncTimestamp = data.timestamp || Date.now();
            } catch(e) {
                console.error('Review sync error:', e);
            } finally {
                _isSyncProcessing = false;
                processSyncQueue();
            }
            return;
        }

        // === SYSTEM EVENT - MAINTENANCE ===
        if (action.includes('system') && data.event === 'maintenance') {
            try {
                if (data.status !== undefined) setMaintenance(data.status, true);
                if (data.message) showToast(`📢 ${data.message}`, 'fas fa-bullhorn', 'warning');
                forceSyncToAllUsers(true);
                lastSyncTimestamp = data.timestamp || Date.now();
            } catch(e) {
                console.error('System event sync error:', e);
            } finally {
                _isSyncProcessing = false;
                processSyncQueue();
            }
            return;
        }

        // === FULL STATE ===
        if (action.includes('full') && data.data) {
            if (data.senderIsAdmin !== true) {
                console.warn('🔒 Bỏ qua full-state không đến từ admin');
                _isSyncProcessing = false;
                processSyncQueue();
                return;
            }
            try {
                const currentState = getCurrentStateHash();
                const newState = JSON.stringify(data.data);
                if (currentState !== newState) {
                    lastSyncTimestamp = data.timestamp || Date.now();
                    lastStateHash = newState;
                    applyFullState(data.data, true);
                    updateRevenueChart();
                    if (!data.silent) {
                        showToast('🔄 Đã đồng bộ toàn bộ dữ liệu!', 'fas fa-sync', 'success');
                    }
                }
            } catch(e) {
                console.error('Full state sync error:', e);
            } finally {
                _isSyncProcessing = false;
                processSyncQueue();
            }
            return;
        }

        // === SYNC REQUEST ===
        if (action.includes('sync_request')) { 
            setTimeout(() => {
                publishFullState({ silent: true });
                forceSyncToAllUsers(true);
            }, 500); 
            _isSyncProcessing = false;
            processSyncQueue();
            return;
        }

        // === ADMIN ACTION ===
        if (action.includes('admin_action')) {
            try {
                if (data.action_type === 'approve_deposit') {
                    // Deprecated: deposit approval is now handled only by deposit_approved.
                    // Keeping this event ignored prevents double-crediting.
                    lastSyncTimestamp = data.timestamp || Date.now();
                    _isSyncProcessing = false;
                    processSyncQueue();
                    return;
                }
                if (false && data.action_type === 'approve_deposit') {
                    // KIỂM TRA TRÙNG LẶP
                    if (isDepositProcessed(data.requestId)) {
                        console.log('⚠️ Admin action deposit đã được xử lý:', data.requestId);
                        _isSyncProcessing = false;
                        processSyncQueue();
                        return;
                    }
                    
                    if (data.userId) {
                        const users = Auth.getUsers();
                        const user = users.find(u => u.id === data.userId);
                        if (user) {
                            const amount = data.amount || 0;
                            const oldBalance = user.balance || 0;
                            user.balance = oldBalance + amount;
                            user.totalDeposit = (user.totalDeposit || 0) + amount;
                            const newLevel = Auth.calculateVipLevel(user.totalDeposit);
                            if (newLevel > (user.vipLevel || 0)) {
                                user.vipLevel = newLevel;
                                user.vipPoints = (user.vipPoints || 0) + (newLevel - (user.vipLevel || 0)) * 1000;
                            }
                            user.history = user.history || [];
                            user.history.unshift({
                                id: '#DEP-' + Date.now().toString(36).toUpperCase(),
                                desc: `Nạp tiền (đã duyệt)`,
                                amount: `+${amount.toLocaleString()}đ`,
                                status: 'Thành công',
                                time: new Date().toLocaleString('vi-VN')
                            });
                            if (user.depositRequests) {
                                const req = user.depositRequests.find(r => r.id === data.requestId);
                                if (req) {
                                    req.status = 'approved';
                                    req.updatedAt = new Date().toISOString();
                                }
                            }
                            Auth.saveUsers(users);
                            addProcessedDeposit(data.requestId);
                            
                            if (APP.isLoggedIn && APP.currentUser.id === data.userId) {
                                APP.balance = user.balance;
                                APP.totalDeposit = user.totalDeposit;
                                APP.vipLevel = user.vipLevel;
                                APP.vipPoints = user.vipPoints;
                                if (DOM.userBalance) DOM.userBalance.textContent = APP.balance.toLocaleString();
                                if (DOM.profileBalance) DOM.profileBalance.textContent = APP.balance.toLocaleString() + 'đ';
                                renderHistory();
                                updateVIPUI(user);
                                if (!data.sender || data.sender !== mqttClient?.options?.clientId) {
                                    showToast(`💰 Đã nhận ${amount.toLocaleString()}đ!`, 'fas fa-wallet', 'success');
                                    triggerConfetti();
                                }
                                updateRevenueChart();
                            }
                        }
                    }
                    if (APP.isAdmin) {
                        renderDepositRequests();
                        renderAdminDashboard();
                        renderAdminUsers();
                        const pendingCount = Auth.getAllDepositRequests().filter(r => r.status === 'pending').length;
                        if (DOM.pendingBadge) { 
                            DOM.pendingBadge.textContent = pendingCount; 
                            DOM.pendingBadge.className = `badge ${pendingCount > 0 ? 'warning' : 'success'}`; 
                        }
                        if (!data.sender || data.sender !== mqttClient?.options?.clientId) {
                            showToast(`✅ Đã duyệt ${(data.amount || 0).toLocaleString()}đ cho ${data.username || 'User'}!`, 'fas fa-check-circle', 'success');
                        }
                        updateRevenueChart();
                    }
                    updateRealStats();
                    forceSyncToAllUsers(true);
                }
                if (data.action_type === 'reject_deposit') {
                    if (APP.isAdmin) {
                        renderDepositRequests();
                        renderAdminDashboard();
                        if (!data.sender || data.sender !== mqttClient?.options?.clientId) {
                            showToast(`❌ Đã từ chối ${(data.amount || 0).toLocaleString()}đ của ${data.username || 'User'}!`, 'fas fa-times-circle', 'error');
                        }
                        forceSyncToAllUsers(true);
                    }
                }
                lastSyncTimestamp = data.timestamp || Date.now();
            } catch(e) {
                console.error('Admin action sync error:', e);
            } finally {
                _isSyncProcessing = false;
                processSyncQueue();
            }
            return;
        }

        // Fallback
        if (APP.isAdmin) { renderAdminDashboard(); }
        renderFiles(); renderFileGrid(); updateRealStats(); updateRevenueChart();
        forceSyncToAllUsers(true);
    } catch(e) {
        console.error('Sync error:', e);
    } finally {
        _isSyncProcessing = false;
    }
}

// ============================================================
//  FORCE SYNC - GỬI DỮ LIỆU ĐẾN TẤT CẢ USER
// ============================================================
function forceSyncToAllUsers(silent = false) {
    if (APP.isAdmin !== true) {
        console.log('🔒 User client: bỏ qua full-state broadcast');
        return;
    }
    const currentHash = getCurrentStateHash();
    if (currentHash === lastStateHash && !silent) {
        console.log('🔄 Không có thay đổi, bỏ qua force sync');
        return;
    }
    
    const fullState = {
        files: FILE_DATA,
        users: Auth.getUsers(),
        giftcodes: Auth.getGiftcodes(),
        events: Auth.getEvents(),
        spinWeights: Auth.getSpinWeights(),
        bankConfig: getBankConfig(),
        supportLinks: getSupportLinks(),
        maxDeposit: APP.maxDeposit || 1000000,
        maintenance: getMaintenance(),
        cart: getCart(),
        depositRequests: Auth.getAllDepositRequests(),
        timestamp: Date.now()
    };
    
    lastStateHash = currentHash;
    
    publishMqtt('full_state_force', { 
        data: fullState,
        force: true,
        silent: silent,
        sender: 'admin_force',
        timestamp: Date.now()
    });
    
    broadcastSync({ 
        type: 'full_state_force', 
        data: fullState,
        force: true,
        silent: silent
    });
    
    localStorage.setItem('ff_force_sync', JSON.stringify({
        data: fullState,
        timestamp: Date.now(),
        silent: silent,
        senderIsAdmin: true
    }));
    
    console.log('🔄 FORCE SYNC đã gửi đến tất cả user!');
    if (!silent) {
        showToast('📡 Đã đồng bộ dữ liệu đến tất cả thiết bị!', 'fas fa-satellite-dish', 'success');
    }
}

// ============================================================
//  LẮNG NGHE FORCE SYNC TỪ LOCALSTORAGE
// ============================================================
setInterval(function() {
    try {
        const syncData = localStorage.getItem('ff_force_sync');
        if (syncData) {
            const parsed = JSON.parse(syncData);
            if (parsed.timestamp && parsed.timestamp > (window._lastSyncProcessed || 0)) {
                // ff_force_sync is written only by admin. Reject untrusted/stale records.
                if (parsed.senderIsAdmin !== true && APP.isAdmin !== true) return;
                if (parsed.timestamp < (window._lastSyncProcessed || 0)) return;
                window._lastSyncProcessed = parsed.timestamp;
                if (parsed.data) {
                    const currentState = getCurrentStateHash();
                    const newState = JSON.stringify(parsed.data);
                    if (currentState !== newState) {
                        applyFullState(parsed.data, true);
                        updateRevenueChart();
                        if (!parsed.silent) {
                            showToast('🔄 Đã đồng bộ dữ liệu từ admin!', 'fas fa-sync', 'success');
                        }
                    }
                }
            }
        }
    } catch(e) {}
}, 2000);

// ============================================================
//  PUBLISH FULL STATE
// ============================================================
function publishFullState(options = {}) {
    if (APP.isAdmin !== true) {
        console.log('🔒 User client: không được publish full_state');
        return;
    }
    const currentHash = getCurrentStateHash();
    if (currentHash === lastStateHash && !options.force) {
        console.log('🔄 Không có thay đổi, bỏ qua publishFullState');
        return;
    }
    lastStateHash = currentHash;
    
    const state = {
        files: FILE_DATA,
        users: Auth.getUsers(),
        giftcodes: Auth.getGiftcodes(),
        events: Auth.getEvents(),
        spinWeights: Auth.getSpinWeights(),
        bankConfig: getBankConfig(),
        supportLinks: getSupportLinks(),
        maxDeposit: APP.maxDeposit || 1000000,
        maintenance: getMaintenance(),
        cart: getCart(),
        depositRequests: Auth.getAllDepositRequests(),
    };
    publishMqtt('full_state', { data: state, silent: options.silent || false });
    broadcastSync({ type: 'full_state', data: state, silent: options.silent || false });
}

// ============================================================
//  APPLY FULL STATE
// ============================================================
function applyFullState(data, silent = false) {
    if (!data) return;
    
    if (data.files) {
        FILE_DATA = data.files;
        saveGlobalFiles(FILE_DATA);
        APP.files = [...FILE_DATA];
        APP.filteredFiles = [...FILE_DATA];
        renderFiles();
        renderFileGrid();
        if (APP.isAdmin) renderAdminFiles();
        updateRealStats();
    }
    
    if (data.users) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(data.users));
        if (APP.isLoggedIn) {
            const u = Auth.getUserById(APP.currentUser.id);
            if (u) {
                APP.balance = u.balance || 0;
                APP.history = u.history || [];
                APP.totalDeposit = u.totalDeposit || 0;
                APP.vipLevel = u.vipLevel || 0;
                APP.vipPoints = u.vipPoints || 0;
                if (DOM.userBalance) DOM.userBalance.textContent = APP.balance.toLocaleString();
                if (DOM.profileBalance) DOM.profileBalance.textContent = APP.balance.toLocaleString() + 'đ';
                renderHistory();
                updateVIPUI(u);
            }
        }
        if (APP.isAdmin) {
            renderDepositRequests();
            renderAdminDashboard();
            renderAdminUsers();
        }
    }
    
    if (data.giftcodes) {
        localStorage.setItem(STORAGE_KEY_GIFTCODES, JSON.stringify(data.giftcodes));
        if (APP.isAdmin) renderAdminGiftcodes();
    }
    
    if (data.events) {
        localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(data.events));
        renderEvents();
        if (APP.isAdmin) renderAdminEvents();
    }
    
    if (data.spinWeights) {
        localStorage.setItem(STORAGE_KEY_SPIN_WEIGHTS, JSON.stringify(data.spinWeights));
        if (APP.isAdmin) renderAdminSpinWeights();
    }
    
    if (data.bankConfig) {
        APP.bankConfig = data.bankConfig;
        saveBankConfig(data.bankConfig);
        if (APP.isAdmin) renderAdminQRConfig();
    }
    
    if (data.supportLinks) {
        updateSupportUI(data.supportLinks);
        localStorage.setItem(STORAGE_KEY_SUPPORT, JSON.stringify(data.supportLinks));
    }
    
    if (data.maxDeposit) {
        APP.maxDeposit = data.maxDeposit;
    }
    
    if (data.maintenance !== undefined) {
        setMaintenance(data.maintenance, true);
    }
    
    if (data.cart) {
        localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(data.cart));
        updateCartUI();
        renderCart();
    }
    
    if (data.depositRequests && APP.isAdmin) {
        renderDepositRequests();
        const pendingCount = data.depositRequests.filter(r => r.status === 'pending').length;
        if (DOM.pendingBadge) {
            DOM.pendingBadge.textContent = pendingCount;
            DOM.pendingBadge.className = `badge ${pendingCount > 0 ? 'warning' : 'success'}`;
        }
    }
    
    updateRevenueChart();
    console.log('✅ Applied full state sync successfully!');
}

// ============================================================
//  AUTH SYSTEM - FIX CỘNG TIỀN CHÍNH XÁC
// ============================================================
const Auth = {
    getUsers() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS)) || []; } catch { return []; }
    },
    saveUsers(users) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
        try { localStorage.setItem('ff_sync_trigger', Date.now().toString()); } catch (e) {}
        // Financial user data must have a single writer: ADMIN.
        // Normal users may update their own local cache, but must never
        // broadcast the complete users array and overwrite newer balances.
        if (!_isSyncProcessing && APP.isAdmin === true) {
            publishMqtt('user_sync', { action: 'update_all', users: users, source: 'admin' });
            broadcastSync({ type: 'user_sync', action: 'update_all', users: users, source: 'admin' });
            forceSyncToAllUsers(true);
        }
    },
    getCurrentUser() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY_CURRENT_USER)) || null; } catch { return null; }
    },
    saveCurrentUser(user) {
        if (user) localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
        else localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    },
    isAdmin(user) { return user && user.role === 'admin'; },
    isLoggedIn() { return !!this.getCurrentUser(); },
    getUserById(userId) {
        const users = this.getUsers();
        return users.find(u => u.id === userId) || null;
    },
    calculateVipLevel(totalDeposit) {
        let level = 0;
        for (let i = VIP_CONFIG.length - 1; i >= 0; i--) {
            if (totalDeposit >= VIP_CONFIG[i].minDeposit) { level = i; break; }
        }
        return level;
    },
    
    login(username, password, remember = true) {
        const bruteCheck = checkBruteForce(username);
        if (bruteCheck.blocked) {
            return { success: false, message: `Tài khoản bị khóa ${bruteCheck.remaining} phút do nhập sai quá nhiều!` };
        }
        if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase() && password === ADMIN_PASSWORD) {
            resetLoginAttempts(username);
            const adminUser = {
                id: 'admin_001',
                username: ADMIN_USERNAME,
                email: 'admin@shop.com',
                role: 'admin',
                balance: 0,
                totalDeposit: 0,
                vipLevel: 0,
                vipPoints: 0,
                joinDate: new Date().toISOString(),
                history: [],
                depositRequests: [],
                reviews: [],
                spinHistory: [],
                purchasedFiles: [],
                avatar: 'https://i.pravatar.cc/150?img=1',
                locked: false
            };
            const users = this.getUsers();
            if (!users.find(u => u.id === 'admin_001')) { users.push(adminUser); this.saveUsers(users); }
            this.saveCurrentUser(adminUser);
            if (remember) localStorage.setItem(STORAGE_KEY_REMEMBER, 'true');
            return { success: true, message: 'Đăng nhập admin thành công!', user: adminUser };
        }
        const users = this.getUsers();
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
        if (!user) {
            recordFailedLogin(username);
            return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' };
        }
        if (user.locked) {
            return { success: false, message: 'Tài khoản của bạn đã bị khóa! Vui lòng liên hệ admin.' };
        }
        resetLoginAttempts(username);
        user.lastLogin = new Date().toISOString();
        this.saveUsers(users);
        const sessionUser = { ...user };
        delete sessionUser.password;
        this.saveCurrentUser(sessionUser);
        if (remember) localStorage.setItem(STORAGE_KEY_REMEMBER, 'true');
        return { success: true, message: 'Đăng nhập thành công!', user: sessionUser };
    },
    
    logout() {
        this.saveCurrentUser(null);
        localStorage.removeItem(STORAGE_KEY_REMEMBER);
    },
    
    register(username, email, password) {
        if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
            return { success: false, message: 'Tên đăng nhập không được sử dụng!' };
        }
        const users = this.getUsers();
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            return { success: false, message: 'Tên đăng nhập đã tồn tại!' };
        }
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'Email đã được sử dụng!' };
        }
        const newUser = {
            id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
            username: username.trim(),
            email: email.trim(),
            password: password,
            role: 'user',
            balance: 0,
            totalDeposit: 0,
            vipLevel: 0,
            vipPoints: 0,
            joinDate: new Date().toISOString(),
            history: [],
            depositRequests: [],
            reviews: [],
            spinHistory: [],
            spinCount: 0,
            winCount: 0,
            purchasedFiles: [],
            avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70),
            locked: false
        };
        users.push(newUser);
        this.saveUsers(users);
        sendWebhook('new_user', { username, email });
        if (!_isSyncProcessing) {
            publishMqtt('user_sync', { action: 'created', user: newUser });
            broadcastSync({ type: 'user_sync', action: 'created', user: newUser });
            forceSyncToAllUsers(true);
        }
        return { success: true, message: 'Đăng ký thành công!', user: newUser };
    },
    
    updateBalance(userId, amount, description = '') {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return null;
        user.balance += amount;
        user.history = user.history || [];
        user.history.unshift({
            id: '#FF-' + Date.now().toString(36).toUpperCase(),
            desc: description || (amount >= 0 ? 'Nạp tiền' : 'Mua hàng'),
            amount: (amount >= 0 ? '+' : '') + amount.toLocaleString() + 'đ',
            status: 'Thành công',
            time: new Date().toLocaleString('vi-VN')
        });
        this.saveUsers(users);
        const current = this.getCurrentUser();
        if (current && current.id === userId) {
            current.balance = user.balance;
            current.history = user.history;
            this.saveCurrentUser(current);
        }
        if (!_isSyncProcessing) {
            broadcastSync({ type: 'balance_update', userId, balance: user.balance });
            sendWebhook('balance_update', { userId, username: user.username, balance: user.balance, amount, description });
            forceSyncToAllUsers(true);
        }
        return user;
    },
    
    addPurchasedFile(userId, fileId, fileName) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return null;
        user.purchasedFiles = user.purchasedFiles || [];
        user.purchasedFiles.push({ fileId: fileId, fileName: fileName, purchasedAt: new Date().toISOString() });
        this.saveUsers(users);
        const current = this.getCurrentUser();
        if (current && current.id === userId) {
            current.purchasedFiles = user.purchasedFiles;
            this.saveCurrentUser(current);
        }
        if (!_isSyncProcessing) {
            sendWebhook('purchase', { userId, username: user.username, fileId, fileName });
            publishMqtt('purchase_sync', { userId, username: user.username, fileId, fileName });
            forceSyncToAllUsers(true);
        }
        return user;
    },
    
    hasPurchasedFile(userId, fileId) {
        const user = this.getUserById(userId);
        if (!user) return false;
        user.purchasedFiles = user.purchasedFiles || [];
        return user.purchasedFiles.some(f => f.fileId === fileId);
    },
    
    getVipInfo(user) {
        const level = user.vipLevel || 0;
        const config = VIP_CONFIG[level] || VIP_CONFIG[0];
        const nextLevel = level < VIP_CONFIG.length - 1 ? VIP_CONFIG[level + 1] : null;
        const progress = nextLevel ? Math.min((user.totalDeposit || 0) / nextLevel.minDeposit * 100, 100) : 100;
        return { level, config, nextLevel, progress, discount: config.discount, name: config.name };
    },
    
    updateVip(userId) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return null;
        const newLevel = this.calculateVipLevel(user.totalDeposit || 0);
        const oldLevel = user.vipLevel || 0;
        user.vipLevel = newLevel;
        if (newLevel > oldLevel) {
            const bonusPoints = (newLevel - oldLevel) * 1000;
            user.vipPoints = (user.vipPoints || 0) + bonusPoints;
            checkAchievements(userId);
        }
        this.saveUsers(users);
        const current = this.getCurrentUser();
        if (current && current.id === userId) {
            current.vipLevel = user.vipLevel;
            current.vipPoints = user.vipPoints;
            current.totalDeposit = user.totalDeposit;
            this.saveCurrentUser(current);
        }
        forceSyncToAllUsers(true);
        return user;
    },
    
    addDeposit(userId, amount) {
        const user = this.updateBalance(userId, amount, 'Nạp tiền thành công');
        if (!user) return null;
        const users = this.getUsers();
        const u = users.find(u => u.id === userId);
        if (u) {
            u.totalDeposit = (u.totalDeposit || 0) + amount;
            this.saveUsers(users);
            this.updateVip(userId);
            const current = this.getCurrentUser();
            if (current && current.id === userId) {
                current.totalDeposit = u.totalDeposit;
                current.vipLevel = u.vipLevel;
                this.saveCurrentUser(current);
            }
            checkAchievements(userId);
        }
        if (!_isSyncProcessing) {
            broadcastSync({ type: 'balance_update', userId, balance: u?.balance || 0 });
            sendWebhook('deposit', { userId, username: u?.username, amount });
            forceSyncToAllUsers(true);
        }
        return user;
    },
    
    getDiscount(userId) {
        const user = this.getUserById(userId);
        if (!user) return 0;
        const vipInfo = this.getVipInfo(user);
        return vipInfo.discount;
    },
    
    createDepositRequest(userId, amount, method) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return null;
        user.depositRequests = user.depositRequests || [];
        const request = {
            id: 'DEP-' + Date.now().toString(36).toUpperCase(),
            userId: user.id,
            username: user.username,
            amount: amount,
            method: method,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        user.depositRequests.push(request);
        this.saveUsers(users);
        const syncData = { status: 'pending', userId: user.id, username: user.username, amount: amount, method: method, requestId: request.id };
        if (!_isSyncProcessing) {
            publishMqtt('deposit', syncData);
            broadcastSync({ type: 'deposit', ...syncData });
            sendWebhook('deposit_request', { userId, username: user.username, amount, method });
            forceSyncToAllUsers(true);
        }
        if (APP.isAdmin) {
            setTimeout(() => {
                renderDepositRequests();
                renderAdminDashboard();
                const pendingCount = Auth.getAllDepositRequests().filter(r => r.status === 'pending').length;
                if (DOM.pendingBadge) { DOM.pendingBadge.textContent = pendingCount; DOM.pendingBadge.className = `badge ${pendingCount > 0 ? 'warning' : 'success'}`; }
                showToast(`📢 Yêu cầu nạp ${amount.toLocaleString()}đ từ ${user.username}!`, 'fas fa-bell', 'warning');
            }, 10);
        }
        return request;
    },
    
    getAllDepositRequests() {
        const users = this.getUsers();
        const all = [];
        users.forEach(user => {
            if (user.depositRequests && Array.isArray(user.depositRequests)) {
                user.depositRequests.forEach(req => {
                    if (req.status === 'pending' || req.status === 'approved' || req.status === 'rejected') {
                        all.push({ ...req, userEmail: user.email, userVip: user.vipLevel || 0 });
                    }
                });
            }
        });
        all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return all;
    },
    
    // FIX: APPROVE DEPOSIT - CỘNG TIỀN CHÍNH XÁC + KIỂM TRA TRÙNG
    approveDeposit(requestId) {
        // KIỂM TRA TRÙNG LẶP
        if (isDepositProcessed(requestId)) {
            showToast('⚠️ Yêu cầu này đã được xử lý trước đó!', 'fas fa-exclamation-triangle', 'warning');
            return null;
        }
        
        const users = this.getUsers();
        let foundUser = null, foundRequest = null, foundIndex = -1;
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (user.depositRequests && Array.isArray(user.depositRequests)) {
                const idx = user.depositRequests.findIndex(r => r.id === requestId && r.status === 'pending');
                if (idx !== -1) {
                    foundUser = user;
                    foundRequest = user.depositRequests[idx];
                    foundIndex = idx;
                    break;
                }
            }
        }
        if (!foundRequest) {
            showToast('❌ Không tìm thấy yêu cầu chờ duyệt!', 'fas fa-times-circle', 'error');
            return null;
        }
        
        foundRequest.status = 'approved';
        foundRequest.updatedAt = new Date().toISOString();
        const amount = foundRequest.amount;
        
        const oldBalance = foundUser.balance || 0;
        foundUser.balance = oldBalance + amount;
        foundUser.totalDeposit = (foundUser.totalDeposit || 0) + amount;
        
        const newLevel = this.calculateVipLevel(foundUser.totalDeposit);
        if (newLevel > (foundUser.vipLevel || 0)) {
            const bonusPoints = (newLevel - (foundUser.vipLevel || 0)) * 1000;
            foundUser.vipPoints = (foundUser.vipPoints || 0) + bonusPoints;
            foundUser.vipLevel = newLevel;
        }
        
        foundUser.history = foundUser.history || [];
        foundUser.history.unshift({
            id: '#DEP-' + Date.now().toString(36).toUpperCase(),
            desc: `Nạp tiền qua ${foundRequest.method} (đã duyệt)`,
            amount: `+${amount.toLocaleString()}đ`,
            status: 'Thành công',
            time: new Date().toLocaleString('vi-VN')
        });
        
        this.saveUsers(users);
        addProcessedDeposit(requestId);
        sendWebhook('deposit_approved', { userId: foundUser.id, username: foundUser.username, amount: amount });
        
        const syncData = {
            status: 'approved',
            userId: foundUser.id,
            username: foundUser.username,
            amount: amount,
            requestId: requestId,
            newBalance: foundUser.balance,
            newTotalDeposit: foundUser.totalDeposit,
            newVipLevel: foundUser.vipLevel,
            newVipPoints: foundUser.vipPoints
        };
        if (!_isSyncProcessing) {
            // Single authoritative transaction event.
            publishMqtt('deposit_approved', { ...syncData, eventVersion: 2 });
            broadcastSync({ type: 'deposit_approved', ...syncData, eventVersion: 2 });
            // Admin full-state is sent by forceSyncToAllUsers(), but it no longer
            // carries processedDeposits, so it cannot suppress this transaction.
            forceSyncToAllUsers(true);
        }
        
        const current = this.getCurrentUser();
        if (current && current.id === foundUser.id) {
            current.balance = foundUser.balance;
            current.history = foundUser.history;
            current.totalDeposit = foundUser.totalDeposit;
            current.vipLevel = foundUser.vipLevel;
            current.vipPoints = foundUser.vipPoints;
            this.saveCurrentUser(current);
            APP.balance = current.balance;
            APP.history = current.history;
            APP.totalDeposit = current.totalDeposit;
            APP.vipLevel = current.vipLevel;
            APP.vipPoints = current.vipPoints;
            if (DOM.userBalance) DOM.userBalance.textContent = APP.balance.toLocaleString();
            if (DOM.profileBalance) DOM.profileBalance.textContent = APP.balance.toLocaleString() + 'đ';
            renderHistory();
            updateVIPUI(foundUser);
            checkAchievements(foundUser.id);
            if (!_isSyncProcessing) {
                showToast(`💰 Bạn đã nhận ${amount.toLocaleString()}đ!`, 'fas fa-wallet', 'success');
                triggerConfetti();
            }
            updateRevenueChart();
        }
        
        if (APP.isAdmin) {
            setTimeout(() => {
                renderDepositRequests();
                renderAdminDashboard();
                renderAdminUsers();
                updateRealStats();
                updateRevenueChart();
                const pendingCount = this.getAllDepositRequests().filter(r => r.status === 'pending').length;
                if (DOM.pendingBadge) { 
                    DOM.pendingBadge.textContent = pendingCount; 
                    DOM.pendingBadge.className = `badge ${pendingCount > 0 ? 'warning' : 'success'}`; 
                }
                if (!_isSyncProcessing) {
                    showToast(`✅ Đã duyệt ${amount.toLocaleString()}đ cho ${foundUser.username}!`, 'fas fa-check-circle', 'success');
                }
                forceSyncToAllUsers(true);
            }, 10);
        }
        
        setTimeout(() => forceSyncToAllUsers(true), 200);
        return foundRequest;
    },
    
    // REJECT DEPOSIT
    rejectDeposit(requestId, reason = '') {
        const users = this.getUsers();
        let foundRequest = null, foundUser = null;
        for (const user of users) {
            if (user.depositRequests && Array.isArray(user.depositRequests)) {
                const idx = user.depositRequests.findIndex(r => r.id === requestId && r.status === 'pending');
                if (idx !== -1) {
                    foundRequest = user.depositRequests[idx];
                    foundUser = user;
                    foundRequest.status = 'rejected';
                    foundRequest.note = reason || 'Bị từ chối';
                    foundRequest.updatedAt = new Date().toISOString();
                    break;
                }
            }
        }
        if (!foundRequest) {
            showToast('❌ Không tìm thấy yêu cầu!', 'fas fa-times-circle', 'error');
            return null;
        }
        this.saveUsers(users);
        const syncData = { 
            status: 'rejected', 
            userId: foundUser.id, 
            username: foundUser.username, 
            amount: foundRequest.amount, 
            reason: reason,
            requestId: requestId
        };
        if (!_isSyncProcessing) {
            publishMqtt('deposit_updated', syncData);
            broadcastSync({ type: 'deposit_updated', ...syncData });
            publishMqtt('admin_action', { 
                action_type: 'reject_deposit', 
                userId: foundUser.id, 
                username: foundUser.username, 
                amount: foundRequest.amount,
                requestId: requestId
            });
            broadcastSync({ type: 'admin_action', 
                action_type: 'reject_deposit', 
                userId: foundUser.id, 
                username: foundUser.username, 
                amount: foundRequest.amount,
                requestId: requestId
            });
            sendWebhook('deposit_rejected', { userId: foundUser.id, username: foundUser.username, amount: foundRequest.amount, reason });
            forceSyncToAllUsers(true);
        }
        if (APP.isAdmin) {
            setTimeout(() => { 
                renderDepositRequests(); 
                renderAdminDashboard();
                const pendingCount = this.getAllDepositRequests().filter(r => r.status === 'pending').length;
                if (DOM.pendingBadge) { 
                    DOM.pendingBadge.textContent = pendingCount; 
                    DOM.pendingBadge.className = `badge ${pendingCount > 0 ? 'warning' : 'success'}`; 
                }
                if (!_isSyncProcessing) {
                    showToast(`❌ Đã từ chối ${foundRequest.amount.toLocaleString()}đ của ${foundUser.username}!`, 'fas fa-times-circle', 'error');
                }
                forceSyncToAllUsers(true);
            }, 10);
        }
        setTimeout(() => forceSyncToAllUsers(true), 200);
        return foundRequest;
    },
    
    cancelDepositRequest(userId, requestId) {
        const user = this.getUserById(userId);
        if (!user) return null;
        user.depositRequests = user.depositRequests || [];
        const idx = user.depositRequests.findIndex(r => r.id === requestId);
        if (idx === -1) return null;
        user.depositRequests.splice(idx, 1);
        this.saveUsers(users);
        forceSyncToAllUsers(true);
        return true;
    },
    
    getReviews() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY_REVIEWS)) || []; } catch { return []; }
    },
    saveReviews(reviews) {
        localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    },
    
    addReview(userId, username, fileId, fileName, rating, content, images) {
        const reviews = this.getReviews();
        const review = {
            id: 'RV-' + Date.now().toString(36).toUpperCase(),
            userId: userId,
            username: username,
            fileId: fileId,
            fileName: fileName,
            rating: rating,
            content: content,
            images: images || [],
            createdAt: new Date().toISOString(),
            likes: 0
        };
        reviews.unshift(review);
        this.saveReviews(reviews);
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (user) { user.reviews = user.reviews || []; user.reviews.push(review.id); this.saveUsers(users); }
        const fileReviews = reviews.filter(r => r.fileId === fileId);
        const avgRating = fileReviews.length > 0 ? fileReviews.reduce((sum, r) => sum + r.rating, 0) / fileReviews.length : 0;
        const file = FILE_DATA.find(f => f.id === fileId);
        if (file) { file.rating = Math.round(avgRating * 10) / 10; file.sold = fileReviews.length; saveGlobalFiles(FILE_DATA); }
        checkAchievements(userId);
        if (!_isSyncProcessing) {
            publishMqtt('review_sync', { action: 'created', review: review });
            broadcastSync({ type: 'review_sync', action: 'created', review: review });
            forceSyncToAllUsers(true);
        }
        return review;
    },
    
    getTopDepositors(period = 'all') {
        const users = this.getUsers();
        const now = new Date();
        let filtered = users.filter(u => u.role !== 'admin' && (u.totalDeposit || 0) > 0);
        if (period === 'week') {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            filtered = filtered.filter(u => {
                const deposits = u.history?.filter(h => h.amount && h.amount.startsWith('+'));
                return deposits && deposits.some(d => new Date(d.time) > weekAgo);
            });
        } else if (period === 'month') {
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            filtered = filtered.filter(u => {
                const deposits = u.history?.filter(h => h.amount && h.amount.startsWith('+'));
                return deposits && deposits.some(d => new Date(d.time) > monthAgo);
            });
        }
        return filtered.sort((a, b) => (b.totalDeposit || 0) - (a.totalDeposit || 0));
    },
    
    getRealStats() {
        const users = this.getUsers();
        const reviews = this.getReviews();
        let totalSold = 0, totalRevenue = 0, totalReviews = reviews.length, reviewSum = 0;

        users.forEach(u => {
            if (u.history && Array.isArray(u.history)) {
                u.history.forEach(h => {
                    if (h.amount && typeof h.amount === 'string' && h.amount.startsWith('-')) {
                        totalSold++;
                        const num = parseInt(h.amount.replace(/[^0-9]/g, ''));
                        if (!isNaN(num)) totalRevenue += num;
                    }
                });
            }
        });

        reviews.forEach(r => {
            if (r.rating && typeof r.rating === 'number') reviewSum += r.rating;
        });
        const avgRating = totalReviews > 0 ? Math.round((reviewSum / totalReviews) * 10) / 10 : 0;

        const top = this.getTopDepositors('all');
        const topName = top.length > 0 ? top[0].username : 'Chưa có';
        const topAmount = top.length > 0 ? (top[0].totalDeposit || 0) : 0;

        return {
            totalSold: totalSold,
            totalRevenue: totalRevenue,
            totalReviews: totalReviews,
            avgRating: avgRating,
            topDepositor: topName,
            topAmount: topAmount
        };
    },
    
    getAdminStats() {
        const users = this.getUsers();
        const reviews = this.getReviews();
        let totalUsers = 0, totalBalance = 0, pendingDeposits = 0, todayRevenue = 0, vipUsers = 0;
        const today = new Date().toDateString();
        users.forEach(user => {
            totalUsers++;
            totalBalance += user.balance || 0;
            if ((user.vipLevel || 0) > 0) vipUsers++;
            if (user.depositRequests && Array.isArray(user.depositRequests)) {
                pendingDeposits += user.depositRequests.filter(r => r.status === 'pending').length;
            }
            if (user.history) {
                user.history.forEach(h => {
                    if (new Date(h.time).toDateString() === today) {
                        const num = parseInt(h.amount ? h.amount.replace(/[^0-9]/g, '') : '0');
                        if (h.amount && h.amount.startsWith('+')) todayRevenue += num;
                    }
                });
            }
        });
        return { totalUsers, totalBalance, pendingDeposits, todayRevenue, vipUsers, totalReviews: reviews.length };
    },
    
    getEvents() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS)) || EVENTS; } catch { return EVENTS; }
    },
    saveEvents(events) {
        localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
        if (!_isSyncProcessing) {
            publishMqtt('event_sync', { action: 'update_all', events: events });
            broadcastSync({ type: 'event_sync', action: 'update_all', events: events });
            forceSyncToAllUsers(true);
        }
    },
    addEvent(eventData) {
        const events = this.getEvents();
        const newEvent = { id: Date.now(), ...eventData };
        events.push(newEvent);
        this.saveEvents(events);
        if (!_isSyncProcessing) {
            publishMqtt('event_sync', { action: 'created', event: newEvent });
            broadcastSync({ type: 'event_sync', action: 'created', event: newEvent });
            forceSyncToAllUsers(true);
        }
        return newEvent;
    },
    updateEvent(eventId, data) {
        const events = this.getEvents();
        const idx = events.findIndex(e => e.id === eventId);
        if (idx === -1) return null;
        events[idx] = { ...events[idx], ...data };
        this.saveEvents(events);
        if (!_isSyncProcessing) {
            publishMqtt('event_sync', { action: 'updated', event: events[idx] });
            broadcastSync({ type: 'event_sync', action: 'updated', event: events[idx] });
            forceSyncToAllUsers(true);
        }
        return events[idx];
    },
    deleteEvent(eventId) {
        let events = this.getEvents();
        events = events.filter(e => e.id !== eventId);
        this.saveEvents(events);
        if (!_isSyncProcessing) {
            publishMqtt('event_sync', { action: 'deleted', eventId });
            broadcastSync({ type: 'event_sync', action: 'deleted', eventId });
            forceSyncToAllUsers(true);
        }
        return true;
    },
    
    getGiftcodes() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY_GIFTCODES)) || []; } catch { return []; }
    },
    saveGiftcodes(codes) {
        localStorage.setItem(STORAGE_KEY_GIFTCODES, JSON.stringify(codes));
        if (!_isSyncProcessing) {
            publishMqtt('giftcode_sync', { action: 'update_all', codes: codes });
            broadcastSync({ type: 'giftcode_sync', action: 'update_all', codes: codes });
            forceSyncToAllUsers(true);
        }
    },
    createGiftcode(code, value) {
        const codes = this.getGiftcodes();
        if (codes.find(c => c.code === code)) return { success: false, message: 'Mã giftcode đã tồn tại!' };
        const newCode = { code: code.toUpperCase(), value: value, used: false, createdAt: new Date().toISOString(), usedBy: null };
        codes.push(newCode);
        this.saveGiftcodes(codes);
        if (!_isSyncProcessing) {
            publishMqtt('giftcode_sync', { action: 'created', code: newCode });
            broadcastSync({ type: 'giftcode_sync', action: 'created', code: newCode });
            forceSyncToAllUsers(true);
        }
        return { success: true, message: 'Tạo giftcode thành công!', data: newCode };
    },
    deleteGiftcode(code) {
        let codes = this.getGiftcodes();
        codes = codes.filter(c => c.code !== code);
        this.saveGiftcodes(codes);
        if (!_isSyncProcessing) {
            publishMqtt('giftcode_sync', { action: 'deleted', code: code });
            broadcastSync({ type: 'giftcode_sync', action: 'deleted', code: code });
            forceSyncToAllUsers(true);
        }
        return true;
    },
    redeemGiftcode(code, userId) {
        const codes = this.getGiftcodes();
        const found = codes.find(c => c.code === code.toUpperCase());
        if (!found) return { success: false, message: 'Mã giftcode không tồn tại!' };
        if (found.used) return { success: false, message: 'Mã giftcode đã được sử dụng!' };
        found.used = true;
        found.usedBy = userId;
        found.usedAt = new Date().toISOString();
        this.saveGiftcodes(codes);
        const user = this.addDeposit(userId, found.value);
        if (user) {
            return { success: true, message: `Nhận ${found.value.toLocaleString()}đ từ giftcode!`, amount: found.value };
        }
        return { success: false, message: 'Lỗi khi cộng tiền!' };
    },
    
    editUser(userId, data) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return null;
        Object.assign(user, data);
        this.saveUsers(users);
        const current = this.getCurrentUser();
        if (current && current.id === userId) {
            Object.assign(current, data);
            this.saveCurrentUser(current);
        }
        if (!_isSyncProcessing) {
            publishMqtt('user_sync', { action: 'updated', userId: user.id, username: user.username, user: user });
            broadcastSync({ type: 'user_sync', action: 'updated', userId: user.id, username: user.username, user: user });
            forceSyncToAllUsers(true);
        }
        return user;
    },
    
    changePassword(userId, newPassword) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return null;
        user.password = newPassword;
        this.saveUsers(users);
        if (!_isSyncProcessing) {
            publishMqtt('user_sync', { action: 'password_changed', userId: user.id, username: user.username });
            broadcastSync({ type: 'user_sync', action: 'password_changed', userId: user.id, username: user.username });
            forceSyncToAllUsers(true);
        }
        return user;
    },
    
    lockUser(userId) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return null;
        user.locked = true;
        this.saveUsers(users);
        if (!_isSyncProcessing) {
            publishMqtt('user_sync', { action: 'locked', userId: user.id, username: user.username });
            broadcastSync({ type: 'user_sync', action: 'locked', userId: user.id, username: user.username });
            forceSyncToAllUsers(true);
        }
        const current = this.getCurrentUser();
        if (current && current.id === userId) {
            this.logout();
            showToast('🔒 Tài khoản của bạn đã bị khóa!', 'fas fa-lock', 'error');
            setTimeout(() => { location.reload(); }, 1500);
        }
        return user;
    },
    
    unlockUser(userId) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return null;
        user.locked = false;
        this.saveUsers(users);
        if (!_isSyncProcessing) {
            publishMqtt('user_sync', { action: 'unlocked', userId: user.id, username: user.username });
            broadcastSync({ type: 'user_sync', action: 'unlocked', userId: user.id, username: user.username });
            forceSyncToAllUsers(true);
        }
        return user;
    },
    
    deleteUser(userId) {
        if (userId === 'admin_001') return { success: false, message: 'Không thể xóa admin!' };
        const user = this.getUserById(userId);
        let users = this.getUsers();
        users = users.filter(u => u.id !== userId);
        this.saveUsers(users);
        if (!_isSyncProcessing) {
            publishMqtt('user_sync', { action: 'deleted', userId: userId, username: user?.username });
            broadcastSync({ type: 'user_sync', action: 'deleted', userId: userId, username: user?.username });
            forceSyncToAllUsers(true);
        }
        if (APP.isLoggedIn && APP.currentUser.id === userId) {
            this.logout();
            showToast('❌ Tài khoản của bạn đã bị xóa!', 'fas fa-user-slash', 'error');
            setTimeout(() => { location.reload(); }, 1500);
        }
        return { success: true, message: 'Đã xóa user!' };
    },
    
    getSpinWeights() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY_SPIN_WEIGHTS)) || SPIN_PRIZES.map(() => 1); } catch { return SPIN_PRIZES.map(() => 1); }
    },
    saveSpinWeights(weights) {
        localStorage.setItem(STORAGE_KEY_SPIN_WEIGHTS, JSON.stringify(weights));
        if (!_isSyncProcessing) {
            publishMqtt('spin_weights_sync', { weights: weights });
            broadcastSync({ type: 'spin_weights_sync', weights: weights });
            forceSyncToAllUsers(true);
        }
    },
    saveSpinHistory(userId, entry) {
        const user = this.getUserById(userId);
        if (!user) return;
        user.spinHistory = user.spinHistory || [];
        user.spinHistory.unshift(entry);
        this.saveUsers(this.getUsers());
        const current = this.getCurrentUser();
        if (current && current.id === userId) {
            current.spinHistory = user.spinHistory;
            this.saveCurrentUser(current);
        }
        forceSyncToAllUsers(true);
    },
    getSpinHistory(userId) {
        const user = this.getUserById(userId);
        return user?.spinHistory || [];
    }
};

// ============================================================
//  BANK CONFIG
// ============================================================
function getBankConfig() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_BANK);
        if (stored) {
            const parsed = JSON.parse(stored);
            return { Momo: { ...DEFAULT_BANK_CONFIG.Momo, ...parsed.Momo }, MBBank: { ...DEFAULT_BANK_CONFIG.MBBank, ...parsed.MBBank } };
        }
    } catch (e) {}
    return DEFAULT_BANK_CONFIG;
}
function saveBankConfig(config) {
    localStorage.setItem(STORAGE_KEY_BANK, JSON.stringify(config));
    if (!_isSyncProcessing) {
        publishMqtt('settings_sync', { bankConfig: config });
        broadcastSync({ type: 'settings_sync', bankConfig: config });
        forceSyncToAllUsers(true);
    }
}

// ============================================================
//  SUPPORT LINKS
// ============================================================
function getSupportLinks() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_SUPPORT)) || { zalo: '0358888888', facebook: 'Tấn Dũng FF', telegram: '@TandungFF' }; }
    catch { return { zalo: '0358888888', facebook: 'Tấn Dũng FF', telegram: '@TandungFF' }; }
}
function saveSupportLinks(data) {
    localStorage.setItem(STORAGE_KEY_SUPPORT, JSON.stringify(data));
    updateSupportUI(data);
    if (!_isSyncProcessing) {
        publishMqtt('settings_sync', { supportLinks: data });
        broadcastSync({ type: 'settings_sync', supportLinks: data });
        forceSyncToAllUsers(true);
    }
}

// ============================================================
//  GIỎ HÀNG
// ============================================================
function getCart() {
    try { const data = localStorage.getItem(STORAGE_KEY_CART); return data ? JSON.parse(data) : []; } catch { return []; }
}
function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    updateCartUI();
    renderCart();
    try { localStorage.setItem('ff_sync_trigger', Date.now().toString()); } catch (e) {}
    if (!_isSyncProcessing) {
        publishMqtt('cart_sync', { cart: cart });
        broadcastSync({ type: 'cart_sync', cart: cart });
        forceSyncToAllUsers(true);
    }
}
function addToCart(fileId) {
    if (!Auth.isLoggedIn()) {
        showToast('Vui lòng đăng nhập để thêm vào giỏ!', 'fas fa-triangle-exclamation', 'error');
        openModal('loginModal');
        return;
    }
    const cart = getCart();
    if (cart.some(item => item.id === fileId)) {
        showToast('File đã có trong giỏ hàng!', 'fas fa-info-circle', 'warning');
        return;
    }
    const file = FILE_DATA.find(f => f.id === fileId);
    if (!file) { showToast('File không tồn tại!', 'fas fa-triangle-exclamation', 'error'); return; }
    cart.push({ id: file.id, name: file.name, price: file.price, img: file.img });
    saveCart(cart);
    showToast(`Đã thêm "${file.name}" vào giỏ hàng!`, 'fas fa-cart-plus', 'success');
    triggerConfetti();
}
function removeFromCart(fileId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== fileId);
    saveCart(cart);
    renderCart();
    showToast('Đã xóa khỏi giỏ hàng!', 'fas fa-trash', 'warning');
}
function clearCart() {
    saveCart([]);
    renderCart();
    showToast('Đã xóa toàn bộ giỏ hàng!', 'fas fa-trash', 'warning');
}
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.price, 0);
}
function updateCartUI() {
    const cart = getCart();
    const count = cart.length;
    const cartBadge = document.getElementById('cartCount');
    const navCartCount = document.getElementById('navCartCount');
    if (cartBadge) cartBadge.textContent = count;
    if (navCartCount) navCartCount.textContent = count;
}
function renderCart() {
    const container = document.getElementById('cartContainer');
    if (!container) return;
    const cart = getCart();
    if (cart.length === 0) {
        container.innerHTML = `<div class="cart-empty"><i class="fas fa-cart-plus"></i><p>Giỏ hàng của bạn đang trống</p><button class="btn-submit" style="width:auto;padding:10px 30px;margin-top:10px;" onclick="switchTab('filesTab')"><i class="fas fa-shopping-bag"></i> Mua sắm ngay</button></div>`;
        return;
    }
    const discount = APP.isLoggedIn && !APP.isAdmin ? Auth.getDiscount(APP.currentUser.id) : 0;
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = Math.round(total * (1 - discount / 100));
    const hasDiscount = discount > 0 && finalTotal < total;
    container.innerHTML = `<div style="margin-bottom:16px;">${cart.map(item => `<div class="cart-item"><img src="${item.img || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100'}" alt="${item.name}"><div class="info"><div class="name">${item.name}</div><div class="price">${item.price.toLocaleString()}đ</div></div><button class="btn-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-times"></i> Xóa</button></div>`).join('')}</div><div class="cart-summary"><div><div style="font-size:14px;color:var(--text-muted);">Tạm tính: ${total.toLocaleString()}đ${hasDiscount ? `<span style="color:#ffd700;font-size:12px;margin-left:8px;">(-${discount}% VIP)</span>` : ''}</div><div class="total">${finalTotal.toLocaleString()}đ</div></div><div style="display:flex;gap:10px;flex-wrap:wrap;"><button class="btn-submit" style="width:auto;padding:10px 20px;background:#ff4d4d;box-shadow:none;" onclick="clearCart()"><i class="fas fa-trash"></i> Xóa hết</button><button class="btn-checkout" onclick="checkoutCart()"><i class="fas fa-credit-card"></i> Thanh toán</button></div></div>`;
}
function checkoutCart() {
    if (!Auth.isLoggedIn()) { showToast('Vui lòng đăng nhập!', 'fas fa-triangle-exclamation', 'error'); openModal('loginModal'); return; }
    if (APP.isAdmin) { showToast('Admin không cần mua hàng!', 'fas fa-wrench', 'warning'); return; }
    const cart = getCart();
    if (cart.length === 0) { showToast('Giỏ hàng trống!', 'fas fa-triangle-exclamation', 'error'); return; }
    const discount = Auth.getDiscount(APP.currentUser.id);
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = Math.round(total * (1 - discount / 100));
    if (APP.balance < finalTotal) { showToast('Số dư không đủ! Vui lòng nạp thêm.', 'fas fa-wallet', 'error'); switchTab('depositTab'); return; }
    const purchased = cart.map(item => item);
    processCheckout(purchased, finalTotal, discount);
}
function processCheckout(purchased, finalTotal, discount) {
    if (purchased.length === 0) { showToast('Không có file để mua!', 'fas fa-info-circle', 'warning'); return; }
    const user = Auth.updateBalance(APP.currentUser.id, -finalTotal, `Mua ${purchased.length} file${discount > 0 ? ` (giảm ${discount}% VIP)` : ''}`);
    if (!user) { showToast('Lỗi khi thanh toán!', 'fas fa-triangle-exclamation', 'error'); return; }
    purchased.forEach(item => {
        Auth.addPurchasedFile(APP.currentUser.id, item.id, item.name);
        const file = FILE_DATA.find(f => f.id === item.id);
        if (file) {
            file.sold = (file.sold || 0) + 1;
            saveGlobalFiles(FILE_DATA);
        }
    });
    APP.balance = user.balance;
    APP.history = user.history;
    APP.purchasedFiles = Auth.getCurrentUser().purchasedFiles || [];
    DOM.userBalance.textContent = APP.balance.toLocaleString();
    DOM.profileBalance.textContent = APP.balance.toLocaleString() + 'đ';
    clearCart();
    renderHistory();
    updateRealStats();
    updateMissions('purchase');
    checkAchievements(APP.currentUser.id);
    showToast(`Thanh toán thành công ${purchased.length} file!`, 'fas fa-check-circle', 'success');
    triggerConfetti();
    switchTab('historyTab');
}
function buyNow(fileId) {
    if (!Auth.isLoggedIn()) { showToast('Vui lòng đăng nhập để mua!', 'fas fa-triangle-exclamation', 'error'); openModal('loginModal'); return; }
    if (APP.isAdmin) { showToast('Admin không cần mua hàng!', 'fas fa-wrench', 'warning'); return; }
    const file = FILE_DATA.find(f => f.id === fileId);
    if (!file) { showToast('File không tồn tại!', 'fas fa-triangle-exclamation', 'error'); return; }
    const discount = Auth.getDiscount(APP.currentUser.id);
    const finalPrice = Math.round(file.price * (1 - discount / 100));
    if (APP.balance < finalPrice) { showToast('Số dư không đủ! Vui lòng nạp thêm.', 'fas fa-wallet', 'error'); switchTab('depositTab'); return; }
    Swal.fire({
        title: 'Xác nhận mua ngay',
        html: `Bạn có chắc muốn mua <b>${file.name}</b> với giá <b style="color:#00ff88;">${finalPrice.toLocaleString()}đ</b>?`,
        icon: 'question',
        background: '#040814',
        color: '#fff',
        confirmButtonColor: '#00ff88',
        cancelButtonColor: '#ff4d4d',
        showCancelButton: true,
        confirmButtonText: 'Mua ngay',
        cancelButtonText: 'Hủy'
    }).then(res => {
        if (res.isConfirmed) {
            const user = Auth.updateBalance(APP.currentUser.id, -finalPrice, `Mua ngay: ${file.name}${discount > 0 ? ` (giảm ${discount}% VIP)` : ''}`);
            if (!user) { showToast('Lỗi khi thanh toán!', 'fas fa-triangle-exclamation', 'error'); return; }
            Auth.addPurchasedFile(APP.currentUser.id, file.id, file.name);
            file.sold = (file.sold || 0) + 1;
            saveGlobalFiles(FILE_DATA);
            APP.balance = user.balance;
            APP.history = user.history;
            APP.purchasedFiles = Auth.getCurrentUser().purchasedFiles || [];
            DOM.userBalance.textContent = APP.balance.toLocaleString();
            DOM.profileBalance.textContent = APP.balance.toLocaleString() + 'đ';
            renderHistory();
            updateRealStats();
            updateMissions('purchase');
            checkAchievements(APP.currentUser.id);
            showToast(`Mua thành công: ${file.name}!`, 'fas fa-check-circle', 'success');
            triggerConfetti();
            renderFiles();
            renderFileGrid();
        }
    });
}

// ============================================================
//  DEPOSIT - QR
// ============================================================
function generateQR(amount, method) {
    const config = APP.bankConfig[method];
    if (!config) return null;
    const user = Auth.getCurrentUser();
    const username = user ? user.username : 'USER';
    const content = `NAP TANDUNG ${username}`;
    const account = config.account;
    const accountName = config.accountName;
    let qrUrl = config.qrImage;
    if (!qrUrl) {
        const bankId = config.bankId || (method === 'Momo' ? 'MOMO' : '970422');
        qrUrl = `https://api.vietqr.io/image/${bankId}-${account}-${accountName}.jpg?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(accountName)}`;
    }
    return { qrUrl, content, account, bankName: config.name, amount };
}
function openDepositWithMethod(method) {
    APP.selectedMethod = method;
    openModal('depositModal');
    document.querySelectorAll('.payment-option').forEach(el => {
        el.classList.toggle('active', el.dataset.method === method);
        const radio = el.querySelector('input[type="radio"]');
        if (radio) radio.checked = el.classList.contains('active');
    });
}
function handleDepositSubmit(e) {
    e.preventDefault();
    if (!Auth.isLoggedIn()) { showToast('Vui lòng đăng nhập!', 'fas fa-triangle-exception', 'error'); openModal('loginModal'); return; }
    if (APP.isAdmin) { showToast('Admin không cần nạp tiền!', 'fas fa-wrench', 'warning'); return; }
    const selectedRadio = document.querySelector('input[name="payMethod"]:checked');
    const method = selectedRadio ? selectedRadio.value : 'Momo';
    const amount = parseInt(DOM.depositAmount.value);
    if (!amount || amount < 10000) { showToast('Số tiền tối thiểu 10.000đ!', 'fas fa-triangle-exclamation', 'error'); return; }
    if (amount > APP.maxDeposit) { showToast(`Số tiền vượt quá giới hạn ${APP.maxDeposit.toLocaleString()}đ!`, 'fas fa-triangle-exclamation', 'error'); return; }
    const user = Auth.getCurrentUser();
    const request = Auth.createDepositRequest(user.id, amount, method);
    if (!request) { showToast('Lỗi tạo yêu cầu!', 'fas fa-triangle-exclamation', 'error'); return; }
    APP.pendingDeposit = request;
    const qrData = generateQR(amount, method);
    if (!qrData) { showToast('Lỗi tạo QR!', 'fas fa-triangle-exclamation', 'error'); return; }
    document.getElementById('depositForm').style.display = 'none';
    document.getElementById('qrPaymentSection').style.display = 'block';
    DOM.displayQrAmount.textContent = amount.toLocaleString();
    DOM.qrBankName.textContent = qrData.bankName;
    DOM.qrContent.textContent = qrData.content;
    DOM.qrAccount.textContent = qrData.account;
    const bonus = Math.floor(amount * 0.02);
    if (DOM.qrBonusDisplay) DOM.qrBonusDisplay.textContent = `+${bonus.toLocaleString()}đ (VIP thưởng)`;
    if (DOM.qrLoading) DOM.qrLoading.classList.remove('hidden');
    DOM.qrImage.style.display = 'none';
    DOM.qrImage.onload = function() {
        if (DOM.qrLoading) DOM.qrLoading.classList.add('hidden');
        DOM.qrImage.style.display = 'block';
    };
    DOM.qrImage.onerror = function() {
        if (DOM.qrLoading) DOM.qrLoading.classList.add('hidden');
        DOM.qrImage.style.display = 'none';
        document.querySelector('.qr-code-wrapper').innerHTML = `<div style="text-align:center;padding:30px;"><i class="fas fa-university" style="font-size:48px;color:var(--primary);display:block;margin-bottom:10px;"></i><p style="color:var(--text-muted);font-size:13px;">Chuyển khoản đến: <b style="color:var(--text-main);">${qrData.account}</b><br>Ngân hàng: <b style="color:var(--text-main);">${qrData.bankName}</b><br>Nội dung: <b style="color:var(--text-main);">${qrData.content}</b><br>Số tiền: <b style="color:#ffaa00;">${qrData.amount.toLocaleString()}đ</b></p></div>`;
    };
    DOM.qrImage.src = qrData.qrUrl;
    showToast(`Đã tạo yêu cầu nạp ${amount.toLocaleString()}đ!`, 'fas fa-clock', 'warning');
    setTimeout(publishFullState, 500);
}
function confirmPaid() {
    if (!APP.pendingDeposit) { showToast('Không tìm thấy yêu cầu!', 'fas fa-triangle-exclamation', 'error'); return; }
    showToast('Đã gửi yêu cầu! Chờ admin duyệt (5-15 phút).', 'fas fa-clock', 'warning');
    setTimeout(() => {
        closeModal('depositModal');
        document.getElementById('depositForm').style.display = 'block';
        document.getElementById('qrPaymentSection').style.display = 'none';
        DOM.depositAmount.value = '';
        APP.pendingDeposit = null;
        DOM.qrImage.src = '';
        DOM.qrImage.style.display = 'none';
        if (DOM.qrLoading) DOM.qrLoading.classList.add('hidden');
    }, 3000);
}
function cancelDeposit() {
    if (APP.pendingDeposit && Auth.isLoggedIn()) {
        const user = Auth.getCurrentUser();
        Auth.cancelDepositRequest(user.id, APP.pendingDeposit.id);
        APP.pendingDeposit = null;
    }
    closeModal('depositModal');
    document.getElementById('depositForm').style.display = 'block';
    document.getElementById('qrPaymentSection').style.display = 'none';
    DOM.depositAmount.value = '';
    DOM.qrImage.src = '';
    DOM.qrImage.style.display = 'none';
    if (DOM.qrLoading) DOM.qrLoading.classList.add('hidden');
    showToast('Đã hủy yêu cầu!', 'fas fa-times-circle');
}
function handleDepositPage(e) {
    e.preventDefault();
    if (!Auth.isLoggedIn()) { showToast('Vui lòng đăng nhập!', 'fas fa-triangle-exclamation', 'error'); openModal('loginModal'); return; }
    if (APP.isAdmin) { showToast('Admin không cần nạp tiền!', 'fas fa-wrench', 'warning'); return; }
    const method = document.getElementById('pagePayMethod').value;
    const amount = parseInt(DOM.pageDepositAmount.value);
    if (!amount || amount < 10000) { showToast('Số tiền tối thiểu 10.000đ!', 'fas fa-triangle-exclamation', 'error'); return; }
    if (amount > APP.maxDeposit) { showToast(`Số tiền vượt quá giới hạn ${APP.maxDeposit.toLocaleString()}đ!`, 'fas fa-triangle-exclamation', 'error'); return; }
    APP.selectedMethod = method;
    openModal('depositModal');
    DOM.depositAmount.value = amount;
    document.querySelectorAll('.payment-option').forEach(el => {
        el.classList.toggle('active', el.dataset.method === method);
        const radio = el.querySelector('input[type="radio"]');
        if (radio) radio.checked = el.classList.contains('active');
    });
    setTimeout(publishFullState, 500);
}
function updateDepositUsername() {
    const user = Auth.getCurrentUser();
    if (DOM.depositUsernameDisplay) DOM.depositUsernameDisplay.textContent = user ? user.username : 'Chưa đăng nhập';
    if (DOM.depositPageUsername) DOM.depositPageUsername.textContent = user ? user.username : 'chưa đăng nhập';
}

// ============================================================
//  BIỂU ĐỒ DOANH THU
// ============================================================
let revenueChart = null;
let revenueData = [];

function getRevenueData() {
    const users = Auth.getUsers();
    const today = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toDateString();
        let dailyRevenue = 0;
        users.forEach(u => {
            if (u.history) {
                u.history.forEach(h => {
                    if (h.amount && h.amount.startsWith('-') && new Date(h.time).toDateString() === dateStr) {
                        const num = parseInt(h.amount.replace(/[^0-9]/g, ''));
                        if (!isNaN(num)) dailyRevenue += num;
                    }
                });
            }
        });
        data.push({
            date: d.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' }),
            revenue: dailyRevenue
        });
    }
    return data;
}

function updateRevenueChart() {
    try {
        revenueData = getRevenueData();
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;
        const labels = revenueData.map(d => d.date);
        const values = revenueData.map(d => d.revenue);
        
        if (revenueChart) {
            revenueChart.destroy();
        }
        revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: values,
                    borderColor: '#00f0ff',
                    backgroundColor: 'rgba(0, 240, 255, 0.15)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00f0ff',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#fff',
                            font: { size: 12, weight: 'bold' },
                            boxWidth: 12,
                            padding: 12
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#00ff88',
                        borderColor: '#00f0ff',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y.toLocaleString() + 'đ';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        ticks: { color: '#94a3b8', font: { size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 10 },
                            callback: function(value) {
                                if (value >= 1000000) return (value/1000000).toFixed(1) + 'M';
                                if (value >= 1000) return (value/1000).toFixed(0) + 'k';
                                return value;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
        const totalRevenue = values.reduce((a, b) => a + b, 0);
        if (document.getElementById('dashTotalRevenue')) document.getElementById('dashTotalRevenue').textContent = totalRevenue.toLocaleString() + 'đ';
        if (document.getElementById('adminTodayRevenue')) document.getElementById('adminTodayRevenue').textContent = (values[values.length-1] || 0).toLocaleString() + 'đ';
        updateAdminDashboardChart();
    } catch(e) {
        console.log('Chart update error:', e);
    }
}

function updateAdminDashboardChart() {
    try {
        const ctx = document.getElementById('adminDashboardChart');
        if (!ctx) return;
        if (window._adminChart) {
            window._adminChart.destroy();
        }
        const data = getRevenueData();
        const labels = data.map(d => d.date);
        const values = data.map(d => d.revenue);
        window._adminChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh thu 7 ngày',
                    data: values,
                    backgroundColor: 'rgba(0, 240, 255, 0.5)',
                    borderColor: '#00f0ff',
                    borderWidth: 1,
                    borderRadius: 6,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#fff', font: { size: 10 } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#00ff88',
                        borderColor: '#00f0ff',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 10,
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y.toLocaleString() + 'đ';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        ticks: { color: '#94a3b8', font: { size: 9 } }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 9 },
                            callback: function(value) {
                                if (value >= 1000000) return (value/1000000).toFixed(1) + 'M';
                                if (value >= 1000) return (value/1000).toFixed(0) + 'k';
                                return value;
                            }
                        }
                    }
                }
            }
        });
    } catch(e) {
        console.log('Admin chart update error:', e);
    }
}

// ============================================================
//  APP STATE
// ============================================================
const APP = {
    isLoggedIn: false,
    currentUser: null,
    isAdmin: false,
    balance: 0,
    history: [],
    spinCount: 0,
    winCount: 0,
    vipLevel: 0,
    vipPoints: 0,
    totalDeposit: 0,
    files: [],
    filteredFiles: [],
    currentCategory: 'all',
    searchQuery: '',
    viewMode: 'grid',
    filePage: 0,
    filesPerPage: 6,
    pendingDeposit: null,
    depositFilter: 'all',
    selectedMethod: 'Momo',
    maxDeposit: 1000000,
    selectedRating: 5,
    currentFilePage: 1,
    spinHistory: [],
    spinLuckiest: 'Chưa có',
    isSpinning: false,
    adminTab: 'adminDashboard',
    purchasedFiles: [],
    bankConfig: getBankConfig()
};

// ============================================================
//  DOM REFS (GIỮ NGUYÊN)
// ============================================================
const DOM = {
    cursor: document.getElementById('cursor'),
    cursorDot: document.getElementById('cursorDot'),
    cursorTrail: document.getElementById('cursorTrail'),
    toastContainer: document.getElementById('toast-container'),
    balanceBadge: document.getElementById('balanceBadge'),
    userBalance: document.getElementById('userBalance'),
    authSection: document.getElementById('authSection'),
    userProfileBadge: document.getElementById('userProfileBadge'),
    userDisplayName: document.getElementById('userDisplayName'),
    userAvatar: document.getElementById('userAvatar'),
    adminBadge: document.getElementById('adminBadge'),
    vipBadgeHeader: document.getElementById('vipBadgeHeader'),
    vipLevelHeader: document.getElementById('vipLevelHeader'),
    vipBadgeHeaderSmall: document.getElementById('vipBadgeHeaderSmall'),
    userDropdown: document.getElementById('userDropdown'),
    adminDropdownLink: document.getElementById('adminDropdownLink'),
    adminNavLink: document.getElementById('adminNavLink'),
    mobileToggle: document.getElementById('mobileToggle'),
    navLinks: document.getElementById('navLinks'),
    scrollTop: document.getElementById('scrollTopBtn'),
    searchInput: document.getElementById('searchInput'),
    categoryMenu: document.getElementById('categoryMenu'),
    productGrid: document.getElementById('productGridContainer'),
    totalProducts: document.getElementById('totalProducts'),
    totalSold: document.getElementById('totalSold'),
    avgRating: document.getElementById('avgRating'),
    liveUsers: document.getElementById('liveUsers'),
    realTotalSold: document.getElementById('realTotalSold'),
    realAvgRating: document.getElementById('realAvgRating'),
    realTotalRevenue: document.getElementById('realTotalRevenue'),
    realTopDeposit: document.getElementById('realTopDeposit'),
    fileGridContainer: document.getElementById('fileGridContainer'),
    fileSearchInput: document.getElementById('fileSearchInput'),
    fileCategoryFilter: document.getElementById('fileCategoryFilter'),
    filePriceFilter: document.getElementById('filePriceFilter'),
    fileSortFilter: document.getElementById('fileSortFilter'),
    filePageInfo: document.getElementById('filePageInfo'),
    spinWheel: document.getElementById('spinWheel'),
    spinCountToday: document.getElementById('spinCountToday'),
    spinWinCount: document.getElementById('spinWinCount'),
    spinLuckiest: document.getElementById('spinLuckiest'),
    spinTotalSpent: document.getElementById('spinTotalSpent'),
    spinHistoryList: document.getElementById('spinHistoryList'),
    eventsGrid: document.getElementById('eventsGrid'),
    missionsGrid: document.getElementById('missionsGrid'),
    historyBody: document.getElementById('historyBody'),
    vipUserInfo: document.getElementById('vipUserInfo'),
    vipAvatar: document.getElementById('vipAvatar'),
    vipLevelBadge: document.getElementById('vipLevelBadge'),
    vipUsername: document.getElementById('vipUsername'),
    vipProgressFill: document.getElementById('vipProgressFill'),
    vipProgressText: document.getElementById('vipProgressText'),
    vipTotalDeposit: document.getElementById('vipTotalDeposit'),
    vipDiscountDisplay: document.getElementById('vipDiscountDisplay'),
    vipPoints: document.getElementById('vipPoints'),
    vipBanner: document.getElementById('vipBanner'),
    vipLevelText: document.getElementById('vipLevelText'),
    vipDiscountText: document.getElementById('vipDiscountText'),
    vipBonusInfo: document.getElementById('vipBonusInfo'),
    vipBonusAmount: document.getElementById('vipBonusAmount'),
    depositVipText: document.getElementById('depositVipText'),
    depositVipDiscount: document.getElementById('depositVipDiscount'),
    depositAmount: document.getElementById('depositAmount'),
    pageDepositAmount: document.getElementById('pageDepositAmount'),
    qrImage: document.getElementById('qrImage'),
    qrLoading: document.getElementById('qrLoading'),
    displayQrAmount: document.getElementById('displayQrAmount'),
    qrBankName: document.getElementById('qrBankName'),
    qrContent: document.getElementById('qrContent'),
    qrAccount: document.getElementById('qrAccount'),
    qrAccountRow: document.getElementById('qrAccountRow'),
    qrBonusDisplay: document.getElementById('qrBonusDisplay'),
    depositLimitWarning: document.getElementById('depositLimitWarning'),
    depositUsernameDisplay: document.getElementById('depositUsernameDisplay'),
    depositPageUsername: document.getElementById('depositPageUsername'),
    reviewsContainer: document.getElementById('reviewsContainer'),
    reviewTotal: document.getElementById('reviewTotal'),
    reviewAvg: document.getElementById('reviewAvg'),
    reviewWithImages: document.getElementById('reviewWithImages'),
    reviewFilterProduct: document.getElementById('reviewFilterProduct'),
    reviewFilterRating: document.getElementById('reviewFilterRating'),
    reviewProduct: document.getElementById('reviewProduct'),
    reviewRating: document.getElementById('reviewRating'),
    reviewContent: document.getElementById('reviewContent'),
    reviewImages: document.getElementById('reviewImages'),
    reviewImagePreview: document.getElementById('reviewImagePreview'),
    fileDetailContent: document.getElementById('fileDetailContent'),
    topList: document.getElementById('topList'),
    profileUsername: document.getElementById('profileUsername'),
    profileEmail: document.getElementById('profileEmail'),
    profileBalance: document.getElementById('profileBalance'),
    profileRole: document.getElementById('profileRole'),
    profileVipLevel: document.getElementById('profileVipLevel'),
    profileDiscount: document.getElementById('profileDiscount'),
    profileVipBadge: document.getElementById('profileVipBadge'),
    profileReviewCount: document.getElementById('profileReviewCount'),
    profileAvatar: document.getElementById('profileAvatar'),
    adminTotalUsers: document.getElementById('adminTotalUsers'),
    adminTotalBalance: document.getElementById('adminTotalBalance'),
    adminPendingDeposits: document.getElementById('adminPendingDeposits'),
    adminTodayRevenue: document.getElementById('adminTodayRevenue'),
    adminVIPUsers: document.getElementById('adminVIPUsers'),
    adminTotalReviews: document.getElementById('adminTotalReviews'),
    adminTotalFiles: document.getElementById('adminTotalFiles'),
    adminDepositRequests: document.getElementById('adminDepositRequests'),
    adminUserBody: document.getElementById('adminUserBody'),
    adminToday: document.getElementById('adminToday'),
    adminTime: document.getElementById('adminTime'),
    pendingBadge: document.getElementById('pendingBadge'),
    userCountBadge: document.getElementById('userCountBadge'),
    adminGiftcodeList: document.getElementById('adminGiftcodeList'),
    adminEventList: document.getElementById('adminEventList'),
    adminFileList: document.getElementById('adminFileList'),
    adminGiftcodeCode: document.getElementById('adminGiftcodeCode'),
    adminGiftcodeValue: document.getElementById('adminGiftcodeValue'),
    adminMaxDeposit: document.getElementById('adminMaxDeposit'),
    adminSystemUsers: document.getElementById('adminSystemUsers'),
    adminSystemTransactions: document.getElementById('adminSystemTransactions'),
    adminSystemVIP: document.getElementById('adminSystemVIP'),
    adminSpinWeights: document.getElementById('adminSpinWeights'),
    adminTotalSpins: document.getElementById('adminTotalSpins'),
    adminTotalSpinWins: document.getElementById('adminTotalSpinWins'),
    adminTotalSpinAmount: document.getElementById('adminTotalSpinAmount'),
    adminZaloInput: document.getElementById('adminZaloInput'),
    adminFbInput: document.getElementById('adminFbInput'),
    adminTelegramInput: document.getElementById('adminTelegramInput'),
    adminEditFileId: document.getElementById('adminEditFileId'),
    adminEditFileName: document.getElementById('adminEditFileName'),
    adminEditFilePrice: document.getElementById('adminEditFilePrice'),
    adminEditFileCategory: document.getElementById('adminEditFileCategory'),
    adminEditFileBadge: document.getElementById('adminEditFileBadge'),
    adminEditFileImg: document.getElementById('adminEditFileImg'),
    adminEditFileDownload: document.getElementById('adminEditFileDownload'),
    adminEditFileNote: document.getElementById('adminEditFileNote'),
    supportZaloText: document.getElementById('supportZaloText'),
    supportFbText: document.getElementById('supportFbText'),
    supportTelegramText: document.getElementById('supportTelegramText'),
    securityLog: document.getElementById('securityLog'),
    dashTotalUsers: document.getElementById('dashTotalUsers'),
    dashTotalRevenue: document.getElementById('dashTotalRevenue'),
    dashTotalOrders: document.getElementById('dashTotalOrders'),
    dashTotalVIP: document.getElementById('dashTotalVIP'),
    dashTotalReviews: document.getElementById('dashTotalReviews'),
    dashTotalFiles: document.getElementById('dashTotalFiles'),
    musicStatus: document.getElementById('musicStatus'),
    playBtn: document.getElementById('playBtn'),
    adminMomoAccount: document.getElementById('adminMomoAccount'),
    adminMomoName: document.getElementById('adminMomoName'),
    adminMomoQR: document.getElementById('adminMomoQR'),
    adminMomoQRPreview: document.getElementById('adminMomoQRPreview'),
    adminMBBankAccount: document.getElementById('adminMBBankAccount'),
    adminMBBankName: document.getElementById('adminMBBankName'),
    adminMBBankQR: document.getElementById('adminMBBankQR'),
    adminMBBankQRPreview: document.getElementById('adminMBBankQRPreview'),
    cartContainer: document.getElementById('cartContainer'),
    cartCount: document.getElementById('cartCount'),
    navCartCount: document.getElementById('navCartCount'),
    userDashboardContainer: document.getElementById('userDashboardContainer'),
    achievementsContainer: document.getElementById('achievementsContainer'),
    adminReportsContainer: document.getElementById('adminReportsContainer')
};

// ============================================================
//  SECURITY - CHỐNG F12, DEBUG, XSS (GIỮ NGUYÊN)
// ============================================================
(function antiF12Pro() {
    document.addEventListener('keydown', function(e) {
        const blockedCombos = [
            { key: 'F12', code: 123 },
            { ctrl: true, shift: true, key: 'I' },
            { ctrl: true, shift: true, key: 'J' },
            { ctrl: true, key: 'U' },
            { ctrl: true, key: 'S' },
            { ctrl: true, shift: true, key: 'C' },
            { ctrl: true, shift: true, key: 'K' }
        ];
        for (let combo of blockedCombos) {
            if ((!combo.ctrl || e.ctrlKey) && (!combo.shift || e.shiftKey) && (e.key === combo.key || e.keyCode === combo.code || e.keyCode === combo.key?.charCodeAt(0))) {
                e.preventDefault();
                e.stopPropagation();
                securityLog('⚠️ Phát hiện DevTools shortcut - Đã chặn');
                showToast('🚫 Chức năng bị vô hiệu hóa!', 'fas fa-shield-halved', 'error');
                return false;
            }
        }
    }, { capture: true, passive: false });
})();

(function antiRightClickPro() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        securityLog('⚠️ Phát hiện Right Click - Đã chặn');
        showToast('🚫 Menu chuột phải bị vô hiệu hóa!', 'fas fa-shield-halved', 'error');
        return false;
    }, { capture: true, passive: false });
    document.addEventListener('dragstart', function(e) { e.preventDefault(); return false; }, { capture: true, passive: false });
})();

(function antiDebugPro() {
    let devToolsOpen = false;
    let detectionCount = 0;
    const threshold = 160;
    const maxDetections = 3;
    function checkDevTools() {
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        if (widthDiff > threshold || heightDiff > threshold) {
            detectionCount++;
            if (detectionCount > maxDetections && !devToolsOpen) {
                devToolsOpen = true;
                securityLog('🚨 PHÁT HIỆN DEVTOOLS MỞ!');
                console.clear();
                showToast('🚫 Phát hiện DevTools! Đã vô hiệu hóa.', 'fas fa-shield-halved', 'error');
                window.console.log = function() {};
                window.console.warn = function() {};
                window.console.error = function() {};
                window.console.info = function() {};
                window.console.debug = function() {};
                window.console.clear = function() {};
                window.debugger = function() {};
            }
        } else { detectionCount = 0; devToolsOpen = false; }
    }
    setInterval(checkDevTools, 300);
    const originalConsole = window.console;
    window.console = new Proxy(originalConsole, {
        get: function(target, prop) {
            if (['log', 'warn', 'error', 'info', 'debug', 'clear'].includes(prop)) return function() {};
            return target[prop];
        }
    });
    const originalEval = window.eval;
    window.eval = function(code) {
        if (code && code.includes('debugger')) { securityLog('⚠️ Phát hiện debugger statement - Đã chặn'); return null; }
        return originalEval(code);
    };
})();

(function antiXSSPro() {
    function sanitizeInput(input) {
        if (!input) return '';
        return input.replace(/<script.*?>.*?<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/onerror/gi, '')
            .replace(/onload/gi, '')
            .replace(/onclick/gi, '')
            .replace(/onmouseover/gi, '')
            .replace(/onfocus/gi, '')
            .replace(/eval\(/gi, '')
            .replace(/document\./gi, '')
            .replace(/window\./gi, '')
            .replace(/location\./gi, '')
            .replace(/\.innerHTML/gi, '')
            .replace(/\.outerHTML/gi, '');
    }
    document.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            const sanitized = sanitizeInput(e.target.value);
            if (sanitized !== e.target.value) {
                e.target.value = sanitized;
                securityLog('⚠️ Phát hiện XSS attempt - Đã lọc');
                showToast('🚫 Phát hiện nội dung không hợp lệ!', 'fas fa-shield-halved', 'error');
            }
        }
    }, { passive: false, capture: true });
})();

function initSecurity() {
    securityLog('🟢 Hệ thống bảo mật khởi tạo thành công');
    securityLog('🟢 Chống F12 đã kích hoạt');
    securityLog('🟢 Chống Debug đã kích hoạt');
    securityLog('🟢 Chống XSS đã kích hoạt');
    securityLog('🟢 Anti-Copy Pro đã kích hoạt');
    securityLog('🟢 Brute Force Protection đã kích hoạt');
    securityLog('🟢 Chống trùng lặp deposit đã kích hoạt');
    securityLog('🔒 Mọi hệ thống bảo mật đang hoạt động');
}
setTimeout(initSecurity, 1000);

// ============================================================
//  SESSION MANAGEMENT (GIỮ NGUYÊN)
// ============================================================
function checkSession() {
    const user = Auth.getCurrentUser();
    if (user) {
        const remember = localStorage.getItem(STORAGE_KEY_REMEMBER);
        if (remember === 'true') loginSuccess(user);
        else Auth.logout();
    }
}
function loginSuccess(user) {
    APP.isLoggedIn = true;
    APP.currentUser = user;
    APP.isAdmin = user.role === 'admin';
    APP.balance = user.balance || 0;
    APP.history = user.history || [];
    APP.spinCount = user.spinCount || 0;
    APP.winCount = user.winCount || 0;
    APP.vipLevel = user.vipLevel || 0;
    APP.vipPoints = user.vipPoints || 0;
    APP.totalDeposit = user.totalDeposit || 0;
    APP.spinHistory = user.spinHistory || [];
    APP.purchasedFiles = user.purchasedFiles || [];
    DOM.balanceBadge.style.display = 'flex';
    DOM.userBalance.textContent = APP.balance.toLocaleString();
    DOM.authSection.style.display = 'none';
    DOM.userProfileBadge.style.display = 'flex';
    DOM.userDisplayName.textContent = user.username;
    updateDepositUsername();
    if (APP.vipLevel > 0) {
        DOM.vipBadgeHeader.style.display = 'flex';
        DOM.vipLevelHeader.textContent = VIP_CONFIG[APP.vipLevel].name;
        DOM.vipBadgeHeaderSmall.style.display = 'inline-block';
        DOM.vipBadgeHeaderSmall.textContent = 'VIP ' + APP.vipLevel;
    } else {
        DOM.vipBadgeHeader.style.display = 'none';
        DOM.vipBadgeHeaderSmall.style.display = 'none';
    }
    if (APP.isAdmin) {
        DOM.adminBadge.style.display = 'inline-block';
        DOM.adminNavLink.style.display = 'block';
        DOM.adminDropdownLink.style.display = 'flex';
    } else {
        DOM.adminBadge.style.display = 'none';
        DOM.adminNavLink.style.display = 'none';
        DOM.adminDropdownLink.style.display = 'none';
    }
    if (user.avatar) {
        DOM.userAvatar.src = user.avatar;
        DOM.profileAvatar.src = user.avatar;
        DOM.vipAvatar.src = user.avatar;
    }
    DOM.profileUsername.textContent = user.username;
    DOM.profileEmail.textContent = user.email || 'Chưa cập nhật';
    DOM.profileBalance.textContent = (user.balance || 0).toLocaleString() + 'đ';
    DOM.profileRole.textContent = APP.isAdmin ? 'Quản trị viên' : 'Người dùng';
    DOM.profileRole.className = APP.isAdmin ? 'role-admin' : 'role-user';
    DOM.profileVipLevel.textContent = VIP_CONFIG[APP.vipLevel].name;
    DOM.profileDiscount.textContent = VIP_CONFIG[APP.vipLevel].discount + '%';
    DOM.profileVipBadge.textContent = VIP_CONFIG[APP.vipLevel].name;
    DOM.profileVipBadge.style.background = APP.vipLevel > 0 ? `linear-gradient(135deg,${VIP_CONFIG[APP.vipLevel].color},${VIP_CONFIG[APP.vipLevel].color}dd)` : 'linear-gradient(135deg,#94a3b8,#64748b)';
    const userReviews = Auth.getReviews().filter(r => r.userId === user.id);
    if (DOM.profileReviewCount) DOM.profileReviewCount.textContent = userReviews.length;
    updateVIPUI(user);
    document.querySelectorAll('.login-required-msg').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.protected-price-area').forEach(el => el.style.display = 'flex');
    DOM.spinCountToday.textContent = APP.spinCount;
    DOM.spinWinCount.textContent = APP.winCount;
    renderHistory();
    renderSpinHistory();
    if (APP.isAdmin) renderAdminDashboard();
    updateRealStats();
    renderMissions();
    renderAchievements();
    checkAchievements(user.id);
    showToast(`Chào mừng ${user.username}!`, 'fas fa-circle-check', 'success');
    updateSyncStatus('Đã đăng nhập', true);
    setTimeout(() => {
        publishMqtt('sync_request', {});
        broadcastSync({ type: 'sync_request' });
        setTimeout(() => publishFullState({ silent: true }), 1000);
    }, 500);
    setTimeout(updateRevenueChart, 1000);
}

// ============================================================
//  VIP UI UPDATE (GIỮ NGUYÊN)
// ============================================================
function updateVIPUI(user) {
    const vipInfo = Auth.getVipInfo(user);
    const level = vipInfo.level;
    const config = vipInfo.config;
    if (DOM.vipLevelText) DOM.vipLevelText.textContent = config.name;
    if (DOM.vipDiscountText) DOM.vipDiscountText.textContent = `Giảm ${config.discount}%`;
    if (DOM.depositVipText) DOM.depositVipText.textContent = config.name;
    if (DOM.depositVipDiscount) DOM.depositVipDiscount.textContent = `Giảm ${config.discount}%`;
    const bonus = Math.floor((APP.totalDeposit || 0) * 0.02);
    if (DOM.vipBonusAmount) DOM.vipBonusAmount.textContent = bonus.toLocaleString();
    if (DOM.vipBonusInfo) DOM.vipBonusInfo.style.display = bonus > 0 ? 'flex' : 'none';
    if (DOM.vipUsername) DOM.vipUsername.textContent = user.username;
    if (DOM.vipLevelBadge) {
        DOM.vipLevelBadge.textContent = config.name;
        DOM.vipLevelBadge.style.background = level > 0 ? `linear-gradient(135deg,${config.color},${config.color}dd)` : 'linear-gradient(135deg,#94a3b8,#64748b)';
    }
    if (DOM.vipProgressFill) DOM.vipProgressFill.style.width = vipInfo.progress + '%';
    if (DOM.vipProgressText) {
        if (vipInfo.nextLevel) DOM.vipProgressText.textContent = `${(user.totalDeposit || 0).toLocaleString()}đ / ${vipInfo.nextLevel.minDeposit.toLocaleString()}đ để lên ${vipInfo.nextLevel.name}`;
        else DOM.vipProgressText.textContent = '🎉 Đã đạt cấp VIP cao nhất!';
    }
    if (DOM.vipTotalDeposit) DOM.vipTotalDeposit.textContent = (user.totalDeposit || 0).toLocaleString() + 'đ';
    if (DOM.vipDiscountDisplay) DOM.vipDiscountDisplay.textContent = config.discount + '%';
    if (DOM.vipPoints) DOM.vipPoints.textContent = (user.vipPoints || 0).toLocaleString();
}

// ============================================================
//  AUTH HANDLERS (GIỮ NGUYÊN)
// ============================================================
function handleLoginSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;
    if (!username || !password) { showToast('Vui lòng nhập đầy đủ thông tin!', 'fas fa-triangle-exclamation', 'error'); return; }
    const result = Auth.login(username, password, remember);
    if (result.success) {
        closeModal('loginModal');
        loginSuccess(result.user);
        triggerConfetti();
        showToast(result.message, 'fas fa-circle-check', 'success');
        document.getElementById('loginForm').reset();
    } else showToast(result.message, 'fas fa-triangle-exclamation', 'error');
}
function handleRegisterSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;
    if (!username || username.length < 3) { showToast('Tên đăng nhập tối thiểu 3 ký tự!', 'fas fa-triangle-exclamation', 'error'); return; }
    if (!email || !email.includes('@')) { showToast('Email không hợp lệ!', 'fas fa-triangle-exclamation', 'error'); return; }
    if (!password || password.length < 6) { showToast('Mật khẩu tối thiểu 6 ký tự!', 'fas fa-triangle-exclamation', 'error'); return; }
    if (password !== confirm) { showToast('Mật khẩu xác nhận không khớp!', 'fas fa-triangle-exclamation', 'error'); return; }
    const result = Auth.register(username, email, password);
    if (result.success) {
        showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'fas fa-circle-check', 'success');
        triggerConfetti();
        closeModal('registerModal');
        document.getElementById('loginUsername').value = username;
        document.getElementById('loginPassword').value = password;
        setTimeout(() => openModal('loginModal'), 400);
    } else showToast(result.message, 'fas fa-triangle-exclamation', 'error');
}
function handleLogout() {
    Auth.logout();
    APP.isLoggedIn = false;
    APP.currentUser = null;
    APP.isAdmin = false;
    APP.purchasedFiles = [];
    DOM.balanceBadge.style.display = 'none';
    DOM.authSection.style.display = 'flex';
    DOM.userProfileBadge.style.display = 'none';
    DOM.adminBadge.style.display = 'none';
    DOM.vipBadgeHeader.style.display = 'none';
    DOM.vipBadgeHeaderSmall.style.display = 'none';
    DOM.adminNavLink.style.display = 'none';
    DOM.adminDropdownLink.style.display = 'none';
    DOM.userDropdown.classList.remove('show');
    document.querySelectorAll('.login-required-msg').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.protected-price-area').forEach(el => el.style.display = 'none');
    showToast('Đã đăng xuất!', 'fas fa-sign-out-alt');
    updateSyncStatus('Chưa đăng nhập', false);
    switchTab('homeTab');
    setTimeout(publishFullState, 500);
}
function toggleUserMenu() { DOM.userDropdown.classList.toggle('show'); }
document.addEventListener('click', (e) => { if (!e.target.closest('.user-actions')) DOM.userDropdown.classList.remove('show'); });
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') { input.type = 'text'; icon.classList.replace('fa-eye', 'fa-eye-slash'); }
    else { input.type = 'password'; icon.classList.replace('fa-eye-slash', 'fa-eye'); }
}

// ============================================================
//  ADMIN FUNCTIONS - GIỮ NGUYÊN
// ============================================================
function renderAdminQRConfig() {
    const config = getBankConfig();
    const momo = config.Momo || DEFAULT_BANK_CONFIG.Momo;
    const mbbank = config.MBBank || DEFAULT_BANK_CONFIG.MBBank;
    const momoAccount = document.getElementById('adminMomoAccount');
    const momoName = document.getElementById('adminMomoName');
    const mbAccount = document.getElementById('adminMBBankAccount');
    const mbName = document.getElementById('adminMBBankName');
    const momoPreview = document.getElementById('adminMomoQRPreview');
    const mbPreview = document.getElementById('adminMBBankQRPreview');
    if (momoAccount) momoAccount.value = momo.account || '';
    if (momoName) momoName.value = momo.accountName || '';
    if (mbAccount) mbAccount.value = mbbank.account || '';
    if (mbName) mbName.value = mbbank.accountName || '';
    if (momoPreview && momo.qrImage) momoPreview.innerHTML = `<img src="${momo.qrImage}" style="width:100%;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">`;
    if (mbPreview && mbbank.qrImage) mbPreview.innerHTML = `<img src="${mbbank.qrImage}" style="width:100%;border-radius:8px;border:1px solid rgba(255,255,255,0.1);">`;
}
function adminSaveQRConfig() {
    const momoQRInput = document.getElementById('adminMomoQR');
    const mbQRInput = document.getElementById('adminMBBankQR');
    function readFileAsBase64(file) { return new Promise((resolve) => { const reader = new FileReader(); reader.onload = (e) => resolve(e.target.result); reader.readAsDataURL(file); }); }
    Promise.all([
        momoQRInput && momoQRInput.files.length > 0 ? readFileAsBase64(momoQRInput.files[0]) : Promise.resolve(null),
        mbQRInput && mbQRInput.files.length > 0 ? readFileAsBase64(mbQRInput.files[0]) : Promise.resolve(null)
    ]).then(([momoQR, mbQR]) => {
        const config = getBankConfig();
        config.Momo = { ...config.Momo, account: document.getElementById('adminMomoAccount').value.trim(), accountName: document.getElementById('adminMomoName').value.trim(), qrImage: momoQR || config.Momo.qrImage || '' };
        config.MBBank = { ...config.MBBank, account: document.getElementById('adminMBBankAccount').value.trim(), accountName: document.getElementById('adminMBBankName').value.trim(), qrImage: mbQR || config.MBBank.qrImage || '' };
        saveBankConfig(config);
        APP.bankConfig = config;
        renderAdminQRConfig();
        showToast('Đã cập nhật QR Code!', 'fas fa-circle-check', 'success');
        setTimeout(() => forceSyncToAllUsers(true), 100);
    });
}

function renderAdminGiftcodes() {
    const container = DOM.adminGiftcodeList;
    if (!container) return;
    const codes = Auth.getGiftcodes();
    if (codes.length === 0) { container.innerHTML = '<div style="color:var(--text-muted);padding:20px;text-align:center;">Chưa có giftcode nào</div>'; return; }
    container.innerHTML = codes.map(c => `<div class="giftcode-item"><span class="code">${c.code}</span><span class="value">${c.value.toLocaleString()}đ</span><span class="status ${c.used ? 'used' : 'active'}">${c.used ? '✅ Đã dùng' : '🟢 Còn hiệu lực'}</span><span style="font-size:12px;color:var(--text-muted);">${c.used ? 'Bởi: ' + (c.usedBy || 'N/A') : ''}</span><button class="btn-delete-code" onclick="adminDeleteGiftcode('${c.code}')"><i class="fas fa-trash"></i></button></div>`).join('');
}

function adminCreateGiftcode(e) {
    e.preventDefault();
    const code = DOM.adminGiftcodeCode.value.trim().toUpperCase();
    const value = parseInt(DOM.adminGiftcodeValue.value);
    if (!code || !value || value < 1000) {
        showToast('Vui lòng nhập đầy đủ thông tin!', 'fas fa-triangle-exclamation', 'error');
        return;
    }
    const result = Auth.createGiftcode(code, value);
    if (result.success) {
        showToast(result.message, 'fas fa-circle-check', 'success');
        DOM.adminGiftcodeCode.value = '';
        DOM.adminGiftcodeValue.value = '';
        renderAdminGiftcodes();
        setTimeout(() => forceSyncToAllUsers(true), 100);
    } else {
        showToast(result.message, 'fas fa-triangle-exclamation', 'error');
    }
}

function adminDeleteGiftcode(code) {
    Swal.fire({
        title: 'Xóa giftcode?',
        text: `Xóa mã ${code}?`,
        icon: 'warning',
        background: '#040814',
        color: '#fff',
        confirmButtonColor: '#ff4d4d',
        cancelButtonColor: '#94a3b8',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then(res => {
        if (res.isConfirmed) {
            Auth.deleteGiftcode(code);
            showToast('Đã xóa giftcode!', 'fas fa-circle-check', 'success');
            renderAdminGiftcodes();
            setTimeout(() => forceSyncToAllUsers(true), 100);
        }
    });
}

function renderAdminEvents() {
    const container = DOM.adminEventList;
    if (!container) return;
    const events = Auth.getEvents();
    if (events.length === 0) { container.innerHTML = '<div style="color:var(--text-muted);padding:20px;text-align:center;">Chưa có sự kiện nào</div>'; return; }
    container.innerHTML = events.map(e => `<div class="admin-event-item"><div class="event-header"><div><div class="event-name">${e.icon} ${e.name}</div><div class="event-detail">${e.desc} | 🎁 ${e.reward} | 📅 ${e.time}</div></div><div class="event-actions"><span class="event-status ${e.status}">${e.status === 'active' ? '🟢 Đang diễn ra' : e.status === 'coming' ? '🟡 Sắp tới' : '🔴 Đã kết thúc'}</span><button class="btn-edit-event" onclick="adminEditEvent(${e.id})"><i class="fas fa-edit"></i></button><button class="btn-delete-event" onclick="adminDeleteEvent(${e.id})"><i class="fas fa-trash"></i></button></div></div></div>`).join('');
}

function adminShowCreateEvent() {
    Swal.fire({
        title: 'Tạo sự kiện mới',
        html: `<div style="text-align:left;color:#fff;"><div style="margin-bottom:12px;"><label style="color:var(--text-muted);font-size:13px;">Tên sự kiện</label><input id="eventName" class="form-control" placeholder="VD: Sale Cuối Tuần" style="margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="color:var(--text-muted);font-size:13px;">Mô tả</label><input id="eventDesc" class="form-control" placeholder="VD: Giảm 20% tất cả file" style="margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="color:var(--text-muted);font-size:13px;">Phần thưởng</label><input id="eventReward" class="form-control" placeholder="VD: Giảm 20%" style="margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="color:var(--text-muted);font-size:13px;">Icon (emoji)</label><input id="eventIcon" class="form-control" placeholder="VD: 🎉" value="🎉" style="margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="color:var(--text-muted);font-size:13px;">Thời gian</label><input id="eventTime" class="form-control" placeholder="VD: 01/03 - 15/03" style="margin-top:4px;"></div><div><label style="color:var(--text-muted);font-size:13px;">Trạng thái</label><select id="eventStatus" class="form-control" style="margin-top:4px;"><option value="active">Đang diễn ra</option><option value="coming">Sắp tới</option><option value="ended">Đã kết thúc</option></select></div></div>`,
        background: '#040814',
        color: '#fff',
        confirmButtonColor: '#00f0ff',
        cancelButtonColor: '#ff4d4d',
        showCancelButton: true,
        confirmButtonText: 'Tạo sự kiện',
        cancelButtonText: 'Hủy',
        didOpen: () => { document.querySelectorAll('.form-control').forEach(el => { el.style.background = 'rgba(255,255,255,0.04)'; el.style.border = '1px solid rgba(255,255,255,0.1)'; el.style.borderRadius = '10px'; el.style.padding = '10px 14px'; el.style.color = '#fff'; el.style.outline = 'none'; el.style.width = '100%'; }); }
    }).then(res => {
        if (res.isConfirmed) {
            const name = document.getElementById('eventName').value.trim();
            const desc = document.getElementById('eventDesc').value.trim();
            const reward = document.getElementById('eventReward').value.trim();
            const icon = document.getElementById('eventIcon').value.trim() || '🎉';
            const time = document.getElementById('eventTime').value.trim();
            const status = document.getElementById('eventStatus').value;
            if (name && desc && reward) {
                Auth.addEvent({ name, desc, reward, icon, time, status });
                showToast('Tạo sự kiện thành công!', 'fas fa-circle-check', 'success');
                renderAdminEvents();
                renderEvents();
                setTimeout(() => forceSyncToAllUsers(true), 100);
            } else {
                showToast('Vui lòng điền đầy đủ thông tin!', 'fas fa-triangle-exclamation', 'error');
            }
        }
    });
}

function adminEditEvent(eventId) {
    const events = Auth.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    Swal.fire({
        title: 'Chỉnh sửa sự kiện',
        html: `<div style="text-align:left;color:#fff;"><div style="margin-bottom:12px;"><label style="color:var(--text-muted);font-size:13px;">Tên sự kiện</label><input id="editEventName" class="form-control" value="${event.name}" style="margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="color:var(--text-muted);font-size:13px;">Mô tả</label><input id="editEventDesc" class="form-control" value="${event.desc}" style="margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="color:var(--text-muted);font-size:13px;">Phần thưởng</label><input id="editEventReward" class="form-control" value="${event.reward}" style="margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="color:var(--text-muted);font-size:13px;">Icon</label><input id="editEventIcon" class="form-control" value="${event.icon}" style="margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="color:var(--text-muted);font-size:13px;">Thời gian</label><input id="editEventTime" class="form-control" value="${event.time}" style="margin-top:4px;"></div><div><label style="color:var(--text-muted);font-size:13px;">Trạng thái</label><select id="editEventStatus" class="form-control" style="margin-top:4px;"><option value="active" ${event.status === 'active' ? 'selected' : ''}>Đang diễn ra</option><option value="coming" ${event.status === 'coming' ? 'selected' : ''}>Sắp tới</option><option value="ended" ${event.status === 'ended' ? 'selected' : ''}>Đã kết thúc</option></select></div></div>`,
        background: '#040814',
        color: '#fff',
        confirmButtonColor: '#00f0ff',
        cancelButtonColor: '#ff4d4d',
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Hủy',
        didOpen: () => { document.querySelectorAll('.form-control').forEach(el => { el.style.background = 'rgba(255,255,255,0.04)'; el.style.border = '1px solid rgba(255,255,255,0.1)'; el.style.borderRadius = '10px'; el.style.padding = '10px 14px'; el.style.color = '#fff'; el.style.outline = 'none'; el.style.width = '100%'; }); }
    }).then(res => {
        if (res.isConfirmed) {
            const name = document.getElementById('editEventName').value.trim();
            const desc = document.getElementById('editEventDesc').value.trim();
            const reward = document.getElementById('editEventReward').value.trim();
            const icon = document.getElementById('editEventIcon').value.trim();
            const time = document.getElementById('editEventTime').value.trim();
            const status = document.getElementById('editEventStatus').value;
            if (name && desc) {
                Auth.updateEvent(eventId, { name, desc, reward, icon, time, status });
                showToast('Cập nhật sự kiện thành công!', 'fas fa-circle-check', 'success');
                renderAdminEvents();
                renderEvents();
                setTimeout(() => forceSyncToAllUsers(true), 100);
            }
        }
    });
}

function adminDeleteEvent(eventId) {
    Swal.fire({
        title: 'Xóa sự kiện?',
        text: 'Bạn có chắc muốn xóa sự kiện này?',
        icon: 'warning',
        background: '#040814',
        color: '#fff',
        confirmButtonColor: '#ff4d4d',
        cancelButtonColor: '#94a3b8',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then(res => {
        if (res.isConfirmed) {
            Auth.deleteEvent(eventId);
            showToast('Đã xóa sự kiện!', 'fas fa-circle-check', 'success');
            renderAdminEvents();
            renderEvents();
            setTimeout(() => forceSyncToAllUsers(true), 100);
        }
    });
}

function renderAdminFiles() {
    const container = DOM.adminFileList;
    if (!container) return;
    FILE_DATA = getGlobalFiles();
    container.innerHTML = FILE_DATA.map(f => `<div class="admin-file-item"><span class="file-name"><i class="fas fa-file"></i> ${f.name}</span><span class="file-price">${f.price.toLocaleString()}đ</span><span class="file-category">${f.category} | ⭐ ${f.rating}</span><span class="file-download-link">${f.downloadLink ? '🔗 Có link' : '❌ Chưa có link'}</span><div class="file-actions"><button class="btn-edit-file" onclick="adminEditFile(${f.id})"><i class="fas fa-edit"></i></button><button class="btn-delete-file" onclick="adminDeleteFile(${f.id})"><i class="fas fa-trash"></i></button></div></div>`).join('');
}

function adminEditFile(fileId) {
    FILE_DATA = getGlobalFiles();
    const file = FILE_DATA.find(f => f.id === fileId);
    if (!file) return;
    DOM.adminEditFileId.value = file.id;
    DOM.adminEditFileName.value = file.name;
    DOM.adminEditFilePrice.value = file.price;
    DOM.adminEditFileCategory.value = file.category;
    DOM.adminEditFileBadge.value = file.badge || '';
    DOM.adminEditFileImg.value = file.img || '';
    DOM.adminEditFileDownload.value = file.downloadLink || '';
    DOM.adminEditFileNote.value = file.note || '';
    document.querySelector('#adminEditFileModal h2').innerHTML = '<i class="fas fa-edit"></i> Chỉnh Sửa File';
    const submitBtn = document.querySelector('#adminEditFileForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Lưu file';
    submitBtn.onclick = function(e) { e.preventDefault(); adminSaveFileEdit(e); };
    openModal('adminEditFileModal');
}

function adminSaveFileEdit(e) {
    e.preventDefault();
    const id = parseInt(DOM.adminEditFileId.value);
    const name = DOM.adminEditFileName.value.trim();
    const price = parseInt(DOM.adminEditFilePrice.value);
    const category = DOM.adminEditFileCategory.value;
    const badge = DOM.adminEditFileBadge.value.trim();
    const img = DOM.adminEditFileImg.value.trim();
    const downloadLink = DOM.adminEditFileDownload.value.trim();
    const note = DOM.adminEditFileNote.value.trim();

    if (!name || isNaN(price) || price < 0) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'fas fa-triangle-exclamation', 'error');
        return;
    }

    FILE_DATA = getGlobalFiles();
    const idx = FILE_DATA.findIndex(f => f.id === id);
    if (idx === -1) {
        showToast('File không tồn tại!', 'fas fa-triangle-exclamation', 'error');
        return;
    }
    FILE_DATA[idx] = {
        ...FILE_DATA[idx],
        name,
        price,
        category,
        badge: badge || 'New',
        img: img || FILE_DATA[idx].img,
        downloadLink: downloadLink || '',
        note: note || ''
    };
    saveGlobalFiles(FILE_DATA);
    APP.files = [...FILE_DATA];
    APP.filteredFiles = [...FILE_DATA];

    closeModal('adminEditFileModal');
    showToast('Cập nhật file thành công!', 'fas fa-circle-check', 'success');

    renderAdminFiles();
    renderFileGrid();
    renderFiles();
    updateRealStats();

    publishMqtt('files_sync', { action: 'updated', file: FILE_DATA[idx] });
    broadcastSync({ type: 'files_sync', action: 'updated', file: FILE_DATA[idx] });
    setTimeout(() => forceSyncToAllUsers(true), 100);
}

function adminShowCreateFile() {
    DOM.adminEditFileId.value = '';
    DOM.adminEditFileName.value = '';
    DOM.adminEditFilePrice.value = '';
    DOM.adminEditFileCategory.value = 'reg';
    DOM.adminEditFileBadge.value = 'New';
    DOM.adminEditFileImg.value = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400';
    DOM.adminEditFileDownload.value = '';
    DOM.adminEditFileNote.value = '';
    document.querySelector('#adminEditFileModal h2').innerHTML = '<i class="fas fa-plus"></i> Thêm File Mới';
    const submitBtn = document.querySelector('#adminEditFileForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Thêm file';
    submitBtn.onclick = function(e) { e.preventDefault(); adminCreateFile(); };
    openModal('adminEditFileModal');
}

function adminCreateFile() {
    const name = DOM.adminEditFileName.value.trim();
    const price = parseInt(DOM.adminEditFilePrice.value);
    const category = DOM.adminEditFileCategory.value;
    const badge = DOM.adminEditFileBadge.value.trim() || 'New';
    const img = DOM.adminEditFileImg.value.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400';
    const downloadLink = DOM.adminEditFileDownload.value.trim();
    const note = DOM.adminEditFileNote.value.trim();

    if (!name || isNaN(price) || price < 0) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'fas fa-triangle-exclamation', 'error');
        return;
    }

    FILE_DATA = getGlobalFiles();
    const newFile = {
        id: Date.now(),
        name: name,
        price: price,
        category: category,
        badge: badge,
        sold: 0,
        rating: 0,
        img: img,
        downloadLink: downloadLink || '',
        note: note || '',
        date: new Date().toISOString().split('T')[0]
    };
    FILE_DATA.push(newFile);
    saveGlobalFiles(FILE_DATA);
    APP.files = [...FILE_DATA];
    APP.filteredFiles = [...FILE_DATA];

    closeModal('adminEditFileModal');
    showToast('Thêm file thành công!', 'fas fa-circle-check', 'success');

    renderAdminFiles();
    renderFileGrid();
    renderFiles();
    updateRealStats();

    publishMqtt('files_sync', { action: 'created', file: newFile });
    broadcastSync({ type: 'files_sync', action: 'created', file: newFile });
    setTimeout(() => forceSyncToAllUsers(true), 100);
}

function adminDeleteFile(fileId) {
    Swal.fire({
        title: 'Xóa file?',
        text: 'Bạn có chắc muốn xóa file này?',
        icon: 'warning',
        background: '#040814',
        color: '#fff',
        confirmButtonColor: '#ff4d4d',
        cancelButtonColor: '#94a3b8',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then(res => {
        if (res.isConfirmed) {
            FILE_DATA = getGlobalFiles();
            const idx = FILE_DATA.findIndex(f => f.id === fileId);
            if (idx !== -1) {
                FILE_DATA.splice(idx, 1);
                saveGlobalFiles(FILE_DATA);
                APP.files = [...FILE_DATA];
                APP.filteredFiles = [...FILE_DATA];

                showToast('Đã xóa file!', 'fas fa-circle-check', 'success');
                renderAdminFiles();
                renderFileGrid();
                renderFiles();
                updateRealStats();

                publishMqtt('files_sync', { action: 'deleted', fileId: fileId });
                broadcastSync({ type: 'files_sync', action: 'deleted', fileId: fileId });
                setTimeout(() => forceSyncToAllUsers(true), 100);
            }
        }
    });
}

function renderAdminUsers() {
    const tbody = DOM.adminUserBody;
    if (!tbody) return;
    const users = Auth.getUsers();
    if (users.length === 0) { tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:30px;">Chưa có người dùng</td></tr>`; return; }
    tbody.innerHTML = users.map((u, i) => {
        const vip = u.vipLevel || 0;
        const vipName = VIP_CONFIG[vip]?.name || 'Thường';
        const isLocked = u.locked || false;
        return `<tr>
            <td>${i+1}</td>
            <td><strong>${u.username}</strong> ${u.role === 'admin' ? '⭐' : ''}</td>
            <td class="vip-level">${vip > 0 ? `👑 ${vipName}` : 'Thường'}</td>
            <td>${u.email || 'N/A'}</td>
            <td style="color:${u.balance > 0 ? '#00ff88' : 'var(--text-muted)'};">${(u.balance || 0).toLocaleString()}đ</td>
            <td>${(u.totalDeposit || 0).toLocaleString()}đ</td>
            <td>${isLocked ? '🔒 Đã khóa' : '✅ Hoạt động'}</td>
            <td><div class="user-actions-cell">
                <button class="btn-add-balance" onclick="adminAddBalance('${u.id}')" title="Cộng tiền"><i class="fas fa-plus"></i></button>
                <button class="btn-edit-user" onclick="adminEditUser('${u.id}')" title="Sửa thông tin"><i class="fas fa-edit"></i></button>
                <button class="btn-change-password" onclick="adminChangePassword('${u.id}')" title="Đổi mật khẩu"><i class="fas fa-key"></i></button>
                ${u.role !== 'admin' ? `
                    <button class="btn-toggle-lock" onclick="adminToggleLock('${u.id}')" title="${isLocked ? 'Mở khóa' : 'Khóa'}">
                        <i class="fas ${isLocked ? 'fa-unlock' : 'fa-lock'}"></i>
                    </button>
                    <button class="btn-delete-user" onclick="adminDeleteUser('${u.id}')" title="Xóa"><i class="fas fa-trash"></i></button>
                ` : ''}
            </div></td>
        </tr>`;
    }).join('');
}

function adminAddBalance(userId) {
    Swal.fire({ title: 'Cộng tiền cho user', text: 'Nhập số tiền muốn cộng (VNĐ)', icon: 'question', background: '#040814', color: '#fff', input: 'number', inputPlaceholder: 'Ví dụ: 50000', confirmButtonColor: '#00ff88', cancelButtonColor: '#ff4d4d', showCancelButton: true, confirmButtonText: 'Cộng tiền', cancelButtonText: 'Hủy' })
        .then(res => {
            if (res.isConfirmed && res.value) {
                const amount = parseInt(res.value);
                if (amount > 0) {
                    const user = Auth.addDeposit(userId, amount);
                    if (user) { 
                        showToast(`Đã cộng ${amount.toLocaleString()}đ cho ${user.username}!`, 'fas fa-circle-check', 'success'); 
                        renderAdminUsers(); 
                        if (APP.currentUser && APP.currentUser.id === userId) { 
                            APP.balance = user.balance; 
                            APP.totalDeposit = user.totalDeposit; 
                            APP.vipLevel = user.vipLevel; 
                            DOM.userBalance.textContent = APP.balance.toLocaleString(); 
                            updateVIPUI(user); 
                        }
                    }
                    setTimeout(() => forceSyncToAllUsers(true), 100);
                }
            }
        });
}

function adminEditUser(userId) {
    const user = Auth.getUserById(userId);
    if (!user) return;
    Swal.fire({
        title: 'Chỉnh sửa user',
        html: `<div style="text-align:left;color:#fff;"><div style="margin-bottom:12px;"><label style="color:var(--text-muted);font-size:13px;">Username</label><input id="editUsername" class="form-control" value="${user.username}" style="margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="color:var(--text-muted);font-size:13px;">Email</label><input id="editEmail" class="form-control" value="${user.email || ''}" style="margin-top:4px;"></div><div><label style="color:var(--text-muted);font-size:13px;">Vai trò</label><select id="editRole" class="form-control" style="margin-top:4px;"><option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option><option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option></select></div></div>`,
        background: '#040814',
        color: '#fff',
        confirmButtonColor: '#00f0ff',
        cancelButtonColor: '#ff4d4d',
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Hủy',
        didOpen: () => { document.querySelectorAll('.form-control').forEach(el => { el.style.background = 'rgba(255,255,255,0.04)'; el.style.border = '1px solid rgba(255,255,255,0.1)'; el.style.borderRadius = '10px'; el.style.padding = '10px 14px'; el.style.color = '#fff'; el.style.outline = 'none'; el.style.width = '100%'; }); }
    }).then(res => {
        if (res.isConfirmed) {
            const username = document.getElementById('editUsername').value.trim();
            const email = document.getElementById('editEmail').value.trim();
            const role = document.getElementById('editRole').value;
            if (username) {
                const updated = Auth.editUser(userId, { username, email, role });
                if (updated) { 
                    showToast('Cập nhật user thành công!', 'fas fa-circle-check', 'success'); 
                    renderAdminUsers(); 
                    if (APP.currentUser && APP.currentUser.id === userId) { 
                        APP.currentUser = Auth.getCurrentUser(); 
                        DOM.userDisplayName.textContent = updated.username; 
                    }
                }
                setTimeout(() => forceSyncToAllUsers(true), 100);
            }
        }
    });
}

function adminChangePassword(userId) {
    if (!APP.isAdmin) { showToast('Không có quyền!', 'fas fa-triangle-exclamation', 'error'); return; }
    Swal.fire({
        title: 'Đổi mật khẩu user',
        html: `<div style="text-align:left;color:#fff;">
            <div style="margin-bottom:12px;">
                <label style="color:var(--text-muted);font-size:13px;">Mật khẩu mới</label>
                <input id="newPassword" class="form-control" type="password" placeholder="Nhập mật khẩu mới..." style="margin-top:4px;">
            </div>
            <div>
                <label style="color:var(--text-muted);font-size:13px;">Xác nhận mật khẩu</label>
                <input id="confirmPassword" class="form-control" type="password" placeholder="Xác nhận mật khẩu..." style="margin-top:4px;">
            </div>
        </div>`,
        background: '#040814',
        color: '#fff',
        confirmButtonColor: '#00f0ff',
        cancelButtonColor: '#ff4d4d',
        showCancelButton: true,
        confirmButtonText: 'Đổi mật khẩu',
        cancelButtonText: 'Hủy',
        didOpen: () => {
            document.querySelectorAll('.form-control').forEach(el => {
                el.style.background = 'rgba(255,255,255,0.04)';
                el.style.border = '1px solid rgba(255,255,255,0.1)';
                el.style.borderRadius = '10px';
                el.style.padding = '10px 14px';
                el.style.color = '#fff';
                el.style.outline = 'none';
                el.style.width = '100%';
            });
        }
    }).then(res => {
        if (res.isConfirmed) {
            const password = document.getElementById('newPassword').value;
            const confirm = document.getElementById('confirmPassword').value;
            if (!password || password.length < 6) {
                showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'fas fa-triangle-exclamation', 'error');
                return;
            }
            if (password !== confirm) {
                showToast('Mật khẩu xác nhận không khớp!', 'fas fa-triangle-exclamation', 'error');
                return;
            }
            const user = Auth.changePassword(userId, password);
            if (user) {
                showToast(`✅ Đã đổi mật khẩu cho ${user.username}!`, 'fas fa-check-circle', 'success');
                renderAdminUsers();
                setTimeout(() => forceSyncToAllUsers(true), 100);
            }
        }
    });
}

function adminToggleLock(userId) {
    if (!APP.isAdmin) { showToast('Không có quyền!', 'fas fa-triangle-exclamation', 'error'); return; }
    const user = Auth.getUserById(userId);
    if (!user) return;
    const isLocked = user.locked || false;
    const action = isLocked ? 'mở khóa' : 'khóa';
    Swal.fire({
        title: `${isLocked ? 'Mở khóa' : 'Khóa'} tài khoản?`,
        text: `Bạn có chắc muốn ${action} tài khoản ${user.username}?`,
        icon: 'warning',
        background: '#040814',
        color: '#fff',
        confirmButtonColor: isLocked ? '#00ff88' : '#ff4d4d',
        cancelButtonColor: '#94a3b8',
        showCancelButton: true,
        confirmButtonText: isLocked ? '✅ Mở khóa' : '🔒 Khóa',
        cancelButtonText: 'Hủy'
    }).then(res => {
        if (res.isConfirmed) {
            let result;
            if (isLocked) {
                result = Auth.unlockUser(userId);
                if (result) showToast(`✅ Đã mở khóa ${user.username}!`, 'fas fa-check-circle', 'success');
            } else {
                result = Auth.lockUser(userId);
                if (result) showToast(`🔒 Đã khóa ${user.username}!`, 'fas fa-lock', 'warning');
            }
            if (result) { renderAdminUsers(); setTimeout(() => forceSyncToAllUsers(true), 100); }
        }
    });
}

function adminDeleteUser(userId) {
    Swal.fire({ title: 'Xóa user?', text: 'Bạn có chắc muốn xóa user này?', icon: 'warning', background: '#040814', color: '#fff', confirmButtonColor: '#ff4d4d', cancelButtonColor: '#94a3b8', showCancelButton: true, confirmButtonText: 'Xóa', cancelButtonText: 'Hủy' })
        .then(res => { if (res.isConfirmed) { const result = Auth.deleteUser(userId); if (result.success) { showToast(result.message, 'fas fa-circle-check', 'success'); renderAdminUsers(); setTimeout(() => forceSyncToAllUsers(true), 100); } else showToast(result.message, 'fas fa-triangle-exclamation', 'error'); } });
}

function renderDepositRequests() {
    const container = DOM.adminDepositRequests;
    if (!container) return;
    const requests = Auth.getAllDepositRequests();
    let filtered = requests;
    if (APP.depositFilter === 'pending') filtered = requests.filter(r => r.status === 'pending');
    else if (APP.depositFilter === 'approved') filtered = requests.filter(r => r.status === 'approved');
    else if (APP.depositFilter === 'rejected') filtered = requests.filter(r => r.status === 'rejected');
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    if (DOM.pendingBadge) {
        DOM.pendingBadge.textContent = pendingCount;
        DOM.pendingBadge.className = `badge ${pendingCount > 0 ? 'warning' : 'success'}`;
    }
    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);">
            <i class="fas fa-check-circle" style="font-size:32px;color:#00ff88;display:block;margin-bottom:12px;"></i>
            ${APP.depositFilter === 'pending' ? '🎉 Không có yêu cầu chờ duyệt' : '📭 Không có yêu cầu nào'}
        </div>`;
        return;
    }
    container.innerHTML = filtered.map(req => {
        const isPending = req.status === 'pending';
        const isApproved = req.status === 'approved';
        const isRejected = req.status === 'rejected';
        const highlight = isPending ? 'border-left: 3px solid #ffaa00; background: rgba(255,170,0,0.04);' : '';
        const statusText = isPending ? '⏳ Chờ duyệt' : isApproved ? '✅ Đã duyệt' : '❌ Từ chối';
        const statusClass = isPending ? 'pending' : isApproved ? 'approved' : 'rejected';
        return `<div class="deposit-request-item" style="${highlight}">
            <div class="req-info">
                <div class="req-user">
                    ${req.username} 
                    <span class="req-email">(${req.userEmail || 'N/A'})</span>
                    ${req.userVip > 0 ? `⭐ VIP ${req.userVip}` : ''}
                    ${isPending ? '<span style="color:#ffaa00;font-size:10px;margin-left:8px;">🟡 Mới</span>' : ''}
                    ${isApproved ? '<span style="color:#00ff88;font-size:10px;margin-left:8px;">✅ Đã duyệt</span>' : ''}
                    ${isRejected ? '<span style="color:#ff4d4d;font-size:10px;margin-left:8px;">❌ Từ chối</span>' : ''}
                </div>
                <div class="req-amount">${req.amount.toLocaleString()}đ</div>
                <div class="req-time">
                    <i class="fas fa-clock"></i> ${new Date(req.createdAt).toLocaleString('vi-VN')} | ${req.method}
                    ${req.updatedAt ? ` <span style="color:var(--text-muted);font-size:11px;">(cập nhật: ${new Date(req.updatedAt).toLocaleTimeString('vi-VN')})</span>` : ''}
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                <span class="req-status ${statusClass}">${statusText}</span>
                ${isPending ? `
                    <div class="req-actions">
                        <button class="btn-approve" onclick="approveDeposit('${req.id}')">
                            <i class="fas fa-check"></i> Duyệt
                        </button>
                        <button class="btn-reject" onclick="rejectDeposit('${req.id}')">
                            <i class="fas fa-times"></i> Từ chối
                        </button>
                    </div>
                ` : ''}
                ${isRejected && req.note ? `<span style="font-size:12px;color:#ff4d4d;">Lý do: ${req.note}</span>` : ''}
                ${isApproved ? `<span style="font-size:12px;color:#00ff88;">✅ Đã cộng ${req.amount.toLocaleString()}đ</span>` : ''}
            </div>
        </div>`;
    }).join('');
}

function filterDeposits(filter) {
    APP.depositFilter = filter;
    document.querySelectorAll('.admin-section-actions .btn-filter').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
    renderDepositRequests();
}

function approveDeposit(id) {
    if (!APP.isAdmin) {
        showToast('Không có quyền!', 'fas fa-triangle-exclamation', 'error');
        return;
    }
    Swal.fire({
        title: 'Duyệt nạp tiền?',
        text: 'Xác nhận duyệt yêu cầu này?',
        icon: 'question',
        background: '#040814',
        color: '#fff',
        confirmButtonColor: '#00ff88',
        cancelButtonColor: '#ff4d4d',
        showCancelButton: true,
        confirmButtonText: '✅ Duyệt',
        cancelButtonText: 'Hủy'
    }).then(res => {
        if (res.isConfirmed) {
            Auth.approveDeposit(id);
        }
    });
}

function rejectDeposit(id) {
    if (!APP.isAdmin) {
        showToast('Không có quyền!', 'fas fa-triangle-exclamation', 'error');
        return;
    }
    Swal.fire({
        title: 'Từ chối nạp tiền?',
        text: 'Lý do từ chối?',
        icon: 'warning',
        background: '#040814',
        color: '#fff',
        confirmButtonColor: '#ff4d4d',
        cancelButtonColor: '#94a3b8',
        showCancelButton: true,
        input: 'text',
        inputPlaceholder: 'Lý do (không bắt buộc)',
        confirmButtonText: 'Từ chối',
        cancelButtonText: 'Hủy'
    }).then(res => {
        if (res.isConfirmed) {
            Auth.rejectDeposit(id, res.value || '');
        }
    });
}

function renderAdminDashboard() {
    if (!APP.isAdmin) return;
    const stats = Auth.getAdminStats();
    const users = Auth.getUsers();
    const reviews = Auth.getReviews();
    const files = FILE_DATA || [];
    
    DOM.adminTotalUsers.textContent = stats.totalUsers;
    DOM.adminTotalBalance.textContent = stats.totalBalance.toLocaleString() + 'đ';
    DOM.adminPendingDeposits.textContent = stats.pendingDeposits;
    DOM.adminTodayRevenue.textContent = stats.todayRevenue.toLocaleString() + 'đ';
    DOM.adminVIPUsers.textContent = stats.vipUsers;
    DOM.adminTotalReviews.textContent = stats.totalReviews;
    DOM.adminTotalFiles.textContent = files.length;
    
    if (DOM.dashTotalUsers) DOM.dashTotalUsers.textContent = stats.totalUsers;
    if (DOM.dashTotalRevenue) DOM.dashTotalRevenue.textContent = stats.todayRevenue.toLocaleString() + 'đ';
    if (DOM.dashTotalOrders) { let totalOrders = 0; users.forEach(u => totalOrders += (u.history || []).filter(h => h.amount && h.amount.startsWith('-')).length); DOM.dashTotalOrders.textContent = totalOrders; }
    if (DOM.dashTotalVIP) DOM.dashTotalVIP.textContent = stats.vipUsers;
    if (DOM.dashTotalReviews) DOM.dashTotalReviews.textContent = stats.totalReviews;
    if (DOM.dashTotalFiles) DOM.dashTotalFiles.textContent = files.length;
    
    const realStats = Auth.getRealStats();
    if (DOM.realTotalSold) DOM.realTotalSold.textContent = realStats.totalSold;
    if (DOM.realAvgRating) DOM.realAvgRating.textContent = realStats.avgRating > 0 ? realStats.avgRating + ' ★' : 'Chưa có';
    if (DOM.realTotalRevenue) DOM.realTotalRevenue.textContent = realStats.totalRevenue.toLocaleString() + 'đ';
    if (DOM.realTopDeposit) DOM.realTopDeposit.textContent = realStats.topDepositor !== 'Chưa có' ? `${realStats.topDepositor} (${realStats.topAmount.toLocaleString()}đ)` : 'Chưa có';
    
    if (DOM.pendingBadge) { DOM.pendingBadge.textContent = stats.pendingDeposits; DOM.pendingBadge.className = `badge ${stats.pendingDeposits > 0 ? 'warning' : 'success'}`; }
    if (DOM.userCountBadge) DOM.userCountBadge.textContent = users.length;
    if (DOM.adminSystemUsers) DOM.adminSystemUsers.textContent = stats.totalUsers;
    if (DOM.adminSystemTransactions) { let totalTx = 0; users.forEach(u => totalTx += (u.history || []).length); DOM.adminSystemTransactions.textContent = totalTx; }
    if (DOM.adminSystemVIP) DOM.adminSystemVIP.textContent = stats.vipUsers;
    
    renderDepositRequests();
    renderAdminUsers();
    renderAdminGiftcodes();
    renderAdminEvents();
    renderAdminFiles();
    renderAdminSpinWeights();
    renderAdminQRConfig();
    updateAdminSpinStats();
    updateSupportUI(getSupportLinks());
    updateAdminDashboardChart();
}

function renderAdminSpinWeights() {
    const container = DOM.adminSpinWeights;
    if (!container) return;
    const weights = Auth.getSpinWeights();
    const total = weights.reduce((a, b) => a + b, 0);
    container.innerHTML = SPIN_PRIZES.map((prize, i) => {
        const percent = total > 0 ? ((weights[i] || 1) / total * 100).toFixed(1) : 0;
        return `<div class="spin-weight-item"><span class="prize-icon">${prize.icon}</span><span class="prize-name">${prize.name}</span><input type="number" id="spinWeight_${i}" value="${weights[i] || 1}" min="0" max="100" step="0.5" onchange="updateSpinWeightPercent(${i})"><span class="weight-percent" id="spinWeightPercent_${i}">${percent}%</span></div>`;
    }).join('');
}

function updateSpinWeightPercent(index) {
    const input = document.getElementById(`spinWeight_${index}`);
    if (!input) return;
    const weights = Auth.getSpinWeights();
    weights[index] = parseFloat(input.value) || 0;
    Auth.saveSpinWeights(weights);
    const total = weights.reduce((a, b) => a + b, 0);
    SPIN_PRIZES.forEach((_, i) => { const pct = document.getElementById(`spinWeightPercent_${i}`); if (pct) pct.textContent = total > 0 ? ((weights[i] || 0) / total * 100).toFixed(1) + '%' : '0%'; });
}

function adminSaveSpinWeights() {
    const weights = Auth.getSpinWeights();
    const total = weights.reduce((a, b) => a + b, 0);
    if (total === 0) {
        showToast('Tổng tỉ lệ phải lớn hơn 0!', 'fas fa-triangle-exclamation', 'error');
        return;
    }
    showToast('Đã lưu tỉ lệ vòng quay!', 'fas fa-circle-check', 'success');
    renderAdminSpinWeights();
    setTimeout(() => forceSyncToAllUsers(true), 100);
}

function updateAdminSpinStats() {
    const users = Auth.getUsers();
    let totalSpins = 0, totalWins = 0, totalAmount = 0;
    users.forEach(u => {
        totalSpins += u.spinCount || 0;
        totalWins += u.winCount || 0;
        if (u.spinHistory) u.spinHistory.forEach(h => totalAmount += h.value || 0);
    });
    if (document.getElementById('adminTotalSpins')) document.getElementById('adminTotalSpins').textContent = totalSpins;
    if (document.getElementById('adminTotalSpinWins')) document.getElementById('adminTotalSpinWins').textContent = totalWins;
    if (document.getElementById('adminTotalSpinAmount')) document.getElementById('adminTotalSpinAmount').textContent = totalAmount.toLocaleString() + 'đ';
}

function initWheelSegments() {
    const wheel = DOM.spinWheel;
    if (!wheel) return;
    const segAngle = 360 / SPIN_PRIZES.length;
    let gradient = 'conic-gradient(';
    SPIN_PRIZES.forEach((prize, i) => {
        const start = i * segAngle;
        const end = (i + 1) * segAngle;
        gradient += `${prize.color} ${start}deg ${end}deg, `;
    });
    gradient = gradient.slice(0, -2) + ')';
    wheel.style.background = gradient;
}

function renderSpinHistory() {
    const container = DOM.spinHistoryList;
    if (!container) return;
    const history = APP.isLoggedIn ? Auth.getSpinHistory(APP.currentUser.id) : [];
    if (history.length === 0) { container.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:10px;">Chưa có lịch sử quay</div>'; return; }
    container.innerHTML = history.slice(0, 20).map(item => `<div class="spin-history-item"><span>${item.icon || '🎡'} ${item.prize}</span><span class="time">${item.time}</span></div>`).join('');
}

let isSpinning = false;

function spinTheWheel() {
    if (isSpinning) return;
    if (!Auth.isLoggedIn()) { showToast('Vui lòng đăng nhập để quay!', 'fas fa-triangle-exclamation', 'error'); openModal('loginModal'); return; }
    if (APP.isAdmin) { showToast('Admin không cần quay!', 'fas fa-wrench', 'warning'); return; }
    if (APP.balance < 10000) { showToast('Số dư không đủ 10.000đ!', 'fas fa-wallet', 'error'); switchTab('depositTab'); return; }
    const user = Auth.updateBalance(APP.currentUser.id, -10000, 'Quay vòng quay');
    if (!user) return;
    APP.balance = user.balance;
    APP.spinCount++;
    DOM.userBalance.textContent = APP.balance.toLocaleString();
    DOM.spinCountToday.textContent = APP.spinCount;
    document.getElementById('spinTotalSpent').textContent = (APP.spinCount * 10000).toLocaleString() + 'đ';
    isSpinning = true;
    const wheel = DOM.spinWheel;
    const randomDegree = Math.floor(Math.random() * 3600) + 1440;
    wheel.style.transform = `rotate(${randomDegree}deg)`;
    const weights = Auth.getSpinWeights();
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let winIndex = 0;
    for (let i = 0; i < weights.length; i++) {
        random -= weights[i] || 0;
        if (random <= 0) { winIndex = i; break; }
    }
    setTimeout(() => {
        isSpinning = false;
        APP.winCount++;
        DOM.spinWinCount.textContent = APP.winCount;
        const prize = SPIN_PRIZES[winIndex];
        if (prize.value > 0) {
            APP.spinLuckiest = `${prize.name} (${prize.value.toLocaleString()}đ)`;
            document.getElementById('spinLuckiest').textContent = APP.spinLuckiest;
        }
        const entry = { prize: prize.name, icon: prize.icon, value: prize.value, time: new Date().toLocaleString('vi-VN') };
        Auth.saveSpinHistory(APP.currentUser.id, entry);
        renderSpinHistory();
        if (prize.value > 0) {
            const u2 = Auth.addDeposit(APP.currentUser.id, prize.value);
            if (u2) {
                APP.balance = u2.balance;
                APP.totalDeposit = u2.totalDeposit;
                APP.vipLevel = u2.vipLevel;
                DOM.userBalance.textContent = APP.balance.toLocaleString();
                renderHistory();
                updateRealStats();
                updateVIPUI(u2);
                showToast(`Cộng +${prize.value.toLocaleString()}đ!`, 'fas fa-circle-check', 'success');
            }
        }
        const users = Auth.getUsers();
        const uIdx = users.findIndex(u => u.id === APP.currentUser.id);
        if (uIdx !== -1) {
            users[uIdx].spinCount = APP.spinCount;
            users[uIdx].winCount = APP.winCount;
            Auth.saveUsers(users);
        }
        updateMissions('spin');
        checkAchievements(APP.currentUser.id);
        if (APP.isAdmin) updateAdminSpinStats();
        showToast(`🎉 Trúng: ${prize.icon} ${prize.name}`, 'fas fa-trophy', 'success');
        triggerConfetti();
        setTimeout(publishFullState, 500);
    }, 5500);
}

// ============================================================
//  RENDER FILES, HISTORY, REVIEWS, MISSIONS, EVENTS, TOP - GIỮ NGUYÊN
// ============================================================
// Các hàm renderFiles, renderHistory, renderReviews, renderMissions, renderEvents, renderTopRanking, showFileDetail, updateRealStats, populateReviewFiles, filterFiles, changeFilePage, loadMoreProducts, searchProducts, handleRedeemCode, switchTab, switchAdminTab, adminSaveSupport, adminSaveSettings, triggerConfetti, openModal, closeModal, renderUserDashboard, adminShowTools, createBackup, restoreFromBackup, exportAllData, importAllData, repairCorruptedData, resetToDefaultData, globalSearch, updateSupportUI, openSupportLink, toggleMusic, nextTrack, prevTrack

// ============================================================
//  RENDER FILES
// ============================================================
function renderFiles() {
    const container = DOM.productGrid;
    if (!container) return;
    FILE_DATA = getGlobalFiles();
    APP.files = [...FILE_DATA];
    const files = getFilteredFiles();
    const start = 0;
    const end = APP.filesPerPage * (APP.filePage + 1);
    const displayed = files.slice(start, end);
    if (displayed.length === 0) { container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);">Không tìm thấy file.</div>`; return; }
    const discount = APP.isLoggedIn && !APP.isAdmin ? Auth.getDiscount(APP.currentUser.id) : 0;
    const cart = getCart();
    container.innerHTML = displayed.map(f => {
        const finalPrice = Math.round(f.price * (1 - discount / 100));
        const hasDiscount = discount > 0 && finalPrice < f.price;
        const inCart = cart.some(item => item.id === f.id);
        return `<div class="product-card" data-id="${f.id}"><span class="product-badge">${f.badge || 'Hot'}</span><div class="product-img-wrapper"><img src="${f.img}" class="product-img" alt="${f.name}" loading="lazy"></div><div class="product-details"><div class="product-title">${f.name}</div><div class="product-stats"><span><i class="fas fa-shopping-cart"></i> <b>${f.sold}</b></span><div class="product-rating"><i class="fas fa-star"></i> ${f.rating || 0}</div></div>${APP.isLoggedIn ? `<div class="protected-price-area" style="display:flex;flex-wrap:wrap;gap:8px;"><div class="product-price" style="${hasDiscount ? 'color:#00ff88;font-size:20px;' : ''}">${finalPrice.toLocaleString()}đ${hasDiscount ? `<span style="font-size:11px;color:#ffd700;">(-${discount}% VIP)</span>` : ''}</div><div style="display:flex;gap:6px;width:100%;"><button class="btn-buy btn-buy-now" onclick="buyNow(${f.id})" style="flex:1;font-size:11px;padding:8px;"><i class="fas fa-bolt"></i> Mua ngay</button><button class="btn-buy" onclick="${inCart ? `showToast('Đã có trong giỏ hàng!', 'fas fa-info-circle', 'warning')` : `addToCart(${f.id})`}" style="flex:1;${inCart ? 'background:linear-gradient(135deg,#ffaa00,#ff6600);' : ''}font-size:11px;padding:8px;"><i class="fas ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i> ${inCart ? 'Đã thêm' : 'Thêm giỏ'}</button></div></div>` : `<div class="login-required-msg" onclick="openModal('loginModal')"><i class="fas fa-lock"></i> Đăng nhập để mua</div>`}</div></div>`;
    }).join('');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) loadMoreBtn.style.display = files.length > displayed.length ? 'block' : 'none';
    container.className = `products-grid ${APP.viewMode === 'list' ? 'list-view' : ''}`;
}

function loadMoreProducts() {
    APP.filePage++;
    renderFiles();
}

function getFilteredFiles() {
    let files = [...FILE_DATA];
    if (APP.currentCategory !== 'all') files = files.filter(f => f.category === APP.currentCategory);
    if (APP.searchQuery) { const q = APP.searchQuery.toLowerCase(); files = files.filter(f => f.name.toLowerCase().includes(q)); }
    return files;
}

function searchProducts() {
    APP.searchQuery = DOM.searchInput.value.trim();
    APP.filePage = 0;
    renderFiles();
}

function setupCategoryFilter() {
    DOM.categoryMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            DOM.categoryMenu.querySelectorAll('a').forEach(el => el.classList.remove('active-filter'));
            link.classList.add('active-filter');
            APP.currentCategory = link.dataset.category;
            APP.filePage = 0;
            renderFiles();
            showToast(`Đã lọc: ${link.textContent.trim()}`, 'fas fa-filter');
        });
    });
}

function setupViewToggle() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            APP.viewMode = btn.dataset.view;
            renderFiles();
        });
    });
}

function renderFileGrid() {
    const container = DOM.fileGridContainer;
    if (!container) return;
    FILE_DATA = getGlobalFiles();
    APP.filteredFiles = [...FILE_DATA];
    const start = (APP.currentFilePage - 1) * APP.filesPerPage;
    const end = start + APP.filesPerPage;
    const pageFiles = APP.filteredFiles.slice(start, end);
    if (pageFiles.length === 0) { container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);">Không tìm thấy file nào</div>`; return; }
    const cart = getCart();
    container.innerHTML = pageFiles.map(f => {
        const inCart = cart.some(item => item.id === f.id);
        return `<div class="product-card"><span class="product-badge" style="${f.price === 0 ? 'background:#00ff88;color:#000;' : ''}">${f.badge}</span><div class="product-img-wrapper"><img src="${f.img}" class="product-img" loading="lazy"></div><div class="product-details"><div class="product-title">${f.name}</div><div class="product-stats"><span><i class="fas fa-shopping-cart"></i> <b>${f.sold}</b></span><span><i class="fas fa-star" style="color:#ffaa00;"></i> ${f.rating}</span></div><div class="product-price" style="${f.price === 0 ? 'color:#00ff88;' : ''}">${f.price === 0 ? 'Miễn Phí' : f.price.toLocaleString() + 'đ'}</div><div style="display:flex;gap:6px;width:100%;"><button class="btn-buy btn-buy-now" onclick="${f.price === 0 ? `showToast('Đã tải file miễn phí!', 'fas fa-circle-check')` : `buyNow(${f.id})`}" style="flex:1;${f.price === 0 ? 'background:#00ff88;color:#000;' : ''}font-size:11px;padding:8px;"><i class="fas fa-bolt"></i> ${f.price === 0 ? 'Tải ngay' : 'Mua ngay'}</button><button class="btn-buy" onclick="${inCart ? `showToast('Đã có trong giỏ hàng!', 'fas fa-info-circle', 'warning')` : `addToCart(${f.id})`}" style="flex:1;${inCart ? 'background:linear-gradient(135deg,#ffaa00,#ff6600);' : ''}font-size:11px;padding:8px;"><i class="fas ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i> ${inCart ? 'Đã thêm' : 'Thêm giỏ'}</button></div></div></div>`;
    }).join('');
    const totalPages = Math.ceil(APP.filteredFiles.length / APP.filesPerPage);
    if (DOM.filePageInfo) DOM.filePageInfo.textContent = `Trang ${APP.currentFilePage} / ${totalPages || 1}`;
}

function filterFiles() {
    const search = DOM.fileSearchInput?.value.toLowerCase() || '';
    const category = DOM.fileCategoryFilter?.value || 'all';
    const price = DOM.filePriceFilter?.value || 'all';
    const sort = DOM.fileSortFilter?.value || 'popular';
    APP.filteredFiles = [...FILE_DATA];
    if (search) APP.filteredFiles = APP.filteredFiles.filter(f => f.name.toLowerCase().includes(search));
    if (category !== 'all') APP.filteredFiles = APP.filteredFiles.filter(f => f.category === category);
    if (price === 'free') APP.filteredFiles = APP.filteredFiles.filter(f => f.price === 0);
    else if (price === 'under50') APP.filteredFiles = APP.filteredFiles.filter(f => f.price > 0 && f.price < 50000);
    else if (price === 'under100') APP.filteredFiles = APP.filteredFiles.filter(f => f.price >= 50000 && f.price < 100000);
    else if (price === 'under200') APP.filteredFiles = APP.filteredFiles.filter(f => f.price >= 100000 && f.price < 200000);
    else if (price === 'above200') APP.filteredFiles = APP.filteredFiles.filter(f => f.price >= 200000);
    if (sort === 'popular') APP.filteredFiles.sort((a, b) => b.sold - a.sold);
    else if (sort === 'newest') APP.filteredFiles.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sort === 'price-low') APP.filteredFiles.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') APP.filteredFiles.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') APP.filteredFiles.sort((a, b) => b.rating - a.rating);
    APP.currentFilePage = 1;
    renderFileGrid();
}

function changeFilePage(delta) {
    const totalPages = Math.ceil(APP.filteredFiles.length / APP.filesPerPage);
    const newPage = APP.currentFilePage + delta;
    if (newPage < 1 || newPage > totalPages) return;
    APP.currentFilePage = newPage;
    renderFileGrid();
}

function showFileDetail(file) {
    if (!file) { showToast('Không tìm thấy file!', 'fas fa-triangle-exclamation', 'error'); return; }
    if (typeof file === 'number') {
        file = FILE_DATA.find(f => f.id === file);
        if (!file) { showToast('File không tồn tại!', 'fas fa-triangle-exclamation', 'error'); return; }
    }
    const container = DOM.fileDetailContent;
    if (!container) return;
    const hasNote = file.note && file.note.trim() !== '';
    const inCart = getCart().some(item => item.id === file.id);
    const isPurchased = APP.isLoggedIn ? Auth.hasPurchasedFile(APP.currentUser.id, file.id) : false;
    const discount = APP.isLoggedIn && !APP.isAdmin ? Auth.getDiscount(APP.currentUser.id) : 0;
    const finalPrice = Math.round(file.price * (1 - discount / 100));
    const downloadLink = file.downloadLink || (isPurchased ? `#download-${file.id}` : '#');
    container.innerHTML = `<div class="file-detail-card"><div class="detail-header"><img src="${file.img}" alt="${file.name}"><div class="info"><h3>${file.name}</h3><div class="price">${file.price === 0 ? 'Miễn phí' : finalPrice.toLocaleString() + 'đ'}</div>${file.badge ? `<span class="badge-tag">${file.badge}</span>` : ''}</div></div><div class="detail-body">${hasNote ? `<div class="note"><strong><i class="fas fa-sticky-note"></i> Ghi chú / Hướng dẫn:</strong><div style="margin-top:4px;">${file.note}</div></div>` : `<div class="note" style="background:rgba(255,255,255,0.02);border-color:rgba(255,255,255,0.05);"><em style="color:var(--text-muted);">Không có ghi chú cho file này.</em></div>`}${isPurchased ? `<div class="download-link-box"><strong><i class="fas fa-download"></i> Link tải file:</strong><a href="${downloadLink}" target="_blank">${downloadLink === '#' ? 'Liên hệ admin để lấy link tải' : downloadLink}</a></div>` : `<div class="download-locked"><i class="fas fa-lock"></i> Mua file để xem link tải</div>`}<div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">${!isPurchased ? `<button class="btn-buy btn-buy-now" onclick="buyNow(${file.id})"><i class="fas fa-bolt"></i> Mua ngay</button><button class="btn-buy" onclick="${inCart ? `showToast('Đã có trong giỏ hàng!', 'fas fa-info-circle', 'warning')` : `addToCart(${file.id})`}" style="${inCart ? 'background:linear-gradient(135deg,#ffaa00,#ff6600);' : ''}"><i class="fas ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i> ${inCart ? 'Đã thêm giỏ' : 'Thêm giỏ'}</button>` : `<button class="btn-buy" onclick="switchTab('historyTab')" style="background:linear-gradient(135deg, var(--primary), var(--secondary));"><i class="fas fa-clock-rotate-left"></i> Xem lịch sử</button>`}</div></div><div class="detail-footer"><span class="status"><i class="fas fa-info-circle"></i> ${isPurchased ? 'Đã mua thành công' : 'Sẵn sàng mua'}</span></div></div>`;
    openModal('fileDetailModal');
}

function renderHistory() {
    const tbody = DOM.historyBody;
    if (!tbody) return;
    const history = Auth.isLoggedIn() ? (Auth.getCurrentUser().history || []) : [];
    if (history.length === 0) { tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:30px;">Chưa có giao dịch nào</td></tr>`; return; }
    tbody.innerHTML = history.map(h => {
        const isPurchase = h.desc.startsWith('Mua') || h.desc.includes('Mua ngay');
        let fileId = null;
        if (isPurchase) { for (const f of FILE_DATA) { if (h.desc.includes(f.name)) { fileId = f.id; break; } } }
        const hasFile = fileId !== null;
        const isPurchased = hasFile && Auth.hasPurchasedFile(APP.currentUser.id, fileId);
        return `<tr><td>${h.id}</td><td>${h.desc}</td><td style="color: ${h.amount && h.amount.startsWith('+') ? '#00ff88' : '#ff4d4d'};">${h.amount}</td><td><span class="status-${h.status === 'Thành công' || h.status === 'Hoàn tất' ? 'success' : 'pending'}">${h.status}</span></td><td>${h.time}</td><td>${isPurchase && isPurchased ? `<button class="btn-view-detail" onclick="showFileDetail(${fileId})" style="background:rgba(0,240,255,0.12);border:none;padding:4px 12px;border-radius:6px;color:var(--primary);cursor:pointer;"><i class="fas fa-eye"></i> Xem file</button>` : `<span style="color:var(--text-muted);font-size:12px;">-</span>`}</td></tr>`;
    }).join('');
}

function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;
    const reviews = Auth.getReviews();
    const filterFile = document.getElementById('reviewFilterProduct')?.value || 'all';
    const filterRating = document.getElementById('reviewFilterRating')?.value || 'all';
    let filtered = [...reviews];
    if (filterFile !== 'all') filtered = filtered.filter(r => r.fileId === parseInt(filterFile));
    if (filterRating !== 'all') filtered = filtered.filter(r => r.rating === parseInt(filterRating));
    const total = reviews.length;
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    const avg = total > 0 ? Math.round((sum / total) * 10) / 10 : 0;
    const withImages = reviews.filter(r => r.images && r.images.length > 0).length;
    if (document.getElementById('reviewTotal')) document.getElementById('reviewTotal').textContent = total;
    if (document.getElementById('reviewAvg')) document.getElementById('reviewAvg').textContent = avg > 0 ? avg + ' ★' : '0 ★';
    if (document.getElementById('reviewWithImages')) document.getElementById('reviewWithImages').textContent = withImages;
    if (filtered.length === 0) { container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);"><i class="fas fa-comment" style="font-size:32px;display:block;margin-bottom:12px;"></i>Chưa có đánh giá nào</div>`; return; }
    container.innerHTML = filtered.map(r => `<div class="review-item"><div class="review-header"><div class="review-user"><img src="${APP.currentUser?.id === r.userId ? (APP.currentUser.avatar || 'https://i.pravatar.cc/32?img=' + Math.floor(Math.random()*70)) : 'https://i.pravatar.cc/32?img=' + Math.floor(Math.random()*70)}" alt="${r.username}"><span>${r.username}</span>${r.userId === APP.currentUser?.id ? '<span style="font-size:10px;color:var(--primary);">(Bạn)</span>' : ''}</div><div class="review-stars">${'⭐'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div></div><div class="review-product">📦 ${r.fileName}</div><div class="review-content">${r.content}</div>${r.images && r.images.length > 0 ? `<div class="review-images">${r.images.map(img => `<img src="${img}" alt="Review image" onclick="window.open('${img}','_blank')">`).join('')}</div>` : ''}<div class="review-time">${new Date(r.createdAt).toLocaleString('vi-VN')}</div></div>`).join('');
}

function openReviewModal() {
    if (!APP.isLoggedIn) { showToast('Vui lòng đăng nhập để đánh giá!', 'fas fa-triangle-exclamation', 'error'); openModal('loginModal'); return; }
    document.getElementById('reviewForm').reset();
    document.getElementById('reviewImagePreview').innerHTML = '';
    APP.selectedRating = 5;
    document.querySelectorAll('.star-rating i').forEach(s => s.classList.toggle('active', parseInt(s.dataset.star) <= 5));
    document.getElementById('reviewRating').value = 5;
    const draft = getDraft('review');
    if (draft) {
        document.getElementById('reviewContent').value = draft.content || '';
    }
    openModal('reviewModal');
}

function handleReviewSubmit(e) {
    e.preventDefault();
    if (!APP.isLoggedIn) { showToast('Vui lòng đăng nhập!', 'fas fa-triangle-exclamation', 'error'); return; }
    const fileId = parseInt(document.getElementById('reviewProduct').value);
    const rating = parseInt(document.getElementById('reviewRating').value);
    const content = document.getElementById('reviewContent').value.trim();
    const files = document.getElementById('reviewImages').files;
    if (!fileId) { showToast('Vui lòng chọn file!', 'fas fa-triangle-exclamation', 'error'); return; }
    if (!content || content.length < 10) { showToast('Nội dung đánh giá tối thiểu 10 ký tự!', 'fas fa-triangle-exclamation', 'error'); return; }
    const file = APP.files.find(f => f.id === fileId);
    if (!file) { showToast('File không tồn tại!', 'fas fa-triangle-exclamation', 'error'); return; }
    const imagePromises = Array.from(files).map(file => { return new Promise((resolve) => { const reader = new FileReader(); reader.onload = function(e) { resolve(e.target.result); }; reader.readAsDataURL(file); }); });
    Promise.all(imagePromises).then(images => {
        const review = Auth.addReview(APP.currentUser.id, APP.currentUser.username, fileId, file.name, rating, content, images);
        closeModal('reviewModal');
        clearDraft('review');
        showToast('Cảm ơn bạn đã đánh giá!', 'fas fa-circle-check', 'success');
        triggerConfetti();
        updateRealStats();
        renderReviews();
        renderFiles();
        updateMissions('review');
        checkAchievements(APP.currentUser.id);
        const userReviews = Auth.getReviews().filter(r => r.userId === APP.currentUser.id);
        if (DOM.profileReviewCount) DOM.profileReviewCount.textContent = userReviews.length;
        setTimeout(publishFullState, 500);
    });
}

function populateReviewFiles() {
    const select = document.getElementById('reviewProduct');
    if (select) { select.innerHTML = '<option value="">Chọn file...</option>' + APP.files.map(f => `<option value="${f.id}">${f.name}</option>`).join(''); }
    const filterSelect = document.getElementById('reviewFilterProduct');
    if (filterSelect) { filterSelect.innerHTML = '<option value="all">Tất cả file</option>' + APP.files.map(f => `<option value="${f.id}">${f.name}</option>`).join(''); }
}

function renderTopRanking(period = 'all') {
    const container = document.getElementById('topList');
    if (!container) return;
    document.querySelectorAll('.top-filter .btn-filter').forEach(btn => btn.classList.toggle('active', btn.dataset.period === period));
    const topUsers = Auth.getTopDepositors(period);
    if (topUsers.length === 0) { container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);"><i class="fas fa-trophy" style="font-size:32px;display:block;margin-bottom:12px;"></i>Chưa có dữ liệu</div>`; return; }
    const medals = ['🥇', '🥈', '🥉'];
    const rankClasses = ['gold', 'silver', 'bronze'];
    container.innerHTML = topUsers.slice(0, 20).map((user, index) => `<div class="top-item"><div class="rank ${index < 3 ? rankClasses[index] : 'normal'}">${index < 3 ? medals[index] : `#${index + 1}`}</div><img src="${user.avatar || 'https://i.pravatar.cc/40?img=' + (index + 10)}" alt="${user.username}" class="avatar"><div class="info"><div class="name">${user.username}${(user.vipLevel || 0) > 0 ? `<span class="vip-tag">👑 VIP ${user.vipLevel}</span>` : ''}</div><div class="detail">${(user.history || []).filter(h => h.amount && h.amount.startsWith('+')).length} giao dịch</div></div><div class="amount">${(user.totalDeposit || 0).toLocaleString()}đ</div></div>`).join('');
}

function updateRealStats() {
    const stats = Auth.getRealStats();
    if (DOM.realTotalSold) DOM.realTotalSold.textContent = stats.totalSold;
    if (DOM.realAvgRating) DOM.realAvgRating.textContent = stats.avgRating > 0 ? stats.avgRating + ' ★' : 'Chưa có';
    if (DOM.realTotalRevenue) DOM.realTotalRevenue.textContent = stats.totalRevenue.toLocaleString() + 'đ';
    if (DOM.realTopDeposit) DOM.realTopDeposit.textContent = stats.topDepositor !== 'Chưa có' ? `${stats.topDepositor} (${stats.topAmount.toLocaleString()}đ)` : 'Chưa có';
}

function renderEvents() {
    const container = document.getElementById('eventsGrid');
    if (!container) return;
    const events = Auth.getEvents();
    container.innerHTML = events.map(e => `<div class="event-card"><div class="event-icon">${e.icon}</div><div class="event-name">${e.name}</div><div class="event-desc">${e.desc}</div><div class="event-reward">🎁 ${e.reward}</div><div class="event-time">📅 ${e.time}</div><span class="event-status ${e.status}">${e.status === 'active' ? '🟢 Đang diễn ra' : e.status === 'coming' ? '🟡 Sắp tới' : '🔴 Đã kết thúc'}</span><button class="btn-join-event" ${e.status !== 'active' ? 'disabled' : ''} onclick="joinEvent(${e.id})">${e.status === 'active' ? 'Tham gia ngay' : e.status === 'coming' ? 'Sắp diễn ra' : 'Đã kết thúc'}</button></div>`).join('');
}

function joinEvent(eventId) {
    if (!Auth.isLoggedIn()) { showToast('Vui lòng đăng nhập để tham gia!', 'fas fa-triangle-exclamation', 'error'); openModal('loginModal'); return; }
    const event = Auth.getEvents().find(e => e.id === eventId);
    if (!event || event.status !== 'active') { showToast('Sự kiện không khả dụng!', 'fas fa-triangle-exclamation', 'error'); return; }
    showToast(`🎉 Bạn đã tham gia sự kiện: ${event.name}!`, 'fas fa-circle-check', 'success');
    triggerConfetti();
}

function renderMissions() {
    const container = document.getElementById('missionsGrid');
    if (!container) return;
    const today = new Date().toDateString();
    let missions = JSON.parse(localStorage.getItem(STORAGE_KEY_MISSIONS + today));
    if (!missions) { missions = MISSIONS.map(m => ({...m, progress: 0, claimed: false})); localStorage.setItem(STORAGE_KEY_MISSIONS + today, JSON.stringify(missions)); }
    container.innerHTML = missions.map(m => {
        const progressPercent = Math.min((m.progress / m.total) * 100, 100);
        const isComplete = m.progress >= m.total;
        const isClaimed = m.claimed;
        let btnClass = 'locked';
        let btnText = '🔒 Chưa đủ';
        let btnDisabled = true;
        if (isClaimed) { btnClass = 'done'; btnText = '✅ Đã nhận'; btnDisabled = true; }
        else if (isComplete) { btnClass = 'claim'; btnText = '🎁 Nhận thưởng'; btnDisabled = false; }
        else { btnClass = 'locked'; btnText = `⏳ ${m.progress}/${m.total}`; btnDisabled = true; }
        const color = isComplete ? '#00ff88' : isClaimed ? '#94a3b8' : '#ffaa00';
        return `<div class="mission-card"><div class="mission-icon">${m.icon}</div><div class="mission-info"><div class="mission-name">${m.name}</div><div class="mission-desc">${m.desc}</div><div class="mission-progress"><div class="progress-fill" style="width:${progressPercent}%;background:${color};"></div></div></div><div><div class="mission-reward">🎁 ${m.reward}</div><button class="mission-btn ${btnClass}" ${btnDisabled ? 'disabled' : ''} onclick="claimMission(${m.id})">${btnText}</button></div></div>`;
    }).join('');
    localStorage.setItem(STORAGE_KEY_MISSIONS + today, JSON.stringify(missions));
}

function updateMissions(type) {
    const today = new Date().toDateString();
    let missions = JSON.parse(localStorage.getItem(STORAGE_KEY_MISSIONS + today));
    if (!missions) missions = MISSIONS.map(m => ({...m, progress: 0, claimed: false}));
    const map = { 'login': 1, 'view': 2, 'deposit': 3, 'purchase': 4, 'review': 5, 'spin': 6 };
    const missionId = map[type];
    if (!missionId) return;
    const mission = missions.find(m => m.id === missionId);
    if (mission && !mission.claimed && mission.progress < mission.total) { mission.progress++; localStorage.setItem(STORAGE_KEY_MISSIONS + today, JSON.stringify(missions)); renderMissions(); if (mission.progress >= mission.total) showToast(`🎉 Hoàn thành nhiệm vụ: ${mission.name}!`, 'fas fa-circle-check', 'success'); }
}

function claimMission(missionId) {
    const today = new Date().toDateString();
    const missions = JSON.parse(localStorage.getItem(STORAGE_KEY_MISSIONS + today)) || MISSIONS.map(m => ({...m, progress: 0, claimed: false}));
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.claimed || mission.progress < mission.total) { showToast('Chưa thể nhận thưởng!', 'fas fa-triangle-exclamation', 'error'); return; }
    const reward = parseInt(mission.reward.replace(/[^0-9]/g, ''));
    if (reward > 0) {
        const user = Auth.addDeposit(Auth.getCurrentUser().id, reward);
        if (user) { APP.balance = user.balance; APP.totalDeposit = user.totalDeposit; APP.vipLevel = user.vipLevel; DOM.userBalance.textContent = APP.balance.toLocaleString(); updateRealStats(); updateVIPUI(user); mission.claimed = true; localStorage.setItem(STORAGE_KEY_MISSIONS + today, JSON.stringify(missions)); renderMissions(); showToast(`Nhận ${reward.toLocaleString()}đ từ nhiệm vụ!`, 'fas fa-circle-check', 'success'); triggerConfetti(); setTimeout(publishFullState, 500); }
    }
}

function handleRedeemCode(e) {
    e.preventDefault();
    if (!Auth.isLoggedIn()) { showToast('Vui lòng đăng nhập để đổi giftcode!', 'fas fa-triangle-exclamation', 'error'); openModal('loginModal'); return; }
    if (APP.isAdmin) { showToast('Admin không cần đổi giftcode!', 'fas fa-wrench', 'warning'); return; }
    const code = document.getElementById('giftcodeInput').value.trim().toUpperCase();
    const result = Auth.redeemGiftcode(code, APP.currentUser.id);
    if (result.success) {
        const user = Auth.getCurrentUser();
        APP.balance = user.balance;
        APP.totalDeposit = user.totalDeposit;
        APP.vipLevel = user.vipLevel;
        DOM.userBalance.textContent = APP.balance.toLocaleString();
        DOM.profileBalance.textContent = APP.balance.toLocaleString() + 'đ';
        renderHistory();
        updateRealStats();
        updateVIPUI(user);
        showToast(result.message, 'fas fa-circle-check', 'success');
        triggerConfetti();
        document.getElementById('giftcodeInput').value = '';
        updateMissions('deposit');
        checkAchievements(APP.currentUser.id);
        setTimeout(publishFullState, 500);
    } else showToast(result.message, 'fas fa-triangle-exclamation', 'error');
}

// ============================================================
//  SWITCH TAB
// ============================================================
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-tab'));
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active-tab');
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.tab === tabId) link.classList.add('active');
    });
    if (tabId === 'adminTab' && APP.isAdmin) {
        renderAdminDashboard();
        setTimeout(() => {
            renderDepositRequests();
            renderAdminSpinWeights();
            updateAdminSpinStats();
            switchAdminTab(APP.adminTab || 'adminDashboard');
            updateSupportUI(getSupportLinks());
            renderAdminQRConfig();
            initSecurity();
            const pendingCount = Auth.getAllDepositRequests().filter(r => r.status === 'pending').length;
            if (DOM.pendingBadge) {
                DOM.pendingBadge.textContent = pendingCount;
                DOM.pendingBadge.className = `badge ${pendingCount > 0 ? 'warning' : 'success'}`;
            }
            publishMqtt('sync_request', {});
            broadcastSync({ type: 'sync_request' });
        }, 100);
    }
    if (tabId === 'vipTab' && APP.isLoggedIn) updateVIPUI(Auth.getCurrentUser());
    if (tabId === 'reviewsTab') renderReviews();
    if (tabId === 'topTab') renderTopRanking('all');
    if (tabId === 'filesTab') renderFileGrid();
    if (tabId === 'cartTab') renderCart();
    if (tabId === 'spinTab') renderSpinHistory();
    if (tabId === 'eventTab') renderEvents();
    if (tabId === 'missionTab') renderMissions();
    if (tabId === 'adminFiles') renderAdminFiles();
    if (tabId === 'adminSpin') { renderAdminSpinWeights(); updateAdminSpinStats(); }
    if (tabId === 'adminSupport') updateSupportUI(getSupportLinks());
    if (tabId === 'adminSettings') renderAdminQRConfig();
    if (tabId === 'supportTab') updateSupportUI(getSupportLinks());
    if (tabId === 'depositTab' || tabId === 'depositModal') updateDepositUsername();
    if (tabId === 'achievementsTab') renderAchievements();
    if (tabId === 'profileTab' && APP.isLoggedIn) {
        const user = Auth.getCurrentUser();
        DOM.profileUsername.textContent = user.username;
        DOM.profileEmail.textContent = user.email || 'Chưa cập nhật';
        DOM.profileBalance.textContent = (user.balance || 0).toLocaleString() + 'đ';
        DOM.profileRole.textContent = APP.isAdmin ? 'Quản trị viên' : 'Người dùng';
        DOM.profileVipLevel.textContent = VIP_CONFIG[APP.vipLevel].name;
        DOM.profileDiscount.textContent = VIP_CONFIG[APP.vipLevel].discount + '%';
        DOM.profileVipBadge.textContent = VIP_CONFIG[APP.vipLevel].name;
        DOM.profileVipBadge.style.background = APP.vipLevel > 0 ? `linear-gradient(135deg,${VIP_CONFIG[APP.vipLevel].color},${VIP_CONFIG[APP.vipLevel].color}dd)` : 'linear-gradient(135deg,#94a3b8,#64748b)';
        if (user.avatar) { DOM.profileAvatar.src = user.avatar; DOM.vipAvatar.src = user.avatar; }
        const userReviews = Auth.getReviews().filter(r => r.userId === user.id);
        if (DOM.profileReviewCount) DOM.profileReviewCount.textContent = userReviews.length;
        renderAchievements();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.dataset.tab;
        if (tabId) switchTab(tabId);
        DOM.navLinks.classList.remove('open');
    });
});

function switchAdminTab(tabId) {
    APP.adminTab = tabId;
    document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
    document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.toggle('active', content.id === tabId));
    if (tabId === 'adminGiftcodes') renderAdminGiftcodes();
    if (tabId === 'adminEvents') renderAdminEvents();
    if (tabId === 'adminFiles') renderAdminFiles();
    if (tabId === 'adminUsers') renderAdminUsers();
    if (tabId === 'adminSpin') { renderAdminSpinWeights(); updateAdminSpinStats(); }
    if (tabId === 'adminSupport') updateSupportUI(getSupportLinks());
    if (tabId === 'adminSettings') renderAdminQRConfig();
    if (tabId === 'adminDashboard') renderAdminDashboard();
    if (tabId === 'adminDeposits') renderDepositRequests();
}

function adminSaveSupport(e) {
    e.preventDefault();
    const data = { zalo: document.getElementById('adminZaloInput').value.trim(), facebook: document.getElementById('adminFbInput').value.trim(), telegram: document.getElementById('adminTelegramInput').value.trim() };
    saveSupportLinks(data);
    showToast('Đã cập nhật thông tin hỗ trợ!', 'fas fa-circle-check', 'success');
    setTimeout(() => forceSyncToAllUsers(true), 100);
}

function adminSaveSettings() {
    const maxDeposit = parseInt(DOM.adminMaxDeposit.value);
    if (maxDeposit && maxDeposit >= 10000) {
        APP.maxDeposit = maxDeposit;
        showToast(`Đã cập nhật giới hạn nạp: ${maxDeposit.toLocaleString()}đ`, 'fas fa-circle-check', 'success');
        publishMqtt('settings_sync', { maxDeposit: maxDeposit });
        broadcastSync({ type: 'settings_sync', maxDeposit: maxDeposit });
        setTimeout(() => forceSyncToAllUsers(true), 100);
    } else {
        showToast('Vui lòng nhập số tiền hợp lệ!', 'fas fa-triangle-exclamation', 'error');
    }
}

function triggerConfetti() {
    if (typeof confetti !== 'function') return;
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#00f0ff', '#7000ff', '#ff0077', '#00ff88', '#ffaa00'] });
    setTimeout(() => { confetti({ particleCount: 50, spread: 40, origin: { y: 0.5, x: 0.3 }, colors: ['#00f0ff', '#ffffff'] }); confetti({ particleCount: 50, spread: 40, origin: { y: 0.5, x: 0.7 }, colors: ['#00ff88', '#7000ff'] }); }, 200);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) { overlay.classList.remove('show'); setTimeout(() => overlay.style.display = 'none', 300); }
    });
});

function renderUserDashboard() {
    if (!APP.isLoggedIn) { showToast('Vui lòng đăng nhập!', 'fas fa-triangle-exclamation', 'error'); return; }
    const user = Auth.getCurrentUser();
    const stats = {
        totalOrders: (user.history || []).filter(h => h.amount && h.amount.startsWith('-')).length,
        totalDeposit: user.totalDeposit || 0,
        totalSpent: 0,
        vipLevel: user.vipLevel || 0,
        vipName: VIP_CONFIG[user.vipLevel || 0].name,
        discount: VIP_CONFIG[user.vipLevel || 0].discount,
        reviewsCount: Auth.getReviews().filter(r => r.userId === user.id).length,
        purchasedCount: (user.purchasedFiles || []).length,
        spinCount: user.spinCount || 0,
        winCount: user.winCount || 0,
        achievements: getAchievements(user.id).unlocked.length
    };
    (user.history || []).forEach(h => { if (h.amount && h.amount.startsWith('-')) { const num = parseInt(h.amount.replace(/[^0-9]/g, '')); stats.totalSpent += num; } });
    const html = `<div class="user-dashboard"><div class="stats-grid"><div class="stat-card" style="border-left:3px solid #00f0ff;"><div class="stat-label">💰 Tổng nạp</div><div class="stat-value">${stats.totalDeposit.toLocaleString()}đ</div></div><div class="stat-card" style="border-left:3px solid #ff0077;"><div class="stat-label">💸 Đã chi</div><div class="stat-value">${stats.totalSpent.toLocaleString()}đ</div></div><div class="stat-card" style="border-left:3px solid #00ff88;"><div class="stat-label">📦 Đã mua</div><div class="stat-value">${stats.purchasedCount} file</div></div><div class="stat-card" style="border-left:3px solid #ffaa00;"><div class="stat-label">⭐ Đánh giá</div><div class="stat-value">${stats.reviewsCount}</div></div><div class="stat-card" style="border-left:3px solid #7000ff;"><div class="stat-label">👑 VIP</div><div class="stat-value">${stats.vipName} (${stats.discount}%)</div></div><div class="stat-card" style="border-left:3px solid #ff6b00;"><div class="stat-label">🎡 Vòng quay</div><div class="stat-value">${stats.spinCount} lần (thắng ${stats.winCount})</div></div><div class="stat-card" style="border-left:3px solid #ffd700;"><div class="stat-label">🏆 Thành tích</div><div class="stat-value">${stats.achievements} / ${ACHIEVEMENTS.length}</div></div></div><div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;"><button class="btn-submit" onclick="switchTab('historyTab')"><i class="fas fa-clock-rotate-left"></i> Lịch sử</button><button class="btn-submit" onclick="switchTab('profileTab')"><i class="fas fa-user"></i> Hồ sơ</button><button class="btn-submit" onclick="switchTab('vipTab')"><i class="fas fa-crown"></i> VIP</button><button class="btn-submit" onclick="switchTab('achievementsTab')"><i class="fas fa-trophy"></i> Thành tích</button></div></div>`;
    const container = document.getElementById('userDashboardContainer');
    if (container) { container.innerHTML = html; openModal('userDashboardModal'); } else {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'userDashboardModal';
        modal.innerHTML = `<div class="modal-content" style="max-width:600px;"><div class="modal-header"><h2><i class="fas fa-chart-pie"></i> Dashboard của tôi</h2><button class="modal-close" onclick="closeModal('userDashboardModal')">&times;</button></div><div class="modal-body">${html}</div></div>`;
        document.body.appendChild(modal);
        openModal('userDashboardModal');
    }
}

function adminShowTools() {
    const toolsHTML = `<div class="admin-tools-grid">
        <button class="btn-submit" onclick="createBackup();showToast('✅ Backup thành công!','fas fa-check','success');" style="width:100%;"><i class="fas fa-save"></i> Backup ngay</button>
        <button class="btn-submit" onclick="restoreFromBackup();" style="width:100%;background:linear-gradient(135deg,#ffaa00,#ff6600);"><i class="fas fa-undo"></i> Restore backup</button>
        <button class="btn-submit" onclick="exportAllData();" style="width:100%;background:linear-gradient(135deg,#00f0ff,#0088ff);"><i class="fas fa-file-export"></i> Export dữ liệu</button>
        <button class="btn-submit" onclick="document.getElementById('importFileInput').click();" style="width:100%;background:linear-gradient(135deg,#00ff88,#00cc66);"><i class="fas fa-file-import"></i> Import dữ liệu</button>
        <button class="btn-submit" onclick="repairCorruptedData();" style="width:100%;background:linear-gradient(135deg,#ff4d4d,#cc0000);"><i class="fas fa-tools"></i> Sửa lỗi dữ liệu</button>
        <button class="btn-submit" onclick="globalSearch(prompt('🔍 Nhập từ khóa:'));" style="width:100%;background:linear-gradient(135deg,#7000ff,#4400aa);"><i class="fas fa-search"></i> Tìm kiếm toàn cục</button>
        <button class="btn-submit" onclick="resetToDefaultData();" style="width:100%;background:linear-gradient(135deg,#ff0000,#cc0000);color:#fff;border:1px solid #ff4d4d;"><i class="fas fa-radiation"></i> RESET TOÀN BỘ DỮ LIỆU</button>
        <button class="btn-submit" onclick="clearActivityLogs();" style="width:100%;background:linear-gradient(135deg,#666,#333);"><i class="fas fa-broom"></i> Xóa log hoạt động</button>
        <button class="btn-submit" onclick="saveWebhookUrl(prompt('Nhập Webhook URL:'));" style="width:100%;background:linear-gradient(135deg,#5865F2,#4752C4);"><i class="fas fa-link"></i> Cấu hình Webhook</button>
        <button class="btn-submit" onclick="exportToCSV(Auth.getUsers(),'users.csv');" style="width:100%;background:linear-gradient(135deg,#1D9BF0,#0A7BC1);"><i class="fas fa-file-excel"></i> Export User Excel</button>
        <button class="btn-submit" onclick="setMaintenance(!getMaintenance());" style="width:100%;background:linear-gradient(135deg,#ff6b00,#cc5500);"><i class="fas fa-tools"></i> ${getMaintenance() ? 'Tắt' : 'Bật'} bảo trì</button>
        <button class="btn-submit" onclick="applyTheme(prompt('Nhập theme (dark/light/cyber/neon):'));" style="width:100%;background:linear-gradient(135deg,#7C3AED,#5B21B6);"><i class="fas fa-palette"></i> Đổi theme</button>
    </div>
    <input type="file" id="importFileInput" accept=".json" style="display:none;" onchange="importAllData(this.files[0]); this.value='';">`;
    Swal.fire({ title: '🛠️ Công cụ quản trị', html: toolsHTML, background: '#0a0e17', color: '#fff', confirmButtonColor: '#00f0ff', confirmButtonText: 'Đóng', width: '500px', showCancelButton: false });
}

function createBackup() {
    try {
        const backup = { timestamp: new Date().toISOString(), version: '31.0', data: { files: localStorage.getItem(STORAGE_KEY_FILES), users: localStorage.getItem(STORAGE_KEY_USERS), cart: localStorage.getItem(STORAGE_KEY_CART), reviews: localStorage.getItem(STORAGE_KEY_REVIEWS), giftcodes: localStorage.getItem(STORAGE_KEY_GIFTCODES), events: localStorage.getItem(STORAGE_KEY_EVENTS), bank: localStorage.getItem(STORAGE_KEY_BANK), support: localStorage.getItem(STORAGE_KEY_SUPPORT), spinWeights: localStorage.getItem(STORAGE_KEY_SPIN_WEIGHTS), processedDeposits: localStorage.getItem(STORAGE_KEY_PROCESSED_DEPOSITS) } };
        localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
        console.log('[💾] Backup dữ liệu thành công lúc:', backup.timestamp);
        return backup;
    } catch (e) { console.error('[❌] Backup thất bại:', e); return null; }
}

function restoreFromBackup() {
    try {
        const backupData = localStorage.getItem(BACKUP_KEY);
        if (!backupData) { showToast('Không tìm thấy bản backup!', 'fas fa-triangle-exclamation', 'error'); return false; }
        const backup = JSON.parse(backupData);
        if (!backup.data) { showToast('Backup bị hỏng!', 'fas fa-triangle-exclamation', 'error'); return false; }
        if (backup.data.files) localStorage.setItem(STORAGE_KEY_FILES, backup.data.files);
        if (backup.data.users) localStorage.setItem(STORAGE_KEY_USERS, backup.data.users);
        if (backup.data.cart) localStorage.setItem(STORAGE_KEY_CART, backup.data.cart);
        if (backup.data.reviews) localStorage.setItem(STORAGE_KEY_REVIEWS, backup.data.reviews);
        if (backup.data.giftcodes) localStorage.setItem(STORAGE_KEY_GIFTCODES, backup.data.giftcodes);
        if (backup.data.events) localStorage.setItem(STORAGE_KEY_EVENTS, backup.data.events);
        if (backup.data.bank) localStorage.setItem(STORAGE_KEY_BANK, backup.data.bank);
        if (backup.data.support) localStorage.setItem(STORAGE_KEY_SUPPORT, backup.data.support);
        if (backup.data.spinWeights) localStorage.setItem(STORAGE_KEY_SPIN_WEIGHTS, backup.data.spinWeights);
        if (backup.data.processedDeposits) localStorage.setItem(STORAGE_KEY_PROCESSED_DEPOSITS, backup.data.processedDeposits);
        FILE_DATA = getGlobalFiles();
        APP.files = [...FILE_DATA];
        APP.filteredFiles = [...FILE_DATA];
        APP.bankConfig = getBankConfig();
        if (APP.isLoggedIn) {
            const user = Auth.getCurrentUser();
            if (user) { APP.balance = user.balance || 0; APP.history = user.history || []; APP.totalDeposit = user.totalDeposit || 0; APP.vipLevel = user.vipLevel || 0; APP.vipPoints = user.vipPoints || 0; if (DOM.userBalance) DOM.userBalance.textContent = APP.balance.toLocaleString(); if (DOM.profileBalance) DOM.profileBalance.textContent = APP.balance.toLocaleString() + 'đ'; renderHistory(); updateVIPUI(user); }
        }
        renderFiles();
        renderFileGrid();
        renderCart();
        updateCartUI();
        renderReviews();
        renderEvents();
        renderMissions();
        if (APP.isAdmin) { renderAdminDashboard(); renderAdminFiles(); renderAdminGiftcodes(); renderAdminEvents(); renderAdminQRConfig(); }
        updateRealStats();
        showToast(`✅ Đã khôi phục backup từ ${new Date(backup.timestamp).toLocaleString()}`, 'fas fa-undo', 'success');
        triggerConfetti();
        setTimeout(publishFullState, 500);
        updateRevenueChart();
        return true;
    } catch (e) { console.error('[❌] Restore thất bại:', e); showToast('Lỗi khôi phục backup!', 'fas fa-triangle-exclamation', 'error'); return false; }
}

setInterval(createBackup, 300000);

function exportAllData() {
    try {
        const data = { version: '31.0', exportedAt: new Date().toISOString(), shopName: 'Tấn Dũng FF', data: { files: JSON.parse(localStorage.getItem(STORAGE_KEY_FILES) || '[]'), users: JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]'), cart: JSON.parse(localStorage.getItem(STORAGE_KEY_CART) || '[]'), reviews: JSON.parse(localStorage.getItem(STORAGE_KEY_REVIEWS) || '[]'), giftcodes: JSON.parse(localStorage.getItem(STORAGE_KEY_GIFTCODES) || '[]'), events: JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS) || '[]'), bank: JSON.parse(localStorage.getItem(STORAGE_KEY_BANK) || '{}'), support: JSON.parse(localStorage.getItem(STORAGE_KEY_SUPPORT) || '{}'), spinWeights: JSON.parse(localStorage.getItem(STORAGE_KEY_SPIN_WEIGHTS) || '[]'), processedDeposits: JSON.parse(localStorage.getItem(STORAGE_KEY_PROCESSED_DEPOSITS) || '[]') } };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tandung_ff_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✅ Xuất dữ liệu thành công!', 'fas fa-file-export', 'success');
    } catch (e) { showToast('❌ Lỗi xuất dữ liệu!', 'fas fa-file-export', 'error'); console.error(e); }
}

function importAllData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.data || !data.version) { showToast('❌ File không hợp lệ!', 'fas fa-file-import', 'error'); return; }
            Swal.fire({ title: '⚠️ Cảnh báo!', text: 'Import sẽ ghi đè toàn bộ dữ liệu hiện tại. Bạn có chắc?', icon: 'warning', background: '#040814', color: '#fff', confirmButtonColor: '#ff4d4d', cancelButtonColor: '#94a3b8', showCancelButton: true, confirmButtonText: '✅ Import', cancelButtonText: 'Hủy' })
                .then(res => {
                    if (res.isConfirmed) {
                        if (data.data.files) localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(data.data.files));
                        if (data.data.users) localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(data.data.users));
                        if (data.data.cart) localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(data.data.cart));
                        if (data.data.reviews) localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(data.data.reviews));
                        if (data.data.giftcodes) localStorage.setItem(STORAGE_KEY_GIFTCODES, JSON.stringify(data.data.giftcodes));
                        if (data.data.events) localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(data.data.events));
                        if (data.data.bank) localStorage.setItem(STORAGE_KEY_BANK, JSON.stringify(data.data.bank));
                        if (data.data.support) localStorage.setItem(STORAGE_KEY_SUPPORT, JSON.stringify(data.data.support));
                        if (data.data.spinWeights) localStorage.setItem(STORAGE_KEY_SPIN_WEIGHTS, JSON.stringify(data.data.spinWeights));
                        if (data.data.processedDeposits) localStorage.setItem(STORAGE_KEY_PROCESSED_DEPOSITS, JSON.stringify(data.data.processedDeposits));
                        FILE_DATA = getGlobalFiles();
                        APP.files = [...FILE_DATA];
                        APP.filteredFiles = [...FILE_DATA];
                        APP.bankConfig = getBankConfig();
                        if (APP.isLoggedIn) {
                            const user = Auth.getCurrentUser();
                            if (user) { APP.balance = user.balance || 0; APP.history = user.history || []; APP.totalDeposit = user.totalDeposit || 0; APP.vipLevel = user.vipLevel || 0; APP.vipPoints = user.vipPoints || 0; if (DOM.userBalance) DOM.userBalance.textContent = APP.balance.toLocaleString(); if (DOM.profileBalance) DOM.profileBalance.textContent = APP.balance.toLocaleString() + 'đ'; renderHistory(); updateVIPUI(user); }
                        }
                        renderFiles();
                        renderFileGrid();
                        renderCart();
                        updateCartUI();
                        renderReviews();
                        renderEvents();
                        renderMissions();
                        if (APP.isAdmin) { renderAdminDashboard(); renderAdminFiles(); renderAdminGiftcodes(); renderAdminEvents(); renderAdminQRConfig(); }
                        updateRealStats();
                        createBackup();
                        showToast('✅ Import dữ liệu thành công!', 'fas fa-file-import', 'success');
                        triggerConfetti();
                        setTimeout(publishFullState, 500);
                        updateRevenueChart();
                    }
                });
        } catch (err) { showToast('❌ Lỗi đọc file!', 'fas fa-file-import', 'error'); console.error(err); }
    };
    reader.readAsText(file);
}

function repairCorruptedData() {
    try {
        let fixed = false;
        try { const files = JSON.parse(localStorage.getItem(STORAGE_KEY_FILES) || '[]'); if (!Array.isArray(files)) { localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify([])); fixed = true; } } catch (e) { localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify([])); fixed = true; }
        try { const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]'); if (!Array.isArray(users)) { localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([])); fixed = true; } } catch (e) { localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([])); fixed = true; }
        try { const cart = JSON.parse(localStorage.getItem(STORAGE_KEY_CART) || '[]'); if (!Array.isArray(cart)) { localStorage.setItem(STORAGE_KEY_CART, JSON.stringify([])); fixed = true; } } catch (e) { localStorage.setItem(STORAGE_KEY_CART, JSON.stringify([])); fixed = true; }
        if (fixed) { showToast('🔧 Dữ liệu đã được sửa chữa!', 'fas fa-tools', 'warning'); location.reload(); }
        return fixed;
    } catch (e) { console.error('Lỗi sửa dữ liệu:', e); return false; }
}

function resetToDefaultData() {
    if (!APP.isAdmin) return;
    Swal.fire({ title: '⚠️ Reset toàn bộ dữ liệu?', text: 'Hành động này sẽ xóa tất cả dữ liệu và reset về mặc định. Không thể hoàn tác!', icon: 'error', background: '#040814', color: '#fff', confirmButtonColor: '#ff4d4d', cancelButtonColor: '#94a3b8', showCancelButton: true, confirmButtonText: '✅ Reset', cancelButtonText: 'Hủy' })
        .then(res => { if (res.isConfirmed) { localStorage.clear(); FILE_DATA = getGlobalFiles(); APP.files = [...FILE_DATA]; APP.filteredFiles = [...FILE_DATA]; APP.bankConfig = getBankConfig(); location.reload(); } });
}

function globalSearch(query) {
    if (!query || query.length < 2) { showToast('Nhập ít nhất 2 ký tự!', 'fas fa-search', 'warning'); return; }
    const q = query.toLowerCase().trim();
    const results = { files: [], users: [], transactions: [], reviews: [], reports: [] };
    FILE_DATA.forEach(f => { if (f.name.toLowerCase().includes(q) || f.category.includes(q) || (f.note && f.note.toLowerCase().includes(q))) results.files.push(f); });
    const users = Auth.getUsers();
    users.forEach(u => { if (u.username.toLowerCase().includes(q) || (u.email && u.email.toLowerCase().includes(q))) results.users.push(u); });
    if (APP.isLoggedIn) {
        const user = Auth.getCurrentUser();
        if (user && user.history) user.history.forEach(h => { if (h.desc.toLowerCase().includes(q)) results.transactions.push(h); });
    }
    const reviews = Auth.getReviews();
    reviews.forEach(r => { if (r.content.toLowerCase().includes(q) || r.username.toLowerCase().includes(q) || r.fileName.toLowerCase().includes(q)) results.reviews.push(r); });
    const reports = getReports();
    reports.forEach(r => { if (r.reason.toLowerCase().includes(q) || r.username.toLowerCase().includes(q)) results.reports.push(r); });
    let message = `🔍 Kết quả tìm kiếm "${query}":\n📦 File: ${results.files.length}\n👤 User: ${results.users.length}\n${APP.isLoggedIn ? `💳 Giao dịch: ${results.transactions.length}\n` : ''}⭐ Đánh giá: ${results.reviews.length}\n📢 Báo cáo: ${results.reports.length}`;
    showToast(message, 'fas fa-search', 'info');
    if (APP.isAdmin) { console.log('[🔍] Search results:', results); securityLog(`🔍 Tìm kiếm: "${query}" - ${results.files.length} files, ${results.users.length} users`); }
    return results;
}

function updateSupportUI(data) {
    const zaloText = document.getElementById('supportZaloText');
    const fbText = document.getElementById('supportFbText');
    const telegramText = document.getElementById('supportTelegramText');
    const zaloInput = document.getElementById('adminZaloInput');
    const fbInput = document.getElementById('adminFbInput');
    const telegramInput = document.getElementById('adminTelegramInput');
    if (zaloText) zaloText.textContent = data.zalo || '0358888888';
    if (fbText) fbText.textContent = data.facebook || 'Tấn Dũng FF';
    if (telegramText) telegramText.textContent = data.telegram || '@TandungFF';
    if (zaloInput) zaloInput.value = data.zalo || '0358888888';
    if (fbInput) fbInput.value = data.facebook || 'Tấn Dũng FF';
    if (telegramInput) telegramInput.value = data.telegram || '@TandungFF';
}

function openSupportLink(type) {
    const links = getSupportLinks();
    let url = '';
    switch (type) {
        case 'zalo':
            url = `https://zalo.me/${links.zalo}`;
            break;
        case 'facebook':
            url = `https://facebook.com/${links.facebook}`;
            break;
        case 'telegram':
            url = `https://t.me/${links.telegram.replace('@', '')}`;
            break;
        default:
            return;
    }
    window.open(url, '_blank');
    showToast(`Đang mở ${type}...`, 'fas fa-external-link', 'success');
}

const trackList = ['🎵 Free Fire Theme', '🎵 FF The Awakening', '🎵 Booyah! EDM', '🎵 Headshot! Trap'];
let currentTrack = 0;
let isPlaying = false;
const playBtn = document.getElementById('playBtn');
const musicStatus = document.getElementById('musicStatus');

function toggleMusic() {
    isPlaying = !isPlaying;
    if (isPlaying) { playBtn.className = 'fas fa-pause'; musicStatus.textContent = trackList[currentTrack] + ' 🔥'; showToast('🎧 Đang phát nhạc!', 'fas fa-music'); } else { playBtn.className = 'fas fa-play'; musicStatus.textContent = trackList[currentTrack] + ' ⏸️'; showToast('Đã dừng nhạc', 'fas fa-pause'); }
}

function nextTrack() { currentTrack = (currentTrack + 1) % trackList.length;
    musicStatus.textContent = trackList[currentTrack] + (isPlaying ? ' 🔥' : ' ⏸️'); if (isPlaying) showToast(`Bài: ${trackList[currentTrack]}`, 'fas fa-forward'); }

function prevTrack() { currentTrack = (currentTrack - 1 + trackList.length) % trackList.length;
    musicStatus.textContent = trackList[currentTrack] + (isPlaying ? ' 🔥' : ' ⏸️'); if (isPlaying) showToast(`Bài: ${trackList[currentTrack]}`, 'fas fa-backward'); }

// ============================================================
//  AUTO SYNC ĐỊNH KỲ - GIẢM TẦN SUẤT
// ============================================================
setInterval(() => {
    if (APP.isAdmin === true && mqttClient && mqttClient.connected && !_isSyncProcessing) {
        const currentHash = getCurrentStateHash();
        if (currentHash !== lastStateHash) {
            publishFullState({ silent: true });
            console.log('🔄 Auto sync full state sau 30s (có thay đổi)');
        }
    }
}, 30000);

// ============================================================
//  TỰ ĐỘNG SYNC KHI MỞ TAB MỚI
// ============================================================
setTimeout(function() {
    if (APP.isLoggedIn) {
        publishMqtt('sync_request', { from: 'new_connection' });
        broadcastSync({ type: 'sync_request' });
        try {
            const syncData = localStorage.getItem('ff_force_sync');
            if (syncData) {
                const parsed = JSON.parse(syncData);
                if (parsed.data) {
                    const currentState = getCurrentStateHash();
                    const newState = JSON.stringify(parsed.data);
                    if (currentState !== newState) {
                        applyFullState(parsed.data, true);
                        updateRevenueChart();
                    }
                }
            }
        } catch(e) {}
    }
}, 3000);

// ============================================================
//  EXPOSE GLOBALS
// ============================================================
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.switchTab = switchTab;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.checkoutCart = checkoutCart;
window.buyNow = buyNow;
window.renderCart = renderCart;
window.updateCartUI = updateCartUI;
window.getCart = getCart;
window.getCartTotal = getCartTotal;
window.showFileDetail = showFileDetail;
window.adminSaveQRConfig = adminSaveQRConfig;
window.renderAdminQRConfig = renderAdminQRConfig;
window.spinTheWheel = spinTheWheel;
window.triggerConfetti = triggerConfetti;
window.confirmPaid = confirmPaid;
window.cancelDeposit = cancelDeposit;
window.searchProducts = searchProducts;
window.loadMoreProducts = loadMoreProducts;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleMusic = toggleMusic;
window.nextTrack = nextTrack;
window.prevTrack = prevTrack;
window.togglePassword = togglePassword;
window.handleLoginSubmit = handleLoginSubmit;
window.handleRegisterSubmit = handleRegisterSubmit;
window.handleLogout = handleLogout;
window.handleDepositSubmit = handleDepositSubmit;
window.handleDepositPage = handleDepositPage;
window.handleRedeemCode = handleRedeemCode;
window.toggleUserMenu = toggleUserMenu;
window.approveDeposit = approveDeposit;
window.rejectDeposit = rejectDeposit;
window.renderAdminDashboard = renderAdminDashboard;
window.filterDeposits = filterDeposits;
window.openDepositWithMethod = openDepositWithMethod;
window.openReviewModal = openReviewModal;
window.handleReviewSubmit = handleReviewSubmit;
window.renderReviews = renderReviews;
window.renderTopRanking = renderTopRanking;
window.updateRealStats = updateRealStats;
window.updateVIPUI = updateVIPUI;
window.renderFiles = renderFiles;
window.renderFileGrid = renderFileGrid;
window.filterFiles = filterFiles;
window.changeFilePage = changeFilePage;
window.renderSpinHistory = renderSpinHistory;
window.renderEvents = renderEvents;
window.renderMissions = renderMissions;
window.joinEvent = joinEvent;
window.claimMission = claimMission;
window.updateMissions = updateMissions;
window.switchAdminTab = switchAdminTab;
window.adminCreateGiftcode = adminCreateGiftcode;
window.adminDeleteGiftcode = adminDeleteGiftcode;
window.adminShowCreateEvent = adminShowCreateEvent;
window.adminEditEvent = adminEditEvent;
window.adminDeleteEvent = adminDeleteEvent;
window.adminShowCreateFile = adminShowCreateFile;
window.adminEditFile = adminEditFile;
window.adminDeleteFile = adminDeleteFile;
window.adminSaveFileEdit = adminSaveFileEdit;
window.adminCreateFile = adminCreateFile;
window.adminAddBalance = adminAddBalance;
window.adminEditUser = adminEditUser;
window.adminDeleteUser = adminDeleteUser;
window.adminChangePassword = adminChangePassword;
window.adminToggleLock = adminToggleLock;
window.adminSaveSettings = adminSaveSettings;
window.renderAdminSpinWeights = renderAdminSpinWeights;
window.updateSpinWeightPercent = updateSpinWeightPercent;
window.adminSaveSpinWeights = adminSaveSpinWeights;
window.updateAdminSpinStats = updateAdminSpinStats;
window.adminSaveSupport = adminSaveSupport;
window.openSupportLink = openSupportLink;
window.getSupportLinks = getSupportLinks;
window.updateSupportUI = updateSupportUI;
window.updateDepositUsername = updateDepositUsername;
window.securityLog = securityLog;
window.initSecurity = initSecurity;
window.Auth = Auth;
window.APP = APP;
window.VIP_CONFIG = VIP_CONFIG;
window.FILE_DATA = FILE_DATA;
window.SPIN_PRIZES = SPIN_PRIZES;
window.EVENTS = EVENTS;
window.MISSIONS = MISSIONS;
window.getGlobalFiles = getGlobalFiles;
window.saveGlobalFiles = saveGlobalFiles;
window.createBackup = createBackup;
window.restoreFromBackup = restoreFromBackup;
window.exportAllData = exportAllData;
window.importAllData = importAllData;
window.repairCorruptedData = repairCorruptedData;
window.globalSearch = globalSearch;
window.renderUserDashboard = renderUserDashboard;
window.adminShowTools = adminShowTools;
window.resetToDefaultData = resetToDefaultData;
window.getTheme = getTheme;
window.setTheme = setTheme;
window.toggleTheme = toggleTheme;
window.applyTheme = applyTheme;
window.getMaintenance = getMaintenance;
window.setMaintenance = setMaintenance;
window.isMaintenance = isMaintenance;
window.renderAchievements = renderAchievements;
window.getAchievements = getAchievements;
window.unlockAchievement = unlockAchievement;
window.checkAchievements = checkAchievements;
window.sendWebhook = sendWebhook;
window.saveWebhookUrl = saveWebhookUrl;
window.exportToCSV = exportToCSV;
window.saveDraft = saveDraft;
window.getDraft = getDraft;
window.clearDraft = clearDraft;
window.cleanOldCache = cleanOldCache;
window.initMqttClient = initMqttClient;
window.publishMqtt = publishMqtt;
window.publishFullState = publishFullState;
window.handleSyncMessage = handleSyncMessage;
window.renderAdminUsers = renderAdminUsers;
window.updateRevenueChart = updateRevenueChart;
window.getRevenueData = getRevenueData;
window.forceSyncToAllUsers = forceSyncToAllUsers;
window.getCurrentStateHash = getCurrentStateHash;
window.updateSyncStatus = updateSyncStatus;
window.getProcessedDeposits = getProcessedDeposits;
window.addProcessedDeposit = addProcessedDeposit;
window.isDepositProcessed = isDepositProcessed;

console.log('🚀 SHOP TẤN DŨNG FF v31.0 - ULTIMATE SYNC!');
console.log('📁 Files:', FILE_DATA.length);
console.log('📡 MQTT: Tự động kết nối đến broker.emqx.io');
console.log('✅ FIX: SYNC HOÀN HẢO - KHÔNG LỖI DUYỆT - CỘNG TIỀN CHÍNH XÁC 100%!');

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    if (isMaintenance()) return;

    applyTheme(getTheme());

    FILE_DATA = getGlobalFiles();
    APP.files = [...FILE_DATA];
    APP.filteredFiles = [...FILE_DATA];
    APP.bankConfig = getBankConfig();
    checkSession();
    renderFiles();
    renderFileGrid();
    renderCart();
    updateCartUI();
    renderEvents();
    renderMissions();
    renderSpinHistory();
    renderAdminGiftcodes();
    renderAdminEvents();
    renderAdminFiles();
    renderAdminQRConfig();
    updateDepositUsername();
    setupCategoryFilter();
    setupViewToggle();
    setupScrollListener();
    setupKeyboardShortcuts();
    initWheelSegments();
    updateLiveUsers();
    updateClock();
    setInterval(updateClock, 1000);
    setupPresetButtons();
    setupDepositLimitCheck();
    setupStarRating();
    setupReviewImagePreview();
    updateRealStats();
    renderReviews();
    renderTopRanking('all');
    populateReviewFiles();
    renderAchievements();
    renderAdminUsers();
    updateSyncStatus('Kết nối...', false);

    setTimeout(updateRevenueChart, 500);
    setTimeout(initMqttClient, 2000);

    if (APP.isAdmin) {
        setInterval(() => {
            const adminTab = document.getElementById('adminTab');
            if (adminTab && adminTab.classList.contains('active-tab')) {
                renderDepositRequests();
                const pendingCount = Auth.getAllDepositRequests().filter(r => r.status === 'pending').length;
                if (DOM.pendingBadge) {
                    DOM.pendingBadge.textContent = pendingCount;
                    DOM.pendingBadge.className = `badge ${pendingCount > 0 ? 'warning' : 'success'}`;
                }
                renderAdminUsers();
                updateAdminDashboardChart();
            }
        }, 5000);
    }
    document.getElementById('spinTotalSpent').textContent = '0đ';
    console.log('🚀 SHOP TẤN DŨNG FF v31.0 - ULTIMATE SYNC!');
    console.log('✅ TẤT CẢ CHỨC NĂNG HOÀN THIỆN!');
});

// ============================================================
//  CUSTOM CURSOR
// ============================================================
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, trailX = 0, trailY = 0;
document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; DOM.cursorDot.style.left = `${mouseX}px`; DOM.cursorDot.style.top = `${mouseY}px`; });

function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    DOM.cursor.style.left = `${cursorX}px`;
    DOM.cursor.style.top = `${cursorY}px`;
    trailX += (mouseX - trailX) * 0.06;
    trailY += (mouseY - trailY) * 0.06;
    DOM.cursorTrail.style.left = `${trailX}px`;
    DOM.cursorTrail.style.top = `${trailY}px`;
    requestAnimationFrame(renderCursor);
}
renderCursor();

document.querySelectorAll('a, button, .product-card, .sidebar-menu li a').forEach(el => {
    el.addEventListener('mouseenter', () => DOM.cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => DOM.cursor.classList.remove('active'));
});

function toggleMobileMenu() { DOM.navLinks.classList.toggle('open'); }

function setupPresetButtons() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = parseInt(this.dataset.amount);
            const parent = this.closest('.form-group');
            if (parent) {
                const input = parent.parentElement.querySelector('input[type="number"]');
                if (input) { if (amount > APP.maxDeposit) { showToast('Số tiền vượt quá giới hạn 1.000.000đ!', 'fas fa-triangle-exclamation', 'error'); return; } input.value = amount; }
            }
            this.parentElement.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function setupDepositLimitCheck() {
    const amountInput = document.getElementById('depositAmount');
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            const val = parseInt(this.value) || 0;
            const warning = document.getElementById('depositLimitWarning');
            if (val > APP.maxDeposit) { warning.style.display = 'block'; this.classList.add('error'); } else { warning.style.display = 'none'; this.classList.remove('error'); }
        });
    }
}

function setupStarRating() {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.star);
            APP.selectedRating = rating;
            document.getElementById('reviewRating').value = rating;
            stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.star) <= rating));
        });
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.star);
            stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.star) <= rating));
        });
        star.addEventListener('mouseleave', function() {
            const rating = APP.selectedRating;
            stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.star) <= rating));
        });
    });
}

function setupReviewImagePreview() {
    const input = document.getElementById('reviewImages');
    if (input) {
        input.addEventListener('change', function() {
            const preview = document.getElementById('reviewImagePreview');
            preview.innerHTML = '';
            const files = Array.from(this.files);
            if (files.length > 3) { showToast('Chỉ được tối đa 3 ảnh!', 'fas fa-triangle-exclamation', 'error'); this.value = ''; return; }
            files.forEach(file => {
                if (!file.type.startsWith('image/')) { showToast('Chỉ chấp nhận file ảnh!', 'fas fa-triangle-exclamation', 'error'); this.value = ''; return; }
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '80px';
                    img.style.height = '80px';
                    img.style.borderRadius = '8px';
                    img.style.objectFit = 'cover';
                    img.style.border = '1px solid rgba(255,255,255,0.06)';
                    preview.appendChild(img);
                    const content = document.getElementById('reviewContent')?.value || '';
                    saveDraft('review', { content });
                };
                reader.readAsDataURL(file);
            });
        });
    }
    const contentInput = document.getElementById('reviewContent');
    if (contentInput) {
        contentInput.addEventListener('input', function() {
            saveDraft('review', { content: this.value });
        });
    }
}

function updateLiveUsers() {
    const base = 120;
    const variance = 40;
    setInterval(() => { const users = Math.floor(base + Math.random() * variance); if (DOM.liveUsers) DOM.liveUsers.textContent = users; }, 5000);
}

function updateClock() {
    const now = new Date();
    if (DOM.adminToday) DOM.adminToday.textContent = now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' });
    if (DOM.adminTime) DOM.adminTime.textContent = now.toLocaleTimeString('vi-VN');
    const clockEl = document.querySelector('.real-time-clock');
    if (clockEl) clockEl.textContent = `${now.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' })} - ${now.toLocaleTimeString('vi-VN', { hour12: false })}`;
}

function setupScrollListener() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
        if (window.scrollY > 400) DOM.scrollTop.classList.add('show');
        else DOM.scrollTop.classList.remove('show');
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); DOM.searchInput.focus(); }
        if (e.key === 'Escape') { document.querySelectorAll('.modal-overlay.show').forEach(modal => closeModal(modal.id)); DOM.userDropdown.classList.remove('show'); }
        if (e.altKey && e.key === 's') { e.preventDefault(); const query = prompt('🔍 Nhập từ khóa tìm kiếm:'); if (query) globalSearch(query); }
        if (e.altKey && e.key === 't') { e.preventDefault(); toggleTheme(); }
    });
}