// Массив ссылок на страницы дворцов
const palaces = [
    'tavricheskiy.html',
    'mihaylovskiy-zamok.html',
    'mihaylovskiy-dvorec.html',
    'anichkov.html',
    'stroganovskiy.html',
    'novo-mihaylovskiy.html',
    'zimniy.html',
    'mariinskiy.html',
    'petra-2.html',
    'elagin.html',
    'petergof.html',
    'bolshoy-gatchinskiy.html'
];

// Функция для перехода к случайному дворцу
function goToRandomPalace() {
    const randomIndex = Math.floor(Math.random() * palaces.length);
    window.location.href = palaces[randomIndex];
}

// Навешиваем обработчик события на кнопку
document.addEventListener('DOMContentLoaded', function() {
    const randomPalaceBtn = document.querySelector('.random-palace-btn');
    if (randomPalaceBtn) {
        randomPalaceBtn.addEventListener('click', function(e) {
            e.preventDefault();
            goToRandomPalace();
        });
    }
});
