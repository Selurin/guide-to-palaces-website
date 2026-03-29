function updateDateTime() {
    const now = new Date();

    const time = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const date = now.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    document.getElementById('time').textContent = time;
    document.getElementById('date').textContent = date;
}

updateDateTime();
setInterval(updateDateTime, 1000);
