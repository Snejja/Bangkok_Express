import Carousel from './Components/Carousel/Carousel.js';
import slides from './Components/Slides.js';

import RibbonMenu from './Components/RibbonMenu/RibbonMenu.js';
import categories from './Components/Categories.js';

import StepSlider from './Components/Slider/StepSlider.js';
import ProductsGrid from './Components/ProductsGrid/ProductsGrid.js';

import CartIcon from './Components/CartIcon/CartIcon.js';
import Cart from './Components/Cart/Cart.js';

export default class Main {
  constructor() {
    this._productsGrid = null;

    this.carousel = new Carousel(slides);
    this.ribbonMenu = new RibbonMenu(categories);
    this.stepSlider = new StepSlider({ steps: 5, value: 3 });
    this.cartIcon = new CartIcon();
    this.cart = new Cart(this.cartIcon);
  }

  async render() {
    document.querySelector(`[data-carousel-holder]`).append(this.carousel.elem);
    document.querySelector(`[data-ribbon-holder]`).append(this.ribbonMenu.elem);
    document.querySelector(`[data-slider-holder]`).append(this.stepSlider.elem);
    document
      .querySelector(`[data-cart-icon-holder]`)
      .append(this.cartIcon.elem);

    this._renderProduct();
    this._addEvents();
  }

  _renderProduct = () => {
    fetch('./products.json')
      .then((response) => response.json())
      .then((json) => {
        this._productsGrid = new ProductsGrid(json);
        const root = document.querySelector(`[data-products-grid-holder]`);
        root.innerHTML = '';
        root.append(this._productsGrid.elem);
        this._setBaseFilters();
      });
  };

  _addEvents = () => {
    document.body.addEventListener('product-add', (event) => {
      this.cart.addProduct(
        this._productsGrid.products.find(({ id }) => id === event.detail)
      );
    });

    this.stepSlider.elem.addEventListener('slider-change', (event) => {
      this._productsGrid.updateFilter({ maxSpiciness: event.detail });
    });

    this.ribbonMenu.elem.addEventListener('ribbon-select', (event) => {
      this._productsGrid.updateFilter({ category: event.detail });
    });

    const nutsCheckbox = document.getElementById('nuts-checkbox');
    nutsCheckbox.addEventListener('change', () => {
      this._productsGrid.updateFilter({ noNuts: nutsCheckbox.checked });
    });

    const vegeterianCheckbox = document.getElementById('vegeterian-checkbox');
    vegeterianCheckbox.addEventListener('change', () => {
      this._productsGrid.updateFilter({
        vegeterianOnly: vegeterianCheckbox.checked,
      });
    });
  };

  _setBaseFilters = () => {
    this._productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.stepSlider.options.value,
      category: this.ribbonMenu.value,
    });
  };
}
