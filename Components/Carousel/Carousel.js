import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this._slides = slides;
    this._arrows = null;
    this._carousel = null;

    this._currentSlide = 0;
    this._currentTranslateX = 0;

    this.render();
  }

  render = () => {
    this.elem = createRootCarousel({
      createArrowsButtons: createArrowsButtons(),
      createCarouselSlides: createCarouselSlides({ slides: this._slides }),
    });

    this._arrows = {
      leftArrow: this.elem.querySelector('.carousel__arrow_left'),
      rightArrow: this.elem.querySelector('.carousel__arrow_right'),
    };
    this._arrows.leftArrow.style.display = 'none';
    this._arrows.leftArrow.addEventListener('click', this._switchDirection(1));
    this._arrows.rightArrow.addEventListener(
      'click',
      this._switchDirection(-1)
    );

    this._carousel = this.elem.querySelector('.carousel__inner');

    const buttonsAdd = this.elem.querySelectorAll('.carousel__button');
    buttonsAdd.forEach((button) =>
      button.addEventListener('click', this._onButtonAddClick)
    );
  };

  _switchDirection = (direction) => () => {
    const widthSlide = this._carousel.offsetWidth;

    this._currentTranslateX += widthSlide * direction;
    this._carousel.style.transform = `translateX(${this._currentTranslateX}px)`;
    this._currentSlide -= direction;

    this._arrows.leftArrow.style.display = '';
    this._arrows.rightArrow.style.display = '';

    if (this._currentSlide === 0) this._arrows.leftArrow.style.display = 'none';
    if (this._currentSlide === this._carousel.children.length - 1)
      this._arrows.rightArrow.style.display = 'none';
  };

  _onButtonAddClick = (event) => {
    const slide = event.target.closest('.carousel__slide');
    if (!slide) return;

    this.elem.dispatchEvent(
      new CustomEvent('product-add', {
        detail: slide.dataset.id,
        bubbles: true,
      })
    );
  };
}

const createRootCarousel = ({ createArrowsButtons, createCarouselSlides }) =>
  createElement(
    `
    <div class="carousel">
      ${createArrowsButtons}
      <div class="carousel__inner">        
        ${createCarouselSlides}
        </div>
  </div> 
`
  );

const createArrowsButtons = () =>
  `
  <div class="carousel__arrow carousel__arrow_right">
    <img src="/assets/images/icons/angle-icon.svg" alt="icon">
  </div>
  <div class="carousel__arrow carousel__arrow_left">
    <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
  </div>
`;

const createCarouselSlides = ({ slides }) =>
  slides
    .map(
      (slide) =>
        `
    <div class="carousel__slide" data-id=${slide.id}>
      <img src="/assets/images/carousel/${
        slide.image
      }" class="carousel__img" alt="slide">
      <div class="carousel__caption">
        <span class="carousel__price">€${slide.price.toFixed(2)}</span>
        <div class="carousel__title">${slide.name}</div>
        <button type="button" class="carousel__button">
          <img src="/assets/images/icons/plus-icon.svg" alt="icon">
        </button>
      </div>
    </div>
  `
    )
    .join('');
