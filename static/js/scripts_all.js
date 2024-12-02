function centerElement() {
    let contactForm = document.getElementsByClassName('contact_form')[0];
    if (!contactForm) {
        contactForm = document.getElementsByClassName('contacts_form')[0];
    }

    let container = document.getElementsByClassName('contact_form_text')[0];
    if (!container) {
        container = document.getElementsByClassName('contacts_form_text')[0];
    }

    let element = document.getElementsByClassName('placeholder')[0];

    // Получаем размеры контейнера и элемента
    const containerRect = container.getBoundingClientRect();
    const contactFormRect = contactForm.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

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

let textarea = document.getElementsByClassName('contact_form_text')[0];
if (!textarea) {
    textarea = document.getElementsByClassName('contacts_form_text')[0];
}
const placeholder = document.getElementsByClassName('placeholder')[0];

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


document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    // Собираем данные из формы
    const name = document.querySelector('.contact_form_name').value;
    const email = document.querySelector('.contact_form_email').value;
    const phone = document.querySelector('.contact_form_tel').value;
    const text = document.querySelector('.contact_form_text').value;

    // Создаем объект с данными
    const data = {
        name: name,
        email: email,
        phone: phone,
        text: text,
    };

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Указываем, что отправляем JSON
            },
            body: JSON.stringify(data) // Преобразуем объект в строку JSON
        });

        if (!response.ok) {
            throw new Error('Сетевая ошибка');
        }

        const result = await response.json();
        console.log(result)
    } catch (error) {
        console.log(error)
    }
});