(function shopShieldBootstrap() {
    'use strict';

    const state = {
        embedded: true,
        tampered: false,
        reasons: [],
        startedAt: Date.now()
    };

    function markTampered(reason) {
        if (!state.reasons.includes(reason)) state.reasons.push(reason);
        state.tampered = true;
        document.documentElement.dataset.shopTampered = 'true';
        window.dispatchEvent(new CustomEvent('shop:tampered', {
            detail: { reason, reasons: [...state.reasons] }
        }));
    }

    function isTrustedPage() {
        const script = document.querySelector('script[src*="shop-shield.js"]');
        if (!script || !document.querySelector('script[src*="script.js"]')) {
            markTampered('missing-embedded-script');
            return false;
        }
        return true;
    }

    function guardAdminAction(handler) {
        return function guardedAdminAction(...args) {
            if (state.tampered) {
                console.warn('[SHOP SHIELD] Admin action blocked:', state.reasons.join(', '));
                return { success: false, message: 'Phiên quản trị không đáng tin cậy.' };
            }
            return handler.apply(this, args);
        };
    }

    window.ShopShield = Object.freeze({
        embedded: true,
        get tampered() { return state.tampered; },
        get reasons() { return [...state.reasons]; },
        markTampered,
        isTrustedPage,
        guardAdminAction
    });

    if (!isTrustedPage()) return;

    const originalOpen = window.open;
    window.open = function guardedOpen(...args) {
        if (state.tampered) return null;
        return originalOpen.apply(this, args);
    };

    window.addEventListener('shop:admin-state', function(event) {
        if (!event.detail || event.detail.authorized !== true) {
            markTampered('invalid-admin-state');
        }
    });

    const bodyObserver = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                for (const node of mutation.removedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches?.('#securityBlocker')) {
                        markTampered('security-node-removed');
                    }
                }
            }
        }
    });

    if (document.body) bodyObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', function() {
        if (!isTrustedPage()) return;
        const securityBlocker = document.getElementById('securityBlocker');
        if (!securityBlocker) markTampered('security-node-missing');
    }, { once: true });
})();
