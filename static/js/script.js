function updateBackgroundPosition() {
    const imageBlock = document.querySelector('header');
    const width = window.innerWidth;
    if (width <= 768) {
        imageBlock.style.backgroundPosition = 'right';
    } else {
        imageBlock.style.backgroundPosition = 'center';
    }
}

// Обновляем позицию фона при загрузке страницы
updateBackgroundPosition();

// Обновляем позицию фона при изменении размера окна
window.addEventListener('resize', updateBackgroundPosition);

let currentIndex = 0;
let timer; // Переменная для хранения идентификатора таймера
const leftSection = document.querySelector('.section_left');
const rightSection = document.querySelector('.section_right');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

function changeBackground() {
    leftSection.style.backgroundImage = `url(${leftImages[currentIndex]})`;
    rightSection.style.backgroundImage = `url(${rightImages[currentIndex]})`;
}

// Функция для переключения на следующее изображение
function nextImage() {
    disableButtons(); // Отключаем кнопки
    currentIndex = (currentIndex + 1) % leftImages.length; // Циклический переход
    changeBackground();
    resetTimer(); // Сбрасываем таймер
    setTimeout(enableButtons, 1000); // Включаем кнопки через 1 секунду (время анимации)
}

// Функция для переключения на предыдущее изображение
function prevImage() {
    disableButtons(); // Отключаем кнопки
    currentIndex = (currentIndex - 1 + leftImages.length) % leftImages.length; // Циклический переход
    changeBackground();
    resetTimer(); // Сбрасываем таймер
    setTimeout(enableButtons, 1000); // Включаем кнопки через 1 секунду (время анимации)
}

// Функция для сброса таймера
function resetTimer() {
    clearInterval(timer); // Очищаем текущий таймер
    timer = setInterval(nextImage, 5000); // Устанавливаем новый таймер
}

// Функция для отключения кнопок
function disableButtons() {
    prevButton.disabled = true;
    nextButton.disabled = true;
}

// Функция для включения кнопок
function enableButtons() {
    prevButton.disabled = false;
    nextButton.disabled = false;
}

// Изменяем фон каждые 5 секунд
resetTimer(); // Устанавливаем начальный таймер
changeBackground(); // Устанавливаем начальные фоны
