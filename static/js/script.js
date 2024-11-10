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
