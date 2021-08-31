import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this._modalWindow = createRootModal();

    this._buttonClose = this._modalWindow.querySelector('.modal__close');
    this._buttonClose.addEventListener('click', this.close);
    document.addEventListener('keydown', this._onKeyDown);
  }

  open = () => {
    document.body.classList.add('is-modal-open');
    return document.body.append(this._modalWindow);
  };

  setTitle = (titleName) => {
    let title = this._modalWindow.querySelector('.modal__title');
    title.innerHTML = titleName;
  };

  setBody = (node) => {
    let body = this._modalWindow.querySelector('.modal__body');
    body.append(node);
  };

  close = () => {
    document.body.classList.remove('is-modal-open');
    this._modalWindow.remove();
  };

  _onKeyDown = (event) => {
    if (event.code !== 'Escape') return;
    this.close();
  };
}

const createRootModal = () =>
  createElement(`
  <div class="modal">
  <!--Прозрачная подложка перекрывающая интерфейс-->
    <div class="modal__overlay"></div>
    <div class="modal__inner">
      <div class="modal__header">
        <!--Кнопка закрытия модального окна-->
        <button type="button" class="modal__close">
          <img src="./assets/images/icons/cross-icon.svg" alt="close-icon" />
        </button>
        <h3 class="modal__title">       
        </h3>
      </div>
      <div class="modal__body">     
      </div>
    </div>
  </div>
`);
