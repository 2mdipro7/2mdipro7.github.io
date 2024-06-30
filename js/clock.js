function updateClock() {
    const now = new Date();
    const timeZoneOffset = 6; // Your GMT offset
    const currentGMT = now.getUTCHours();
    const currentLocalTime = (currentGMT + timeZoneOffset + 24) % 24; // Ensure the result is between 0 and 23

    // Optional: You can format the clock to your liking here
    // Pad single digit minutes and seconds with a leading zero
    const minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    const seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();

    // Format the time string
    const timeString = `${currentLocalTime}:${minutes}:${seconds}`;

    // Display the time string and the message to the user
    document.getElementById('clock').innerText = `My Current Time: ${timeString}`;
}

// Initialize the clock
updateClock();
// Update the time every second
setInterval(updateClock, 1000);