window.onbeforeunload = function() {
    // Save the scroll position in session storage
    sessionStorage.setItem('scrollPosition', window.scrollY || document.documentElement.scrollTop);
};

document.addEventListener('DOMContentLoaded', (event) => {
    // Restore scroll position when the page is fully loaded
    if (sessionStorage.getItem('scrollPosition')) {
        window.scrollTo(0, parseInt(sessionStorage.getItem('scrollPosition')));
        // Optional: Clear the saved position after scrolling
        sessionStorage.removeItem('scrollPosition');
    }
});