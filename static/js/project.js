let imagesToPreload = [...upImage, ...middleImage, ...downImage];
if (project == "skuratov") {
  imagesToPreload.push(`/static/img/skuratov/${project}.png`);
}
if (project == "shibui") {
  imagesToPreload.push(`/static/img/shibui/${project}.png`);
}
let preloadedImages = [];
function preloadImages() {
const promises = imagesToPreload.map(src => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        if (Array.isArray(src)) {
            img.src = src[0];
        }
        else{
            img.src = src;
        }
        console.log(img.src)
        img.onload = () => {
            preloadedImages.push(img);
            resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${src[0]}`));
    });
  });
  return Promise.all(promises);
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function init() {
  try {
    await preloadImages();
    if (project == "skuratov") {
      document.getElementsByClassName("plan")[0].insertAdjacentHTML("beforeend", `<img src="/static/img/${project}/${project}.png">`);        
    }
    if (project == "shibui") {
      document.getElementsByClassName("plan")[0].insertAdjacentHTML("beforeend", `<img src="/static/img/${project}/${project}.png">`);        
    }
    await sleep(1000);
    // Скрыть затемнение и показать контент
    document.getElementsByClassName('loadingOverlay')[0].style.display = 'none';
    await sleep(1000);
    document.getElementsByClassName('contentData')[0].style.opacity = 1;
  } catch (error) {
    console.error(error);
    // Обработка ошибок, если изображения не загрузились
    document.getElementsByClassName('loadingOverlay')[0].innerText = 'Технические работы';
  }
}
init();

const topup = document.getElementsByClassName("top")[0];
const mid = document.getElementsByClassName("middle")[0];
const bot = document.getElementsByClassName("down")[0];
let currentIndex2 = 0;
let currentIndex3 = 0;
let timer;

function changeBackground() {
  topup.style.backgroundImage = `url(${upImage[currentIndex2]})`;
  mid.style.backgroundImage = `url(${middleImage[currentIndex3]})`;
  bot.style.backgroundImage = `url(${downImage[currentIndex2]})`;
  console.log(111)
}

function nextImage() {
    currentIndex2 = (currentIndex2 + 1) % upImage.length;
    currentIndex3 = (currentIndex3 + 1) % middleImage.length;
    changeBackground();
    resetTimer();
}

function resetTimer() {
    clearInterval(timer);
    timer = setInterval(nextImage, 5000);
}

function openModal(imageSrc) {
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  modal.style.display = "block";
  modalImg.src = imageSrc;
  // Добавляем класс для анимации
  setTimeout(() => {
      modal.classList.add("show");
  }, 10); // Небольшая задержка для применения стилей
}

nextImage();

// Добавляем обработчики событий для элементов
topup.onclick = function() {
  openModal(upImage[currentIndex2]);
};

mid.onclick = function() {
  openModal(middleImage[currentIndex3]);
};

bot.onclick = function() {
  openModal(downImage[currentIndex2]);
};

// Закрытие модального окна при нажатии на фон
const modal = document.getElementById("myModal");
modal.onclick = function() {
  modal.classList.remove("show");
  // Убираем модальное окно через 0.5 секунды (время анимации)
  setTimeout(() => {
      modal.style.display = "none";
  }, 500);
};

const carousel = document.getElementsByClassName("carousel")[0];
const carouselImages = [].concat(
    upImage,
    middleImage,
    downImage
);
let currentCarouselIndex = 0;
let carouselTimer;

function changeCarouselBackground() {
    carousel.style.backgroundImage = `url(${carouselImages[currentCarouselIndex]})`;
}

function nextCarouselImage() {
    currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
    changeCarouselBackground();
    resetCarouselTimer();
}

function resetCarouselTimer() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(nextCarouselImage, 5000);
}

// Инициализация карусели
function initCarousel() {
    changeCarouselBackground();
    resetCarouselTimer();
}

// Вызов функции инициализации карусели
initCarousel();

carousel.onclick = function() {
    openModal(carouselImages[currentCarouselIndex]);
};