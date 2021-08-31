import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this._categories = categories;
    this._arrows = null;
    this._ribbonInner = null;
    this.value = '';

    this.render();
  }

  render = () => {
    this.elem = createRibbonMenu({
      createCategories: createCategories({ categories: this._categories }),
    });

    this._arrows = {
      leftArrow: this.elem.querySelector('.ribbon__arrow_left'),
      rightArrow: this.elem.querySelector('.ribbon__arrow_right'),
    };
    this._arrows.leftArrow.addEventListener('click', this._onScrollBy(-1));
    this._arrows.rightArrow.addEventListener('click', this._onScrollBy(1));

    this._ribbonInner = this.elem.querySelector('.ribbon__inner');
    this._ribbonInner.addEventListener('scroll', this._scrollInner);

    const ribbonItems = this.elem.querySelectorAll('.ribbon__item');
    ribbonItems.forEach((item) =>
      item.addEventListener('click', this._onActiveCategory)
    );
  };

  _onScrollBy = (direction) => () => {
    let scroll = 350 * direction;

    this._arrows.leftArrow.classList.add('ribbon__arrow_visible');
    this._arrows.rightArrow.classList.add('ribbon__arrow_visible');

    if (!this._ribbonInner) return;

    this._ribbonInner.scrollBy(scroll, 0);
  };

  _scrollInner = () => {
    const scrollLeft = this._ribbonInner.scrollLeft;
    const scrollRight =
      this._ribbonInner.scrollWidth -
      this._ribbonInner.scrollLeft -
      this._ribbonInner.clientWidth;

    if (scrollLeft === 0) {
      this._arrows.leftArrow.classList.remove('ribbon__arrow_visible');
    } else if (scrollRight < 1) {
      this._arrows.rightArrow.classList.remove('ribbon__arrow_visible');
    }
  };

  _onActiveCategory = (event) => {
    event.preventDefault();

    const activeItem = this._ribbonInner.querySelector('.ribbon__item_active');
    if (activeItem) activeItem.classList.remove('ribbon__item_active');

    event.target.classList.add('ribbon__item_active');

    this.value = event.target.dataset.id;

    this.elem.dispatchEvent(
      new CustomEvent('ribbon-select', {
        detail: event.target.dataset.id,
        bubbles: true,
      })
    );
  };
}

const createRibbonMenu = ({ createCategories }) =>
  createElement(`
  <div class="ribbon">
    <button class="ribbon__arrow ribbon__arrow_left">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>
    ${createCategories}
    <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>
  </div>
`);

const createCategories = ({ categories }) => `
  <nav class="ribbon__inner">
    ${categories
      .map(
        (category) => `
        <a
          href='#'
          class='ribbon__item'
          data-id=${category.id}
        >
        ${category.name}
        </a>`
      )
      .join('')}
  </nav>
`;
