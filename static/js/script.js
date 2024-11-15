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

const textarea = document.getElementsByClassName('contact_form_text')[0];
const placeholder = document.getElementsByClassName('placeholder')[0];
console.log(textarea)


// Функция для обновления видимости плейсхолдера
function updatePlaceholder() {
    if (textarea.value === '') {
        placeholder.style.display = 'block';
    } else {
        placeholder.style.display = 'none';
    }
}

// Скрываем плейсхолдер при фокусировке
textarea.addEventListener('focus', () => {
    placeholder.style.display = 'none';
});

// Проверяем текст при потере фокуса
textarea.addEventListener('blur', updatePlaceholder);

// Проверяем текст при вводе
textarea.addEventListener('input', updatePlaceholder);

// Инициализация видимости плейсхолдера
updatePlaceholder();
