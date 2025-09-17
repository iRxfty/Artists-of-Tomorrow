const COOKIE_CONSENT_KEY = 'cookieConsentStatus';
const LEGACY_CONSENT_KEY = 'privacyAccepted';

document.addEventListener('DOMContentLoaded', () => {
    try {
        const legacyValue = localStorage.getItem(LEGACY_CONSENT_KEY);
        const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

        if (legacyValue && !storedConsent) {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        }

        if (legacyValue) {
            localStorage.removeItem(LEGACY_CONSENT_KEY);
        }

        if (localStorage.getItem(COOKIE_CONSENT_KEY)) {
            return;
        }
    } catch (error) {
        console.warn('Cookie consent banner could not access localStorage.', error);
    }

    const banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie consent notice');

    banner.innerHTML = `
        <div class="cookie-consent__container">
            <div class="cookie-consent__icon" aria-hidden="true">🍪</div>
            <div class="cookie-consent__content">
                <h2 class="cookie-consent__title">Your privacy matters</h2>
                <p class="cookie-consent__description">
                    We use cookies and similar technologies to understand how our site is used and to improve your experience.
                    Learn more in our <a href="privacy.html">privacy policy</a>.
                </p>
            </div>
            <div class="cookie-consent__actions">
                <button type="button" class="cookie-consent__button cookie-consent__button--secondary" data-consent="decline">
                    Decline
                </button>
                <button type="button" class="cookie-consent__button cookie-consent__button--primary" data-consent="accept">
                    Accept all
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(banner);
    requestAnimationFrame(() => {
        banner.classList.add('cookie-consent--visible');
    });

    const acceptButton = banner.querySelector('[data-consent="accept"]');
    const declineButton = banner.querySelector('[data-consent="decline"]');

    const removeBanner = () => {
        if (banner.isConnected) {
            banner.remove();
        }
    };

    const handleChoice = (status) => {
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, status);
        } catch (error) {
            console.warn('Unable to persist cookie consent choice.', error);
        }

        banner.classList.remove('cookie-consent--visible');
        banner.classList.add('cookie-consent--hidden');

        const transitionCleanup = () => removeBanner();
        banner.addEventListener('transitionend', transitionCleanup, { once: true });

        setTimeout(() => {
            if (banner.isConnected) {
                removeBanner();
            }
        }, 600);
    };

    if (acceptButton) {
        acceptButton.addEventListener('click', () => handleChoice('accepted'));
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => handleChoice('declined'));
    }

    banner.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            handleChoice('declined');
        }
    });

    if (acceptButton) {
        setTimeout(() => {
            try {
                acceptButton.focus({ preventScroll: true });
            } catch (error) {
                acceptButton.focus();
            }
        }, 120);
    }
});
