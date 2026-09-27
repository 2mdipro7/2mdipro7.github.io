// Shows local time in Dhaka (GMT+6) regardless of the visitor's timezone.
function updateClock() {
    var el = document.getElementById('clock');
    if (!el) return;
    var dhaka = new Date(Date.now() + 6 * 3600 * 1000);
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };
    el.textContent = pad(dhaka.getUTCHours()) + ':' + pad(dhaka.getUTCMinutes()) + ' in Dhaka (GMT+6)';
}

updateClock();
setInterval(updateClock, 30000);
