import createRequests from './createRequests';

export default class Rendering {
  constructor() {
    this.container = null;
    this.tickets = null;
    this.addBtn = null;
    this.modal = null;
    this.modalDelete = null;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) throw new Error('Container is not HTMLElement');
    this.container = container;
    this.tickets = [];
    this.checkboxes = [];
  }

  checkBinding() {
    if (this.container === null) throw new Error('Board not bind to DOM');
  }

  draw() {
    this.checkBinding();

    const btnCreate = document.createElement('button');
    btnCreate.classList.add('button-new-ticket');
    btnCreate.type = 'button';
    btnCreate.textContent = '+ Add new ticket';
    this.container.appendChild(btnCreate);
    this.addBtn = btnCreate;

    const divTickets = document.createElement('div');
    divTickets.classList.add('tickets-container');
    this.container.appendChild(divTickets);
    this.tickets = divTickets;

    createRequests({ method: 'GET', query: { method: 'allTickets' } }).then((data) => {
      this.addTicket(divTickets, data);
    });

    this.createModal();
    this.createMDelete();
  }

  addTicket(elementParent, data) {
    for (let i = 0; i < data.length; i += 1) {
      const divTicket = document.createElement('div');
      divTicket.classList.add('ticket');
      divTicket.dataset.id = `${data[i].id}`;
      elementParent.appendChild(divTicket);

      const divCheckbox = document.createElement('div');
      divCheckbox.classList.add('check-container');
      divTicket.appendChild(divCheckbox);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.disabled = true;
      if (data[i].status) checkbox.checked = true;
      checkbox.dataset.id = `${data[i].id}`;
      divCheckbox.appendChild(checkbox);
      this.checkboxes.push(checkbox);

      const title = document.createElement('span');
      title.classList.add('title');
      title.textContent = `${data[i].name}`;
      divTicket.appendChild(title);

      const divDate = document.createElement('div');
      divDate.classList.add('date-container');

      const date = new Date(data[i].created * 1000);
      let year = date.getFullYear();
      year = String(year).slice(2);
      let month = date.getMonth() + 1;
      if (month < 10) month = `0${month}`;
      let day = date.getDay();
      if (day < 10) day = `0${day}`;
      let hours = date.getHours();
      if (hours < 10) hours = `0${hours}`;
      let minutes = date.getMinutes();
      if (minutes < 10) minutes = `0${minutes}`;

      divDate.textContent = `${day}.${month}.${year} ${hours}:${minutes}`;
      divTicket.appendChild(divDate);

      const divBtns = document.createElement('div');
      divBtns.classList.add('btns-container');
      divTicket.appendChild(divBtns);

      const btnEdit = document.createElement('button');
      btnEdit.classList.add('btn-edit', 'btn-ticket');
      btnEdit.textContent = '✎';
      btnEdit.type = 'button';
      divBtns.appendChild(btnEdit);

      const btnDel = document.createElement('button');
      btnDel.classList.add('btn-del', 'btn-ticket');
      btnDel.textContent = 'x';
      btnDel.type = 'button';
      divBtns.appendChild(btnDel);
    }
  }

  createModal() {
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container', 'hidden');
    this.container.appendChild(modalContainer);

    const content = `
        <div class='modal-title'>Наименование</div>
        <div class='input-container'>
          <label>Краткое описание:</label>
          <input class='input-short' type='text'>
        </div>
        <div class='input-container'>
          <label>Подробное описание:</label>
          <textarea class='input-long' type='text'></textarea>
        </div>
        <div class='modal-btn'>
          <button class='close m-btn' type='button'>Отмена</button>
          <button class='ok m-btn' type='button'>Ок</button>
        </div>
    `;

    modalContainer.innerHTML = content;

    this.modal = modalContainer;
  }

  createMDelete() {
    const deleteContainer = document.createElement('div');
    deleteContainer.classList.add('modal-container', 'hidden');
    this.container.appendChild(deleteContainer);

    const content = `
        <div class='modal-title'>Удалить тикет</div>
        <div class='text-container'>
          Вы уверены, что хотите удалить тикет? Это действие необратимо.
        </div>
        <div class='modal-btn'>
          <button class='close m-btn delete' type='button'>Отмена</button>
          <button class='ok m-btn delete' type='button'>Ок</button>
        </div>
    `;

    deleteContainer.innerHTML = content;

    this.modalDelete = deleteContainer;
  }
}
