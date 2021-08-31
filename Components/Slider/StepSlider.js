import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.options = {
      steps,
      value,
    };
    this._thumbSlider = null;
    this.render();
  }

  render = () => {
    this.elem = createSlider({ options: this.options });
    this.elem.addEventListener('click', this._onChangeValueSliderClick);

    this._thumbSlider = this.elem.querySelector('.slider__thumb');
    this._thumbSlider.ondragstart = () => false;
    this._thumbSlider.onpointerdown = (event) => {
      event.preventDefault();
      document.addEventListener('pointermove', this._onMouseMove);
      document.addEventListener('pointerup', this._onMouseUp);
    };

    this._changeProgressPositionSlider();
  };

  _onChangeValueSliderClick = (event) => {
    if (event.target === this._thumbSlider) return;

    this.options.value = Math.round(this._getApproximateValueSlider(event));
    this._setActiveStepSlider();

    this._changeProgressPositionSlider();

    this.elem.dispatchEvent(
      new CustomEvent('slider-change', {
        detail: this.options.value,
        bubbles: true,
      })
    );
  };

  _setActiveStepSlider = () => {
    const sliderValueText = this.elem.querySelector('.slider__value');
    sliderValueText.textContent = this.options.value;

    const activeStep = this.elem.querySelector('.slider__step-active');
    activeStep.classList.remove('slider__step-active');

    const sliderSteps = this.elem.querySelector('.slider__steps');
    sliderSteps.childNodes[this.options.value + 1].classList.add(
      'slider__step-active'
    );
  };

  _getApproximateValueSlider = (event) => {
    //получила расстояние в пикселях от начала слайдера до места клика
    let left = event.clientX - this.elem.getBoundingClientRect().left;
    // относительное значение, взяв за основу ширину слайдера
    let leftRelative = left / this.elem.offsetWidth;

    if (leftRelative < 0) leftRelative = 0;
    if (leftRelative > 1) leftRelative = 1;

    const segments = this.options.steps - 1;
    return leftRelative * segments;
  };

  _changeProgressPositionSlider = () => {
    const progressSlider = this.elem.querySelector('.slider__progress');
    const segments = this.options.steps - 1;

    const valuePercents = (this.options.value / segments) * 100;

    if (!progressSlider || !this._thumbSlider) return;

    this._thumbSlider.style.left = `${valuePercents}%`;
    progressSlider.style.width = `${valuePercents}%`;
  };

  _onMouseMove = (event) => {
    this.elem.classList.add('slider_dragging');

    let nearestValue = this._getApproximateValueSlider(event);
    this.options.value = Math.round(nearestValue);

    this._setActiveStepSlider();
    this._changeProgressPositionSlider();
  };

  _onMouseUp = () => {
    document.removeEventListener('pointermove', this._onMouseMove);
    document.removeEventListener('pointerup', this._onMouseUp);

    const nearestValuePercent =
      (this.options.value / (this.options.steps - 1)) * 100;
    this._changeProgressPositionSlider(nearestValuePercent);

    this.elem.classList.remove('slider_dragging');

    this.elem.dispatchEvent(
      new CustomEvent('slider-change', {
        detail: this.options.value,
        bubbles: true,
      })
    );
  };
}

const createSlider = ({ options }) =>
  createElement(`
  <div class="slider">
    <div class="slider__thumb">
      <span class="slider__value">${options.value}</span>
    </div>
    <div class="slider__progress"></div>
    <div class="slider__steps">
      ${createStepsSlider({ options })}
    </div>
  </div>
  `);

const createStepsSlider = ({ options }) => {
  let steps = ``;

  for (let i = 0; i < options.steps; i++) {
    steps +=
      i !== options.value
        ? `<span></span>`
        : `<span class="slider__step-active"></span>`;
  }

  return steps;
};
