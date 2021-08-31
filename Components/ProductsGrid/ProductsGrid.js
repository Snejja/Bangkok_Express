import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../ProductCard/ProductCard.js';

export default class ProductsGrid {
  constructor(products) {
    this.products = products;
    this._productsCards = getProductsCards({ products: this.products });

    this._filters = {};
    this._productsFiltered = [];
    this._rootProducts = null;

    this.render();
  }

  render = () => {
    this.elem = createProductGreed();
    this._rootProducts = this.elem.querySelector('.products-grid__inner');
    this._productsCards.map((card) => this._rootProducts.append(card.elem));
  };

  updateFilter = (filter) => {
    let defaultFilters = {
      noNuts: false,
      vegeterianOnly: false,
      maxSpiciness: 4,
      category: '',
    };
    this._filters = { ...defaultFilters, ...this._filters, ...filter };

    this._productsFiltered = this._productsCards;

    if (this._filters.noNuts === true) {
      this._productsFiltered = this._productsFiltered.filter(
        ({ product }) => product.nuts === false || product.nuts === undefined
      );
    }
    if (this._filters.vegeterianOnly === true) {
      this._productsFiltered = this._productsFiltered.filter(
        ({ product }) => product.vegeterian === true
      );
    }
    if (this._filters.category !== '') {
      this._productsFiltered = this._productsFiltered.filter(
        ({ product }) => product.category === this._filters.category
      );
    }
    if (this._filters.maxSpiciness <= 4) {
      this._productsFiltered = this._productsFiltered.filter(
        ({ product }) => product.spiciness <= this._filters.maxSpiciness
      );
    }

    this._rootProducts.innerHTML = '';
    this._productsFiltered.map((product) =>
      this._rootProducts.append(product.elem)
    );
  };
}

const getProductsCards = ({ products }) =>
  products.map((product) => new ProductCard(product));

const createProductGreed = () =>
  createElement(`
<div class="products-grid">
  <div class="products-grid__inner">       
  </div>
</div>
`);
