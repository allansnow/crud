const openModal1 = () => {
  document.querySelector('.modal').classList.add('modal-active');
  document.querySelector('.overlay').classList.add('overlay-active');
}

const closeModal1 = () => {
  document.querySelector('.modal').classList.remove('modal-active');
  document.querySelector('.overlay').classList.remove('overlay-active');
  clearFields();
}

const openExcluirModal = (index) => {
   const allClient = readClient();
   const client = allClient[index]
   document.querySelector('.modal-excluir').classList.add('modal-excluir-active');
   document.querySelector('.overlay').classList.add('overlay-active');
   document.querySelector('.modal-excluir-p').innerText =
   `Deseja realmente excluir o cliente ${client.nome} ?`;
}


const closeExcluirModal = (index) => {
  document.querySelector('.modal-excluir').classList.remove('modal-excluir-active');
  document.querySelector('.overlay').classList.remove('overlay-active');
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_Client')) ?? [];
const setLocalStorage = (dbClient) => localStorage.setItem('db_Client', JSON.stringify(dbClient));

// CRUD - create, read, update, delete

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient);
}

const readClient = () => getLocalStorage();

const updateClient = (index, client) => {
   const dbClient = readClient()
   dbClient[index] = client;
   setLocalStorage(dbClient)
}

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
}

// interação com o layout

const clearFields = () => document.querySelectorAll('input').forEach((input) => {
    input.value = '';
  });

const isValidFields = () => {
    return document.querySelector('.form').reportValidity();
}

const saveClient = () => {

  if (isValidFields()) {
    const client = {
    nome: document.querySelector('#nome').value,
    email: document.querySelector('#email').value,
    celular: document.querySelector('#celular').value,
    cidade: document.querySelector('#cidade').value
  }

   let index = document.querySelector('#nome').dataset.index;
   if (index == 'new') {
    createClient(client);
    closeModal1();
    updateTable();
    console.log(index);
   }
   
   else {
   document.querySelector('#nome').dataset.index = 'new';
   updateClient(index, client);
   updateTable();
   closeModal1();
   }
  }
}

const createRow = (client, index) => {
const newRow = document.createElement('tr');
newRow.innerHTML = `
   <td>${client.nome}</td>
   <td>${client.email}</td>
   <td>${client.celular}</td>
   <td>${client.cidade}</td>
   <td class="td-buttons">
     <button type="button" class="editar-button" id="edit-${index}">Editar</button>
     <button type="button" class="excluir-button" id="delete-${index}">Excluir</button>
   </td>
`
newRow.classList.add('new-row');
document.querySelector('.tbody').appendChild(newRow);
}

const fillFields = (client) => {
  document.querySelector('#nome').value = client.nome
  document.querySelector('#email').value = client.email
  document.querySelector('#celular').value = client.celular
  document.querySelector('#cidade').value = client.cidade;
  document.querySelector('#nome').dataset.index = client.index;
}

const editClient = (index) => {
  const dbClient = readClient();
  const client = dbClient[index];
  client.index = index;
  fillFields(client);
  openModal1();
}

const editDeleteClient = (event) => {
  const [action, index] = event.target.id.split('-');
  
  if(action == 'edit') {
  editClient(index);
  }

  else if (action == 'delete') {
  deleteClient(index);
  updateTable();
  }
}

const clearTable = () => {
   const rows = document.querySelectorAll('.tbody tr')
   rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
  const dbClient = readClient();
  clearTable();
  dbClient.forEach(createRow);
}
updateTable();

// EVENT LISTENERS 

document.querySelector('.cadastrar-button')
.addEventListener('click', openModal1);

document.querySelectorAll('.cancelar-button').forEach((button) => {
button.addEventListener('click', closeModal1);
})

document.querySelectorAll('.cancelar-button2').forEach((button) => {
button.addEventListener('click', closeExcluirModal)
})

document.querySelector('.salvar-button')
.addEventListener('click', saveClient)

document.querySelector('.tbody')
.addEventListener('click', editDeleteClient)
