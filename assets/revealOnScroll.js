let rafId = null;
const delay = 100;
let lTime = 0;

function scroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const height = window.innerHeight || document.documentElement.clientHeight;
    const visibleTop = scrollTop + height;
    const revealElements = document.querySelectorAll('.reveal');

    revealElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (element.classList.contains('reveal_visible')) {
            return;
        }
        const top = rect.top + scrollTop;
        if (top <= visibleTop) {
            if (top + rect.height < scrollTop) {
                element.classList.remove('reveal_pending');
                element.classList.add('reveal_visible');
            } else {
                element.classList.add('reveal_pending');
                if (!rafId) requestAnimationFrame(reveal);
            }
        }
    });
}

function reveal() {
    rafId = null;
    const now = performance.now();

    if (now - lTime > delay) {
        lTime = now;
        const revealPendingElements = document.querySelectorAll('.reveal_pending');
        if (revealPendingElements.length > 0) {
            revealPendingElements[0].classList.remove('reveal_pending');
            revealPendingElements[0].classList.add('reveal_visible');
        }
    }

    if (document.querySelectorAll('.reveal_pending').length >= 1) {
        rafId = requestAnimationFrame(reveal);
    }
}

function initialize() {
    scroll();
}

function setupMutationObserver() {
    const container = document.body; // Change this to the appropriate container
    const observer = new MutationObserver(scroll);
    observer.observe(container, { childList: true, subtree: true });
}

initialize();
setupMutationObserver();

window.addEventListener('load', initialize);
window.addEventListener('scroll', scroll);
