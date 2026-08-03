let imagesToPreload = [...leftImages, ...rightImages, ...headerImages];
// let imagesToPreload = [...leftImages, ...headerImages];
console.log(imagesToPreload)
let preloadedImages = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


let currentIndexHeader = 0;
let timer;

function changeHeader() {
    currentIndexHeader = (currentIndexHeader + 1) % headerImages.length;
    header.style.backgroundImage = `url(${headerImages[currentIndexHeader]})`;
}


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

async function init() {
    try {
        await preloadImages();
        changeHeader();
        setInterval(changeHeader, 5000);
        document.getElementsByClassName('loadingOverlay')[0].style.display = 'none';
        await sleep(500);
        document.getElementsByClassName('contentData')[0].style.opacity = 1;
    } catch (error) {
        console.error(error);
        document.getElementsByClassName('loadingOverlay')[0].innerText = 'Технические работы';
    }
}

init();

let currentIndex = 0;
const leftSection = document.getElementsByClassName("section_left")[0];
const rightSection = document.getElementsByClassName("section_right")[0];
const header = document.getElementsByTagName("header")[0];
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

function updateBackgroundPosition() {
    const imageBlock = document.querySelector('header');
    const width = window.innerWidth;
    if (width <= 768) {
        imageBlock.style.backgroundPosition = 'right';
    } else {
        imageBlock.style.backgroundPosition = 'center';
    }
}

updateBackgroundPosition();
window.addEventListener('resize', updateBackgroundPosition);

function changeBackground() {
    leftSection.style.backgroundImage = `url(${leftImages[currentIndex][0]})`;
    sleep(500)
    leftSection.getElementsByClassName("section_left_project_name")[0].innerHTML = leftImages[currentIndex][1];
    leftSection.getElementsByClassName("section_left_project_description")[0].innerHTML = leftImages[currentIndex][3];
    rightSection.getElementsByTagName("a")[0].href = `${rootPath}/projects/${leftImages[currentIndex][2]}`;
    rightSection.style.backgroundImage = `url(${rightImages[currentIndex][0]})`;
}

function nextImage() {
    disableButtons();
    currentIndex = (currentIndex + 1) % leftImages.length;
    changeBackground();
    resetTimer();
    setTimeout(enableButtons, 1000);
}

function prevImage() {
    disableButtons();

    currentIndex = (currentIndex - 1 + leftImages.length) % leftImages.length;
    changeBackground();
    resetTimer();
    setTimeout(enableButtons, 3000);
}


function resetTimer() {
    clearInterval(timer);
    timer = setInterval(nextImage, 5000);
}

function disableButtons() {
    prevButton.disabled = true;
    nextButton.disabled = true;
}

function enableButtons() {
    prevButton.disabled = false;
    nextButton.disabled = false;
}

nextImage()

nextButton.addEventListener("click", nextImage);
prevButton.addEventListener("click", prevImage);