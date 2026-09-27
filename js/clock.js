// Shows local time in Bangladesh (GMT+6) regardless of the visitor's timezone.
function updateClock() {
    var el = document.getElementById('clock');
    if (!el) return;
    var bd = new Date(Date.now() + 6 * 3600 * 1000);
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };
    el.textContent = pad(bd.getUTCHours()) + ':' + pad(bd.getUTCMinutes()) + ' in Barishal, Bangladesh (GMT+6)';
}

updateClock();
setInterval(updateClock, 30000);
