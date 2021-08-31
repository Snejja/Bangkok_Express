import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../Modal/Modal.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this._modalWindow = null;
    this._modalBody = null;

    this.addEventListeners();
  }

  addProduct(product) {
    if (product === undefined || product === null) return;

    const cartItem = this.cartItems.find(
      (cart) => cart.product.id === product.id
    );

    if (!cartItem) {
      this.cartItems.push({ product: product, count: 1 });
    } else {
      this.cartItems.find((cart) => cart.product.id === cartItem.product.id)
        .count++;
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    const indexCartItem = this.cartItems.findIndex(
      ({ product }) => product.id === productId
    );
    this.cartItems[indexCartItem].count += amount;

    if (this.cartItems[indexCartItem].count === 0) {
      this.cartItems.splice(indexCartItem, 1);
      document.querySelector(`[data-product-id="${productId}"]`).remove();
    }
    this.onProductUpdate(this.cartItems[indexCartItem]);
  }

  isEmpty = () => this.cartItems.length === 0;

  getTotalCount = () => this.cartItems.reduce((sum, acc) => sum + acc.count, 0);

  getTotalPrice = () =>
    this.cartItems.reduce((sum, acc) => sum + acc.count * acc.product.price, 0);

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(count * product.price).toFixed(
            2
          )}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    let root = createElement(`<div></div>`);
    this.cartItems.forEach((el) => {
      root.append(this.renderProduct(el.product, el.count));
    });
    root.append(this.renderOrderForm());

    this._modalWindow = new Modal();
    this._modalWindow.setTitle('Your order');
    this._modalWindow.setBody(root);
    this._modalWindow.open();

    this._modalBody = document.querySelector('.modal__body');
    this._addEventButtons(root);

    const submitForm = root.querySelector('.cart-form');
    submitForm.addEventListener('submit', this.onSubmit);
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    if (!document.body.classList.contains('is-modal-open')) return;
    if (this.isEmpty()) return this._modalWindow.close();

    let infoPrice = this._modalBody.querySelector(`.cart-buttons__info-price`);
    infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

    if (!cartItem) {
      return;
    }

    const productId = cartItem.product.id;
    const productCount = this._modalBody.querySelector(
      `[data-product-id="${productId}"] .cart-counter__count`
    );
    const productPrice = this._modalBody.querySelector(
      `[data-product-id="${productId}"] .cart-product__price`
    );

    productCount.innerHTML = cartItem.count;
    productPrice.innerHTML = `€${(
      cartItem.count * cartItem.product.price
    ).toFixed(2)}`;
  }

  onSubmit = (event) => {
    event.preventDefault();

    let buttonSubmit = document.querySelector('[type="submit"]');
    buttonSubmit.classList.add('is-loading');

    let formElem = new FormData(document.querySelector('.cart-form'));

    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: formElem,
    }).then(() => {
      this._modalWindow.setTitle('Success!');
      this.cartItems = [];
      this._modalBody.innerHTML = `
        <div class="modal__body-inner">
          <p>
            Order successful! Your order is being cooked :) <br>
            We’ll notify you about delivery time shortly.<br>
            <img src="/assets/images/delivery.gif">
          </p>
        </div>
      `;
    });
  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }

  _addEventButtons = (root) => {
    const minusButtons = root.querySelectorAll('.cart-counter__button_minus');
    minusButtons.forEach((button) =>
      button.addEventListener('click', this._onChangeCountClick(-1))
    );
    const plusButtons = root.querySelectorAll('.cart-counter__button_plus');
    plusButtons.forEach((button) =>
      button.addEventListener('click', this._onChangeCountClick(1))
    );
  };

  _addEventSubmit = () => {};

  _onChangeCountClick = (current) => (event) => {
    const product = event.target.closest('[data-product-id]');
    this.updateProductCount(product.dataset.productId, current);
  };
}
