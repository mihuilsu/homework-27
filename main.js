// Константи
const SLIDES_COUNT = 3;
const CODE_ARROW_LEFT = 'ArrowLeft';
const CODE_ARROW_RIGHT = 'ArrowRight';
const CODE_SPACE = 'Space';
const FA_PAUSE = '<i class="fas fa-pause"></i>';
const FA_PLAY = '<i class="fas fa-play"></i>';
const TIMER_INTERVAL = 2000;

// Змінні
let currentSlide = 0;
let isPlaying = true;
let timerId = null;
let swipeStartX = 0;
let swipeEndX = 0;
let isDragging = false;

// Отримання елементів DOM
const carousel = document.querySelector('#carousel');
const slidesContainer = document.querySelector('#slides-container');
const slides = document.querySelectorAll('.slide');
const indicatorsContainer = document.querySelector('#indicators-container');
const indicators = document.querySelectorAll('.indicator');
const pauseBtn = document.querySelector('#pause-btn');
const prevBtn = document.querySelector('#prev-btn');
const nextBtn = document.querySelector('#next-btn');

// Функція переходу до конкретного слайду
function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  indicators[currentSlide].classList.remove('active');
  currentSlide = (n + SLIDES_COUNT) % SLIDES_COUNT;
  slides[currentSlide].classList.add('active');
  indicators[currentSlide].classList.add('active');
  
  slidesContainer.style.transition = 'transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)';
  slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Функція переходу до наступного слайду
function nextSlide() {
  goToSlide(currentSlide + 1);
}

// Функція переходу до попереднього слайду
function prevSlide() {
  goToSlide(currentSlide - 1);
}

// Функція запуску автоматичного перемикання
function startAutoPlay() {
  clearInterval(timerId);
  timerId = setInterval(nextSlide, TIMER_INTERVAL);
  isPlaying = true;
  pauseBtn.innerHTML = FA_PAUSE;
}

// Функція зупинки автоматичного перемикання
function stopAutoPlay() {
  clearInterval(timerId);
  isPlaying = false;
  pauseBtn.innerHTML = FA_PLAY;
}

// Обробник кліку на кнопку паузи/відтворення
function pausePlayHandler() {
  if (isPlaying) {
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
}

// Обробник кліку на кнопку "наступний"
function nextHandler() {
  stopAutoPlay();
  nextSlide();
}

// Обробник кліку на кнопку "попередній"
function prevHandler() {
  stopAutoPlay();
  prevSlide();
}

// Обробник кліку на індикатор
function indicatorClickHandler(e) {
  const target = e.target;
  if (target.classList.contains('indicator')) {
    stopAutoPlay();
    const slideTo = parseInt(target.getAttribute('data-slide-to'));
    goToSlide(slideTo);
  }
}

// Обробник натискання клавіш
function keydownHandler(e) {
  if (e.code === CODE_ARROW_LEFT) {
    stopAutoPlay();
    prevSlide();
  }
  if (e.code === CODE_ARROW_RIGHT) {
    stopAutoPlay();
    nextSlide();
  }
  if (e.code === CODE_SPACE) {
    e.preventDefault();
    pausePlayHandler();
  }
}

// Обробник початку свайпу
function swipeStartHandler(e) {
  isDragging = true;
  
  if (e.changedTouches) {
    swipeStartX = e.changedTouches[0].clientX;
  } else {
    swipeStartX = e.clientX;
  }
  
  slidesContainer.style.transition = 'none';
  slidesContainer.classList.add('grabbing');
}

// Обробник руху свайпу
function swipeMoveHandler(e) {
  if (!isDragging) return;
  
  let currentX;
  if (e.changedTouches) {
    currentX = e.changedTouches[0].clientX;
  } else {
    currentX = e.clientX;
  }
  
  const diff = currentX - swipeStartX;
  const containerWidth = slidesContainer.offsetWidth;
  const currentTranslate = -currentSlide * containerWidth + diff;
  slidesContainer.style.transform = `translateX(${currentTranslate}px)`;
}

// Обробник кінця свайпу
function swipeEndHandler(e) {
  if (!isDragging) return;
  isDragging = false;
  
  if (e.changedTouches) {
    swipeEndX = e.changedTouches[0].clientX;
  } else {
    swipeEndX = e.clientX;
  }
  
  slidesContainer.classList.remove('grabbing');
  
  const swipeDistance = swipeEndX - swipeStartX;
  
  // Якщо був свайп більше 100px, зупиняємо автоплей та перемикаємо слайд
  if (Math.abs(swipeDistance) > 100) {
    stopAutoPlay();
    handleSwipe();
  }
  
  slidesContainer.style.transition = 'transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)';
  slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Функція обробки свайпу
function handleSwipe() {
  const swipeDistance = swipeEndX - swipeStartX;
  
  if (swipeDistance > 100) {
    prevSlide();
  } else if (swipeDistance < -100) {
    nextSlide();
  }
}

// Функція ініціалізації
function init() {
  pauseBtn.addEventListener('click', pausePlayHandler);
  nextBtn.addEventListener('click', nextHandler);
  prevBtn.addEventListener('click', prevHandler);
  
  indicatorsContainer.addEventListener('click', indicatorClickHandler);
  
  document.addEventListener('keydown', keydownHandler);
  
  slidesContainer.addEventListener('mousedown', swipeStartHandler);
  slidesContainer.addEventListener('mousemove', swipeMoveHandler);
  slidesContainer.addEventListener('mouseup', swipeEndHandler);
  slidesContainer.addEventListener('mouseleave', swipeEndHandler);
  
  slidesContainer.addEventListener('touchstart', swipeStartHandler);
  slidesContainer.addEventListener('touchmove', swipeMoveHandler);
  slidesContainer.addEventListener('touchend', swipeEndHandler);
  
  startAutoPlay();
}

// Запуск ініціалізації при завантаженні DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}