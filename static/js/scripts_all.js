function centerElement() {
    const contactForm = document.getElementsByClassName('contact_form')[0];
    const container = document.getElementsByClassName('contact_form_text')[0];
    const element = document.getElementsByClassName('placeholder')[0];

    // Получаем размеры контейнера и элемента
    const containerRect = container.getBoundingClientRect();
    const contactFormRect = contactForm.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    console.log(containerRect)

    // Вычисляем новые координаты для центрирования

    const top = (containerRect.top - contactFormRect.top) + containerRect.height / 2 - elementRect.height / 2
    const left = (containerRect.left - contactFormRect.left) + containerRect.width / 2 - elementRect.width / 2

    // Устанавливаем новые координаты
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
}

// Вызываем функцию центрирования при загрузке страницы
window.onload = centerElement;

// Добавляем обработчик события изменения размера окна
window.onresize = centerElement;