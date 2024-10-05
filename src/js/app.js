document.addEventListener("DOMContentLoaded", () => {
  console.log("app worked");

  let addBtn = document.querySelector(".add-ticket");
  let ticketList = document.querySelector(".ticket-list");
  let addModal = document.querySelector(".add-modal");
  let changeModal = document.querySelector(".change-modal");
  let deleteModal = document.querySelector(".delete-modal");
  drawTickets(ticketList);
  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addModal.classList.remove("hidden");
  });
  ticketList.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.closest(".delete")) {
      deleteModal.classList.remove("hidden");
      deleteModal.dataset.id = e.target.closest(".ticket").dataset.id;
    }
    if (e.target.closest(".edit")) {
      changeModal.classList.remove("hidden");
      changeModal.dataset.id = e.target.closest(".ticket").dataset.id;
    }
    if(e.target === e.target.closest(".ticket").querySelector(".checkbox")){
      e.preventDefault();
      let data;
      debugger
      if(e.target.checked === true){
        data = {
        status: true, 
      }
      }
      else{
        data = {
          status: false, 
        }
      }
      let xhr = sendRequest("changeTicket", e.target.closest(".ticket").dataset.id, JSON.stringify(data));
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            drawTickets(ticketList);
          } catch (e) {
            console.error(e);
          }
        }
      });
      return;
    }
    if (e.target.closest(".ticket")) {
      if (
        e.target.closest(".ticket").querySelector(".description").textContent
      ) {
        e.target.closest(".ticket").querySelector(".description").textContent =
          "";
        return;
      }
      let id = e.target.closest(".ticket").dataset.id;
      let xhr = sendRequest("ticketById", id);
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            let description = e.target
              .closest(".ticket")
              .querySelector(".description");
            description.textContent = JSON.parse(xhr.response).description;
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
    return;
  });
  addModal.addEventListener("click", (e) => {
    e.preventDefault();
    let form = document.getElementById("add-form");
    if (e.target.closest(".close-btn")) {
      addModal.classList.add("hidden");
      return;
    }
    if (e.target.closest(".ok-btn")) {
      let formData = new FormData(form);
      form.reset();
      addModal.classList.add("hidden");
      let xhr = sendRequest("createTicket", id=null, formData);
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            drawTickets(ticketList);
          } catch (e) {
            console.error(e);
          }
        }
      });
      return;
    }
  });
  changeModal.addEventListener("click", (e) => {
    e.preventDefault();
    let form = document.getElementById("change-form");
    if (e.target.closest(".close-btn")) {
      changeModal.classList.add("hidden");
      return;
    }
    if (e.target.closest(".ok-btn")) {
      let formData = new FormData(form);
      form.reset();
      changeModal.classList.add("hidden");
      let xhr = sendRequest("changeTicket", changeModal.dataset.id, formData);
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            drawTickets(ticketList);
          } catch (e) {
            console.error(e);
          }
        }
      });
      return;
    }
  });
  deleteModal.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.closest(".close-btn")) {
      addModal.classList.add("hidden");
      return;
    }
    if (e.target.closest(".ok-btn")) {
      deleteModal.classList.add("hidden");
      let xhr = sendRequest("deleteById", deleteModal.dataset.id);
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            drawTickets(ticketList);
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  });
});

function drawTickets(ticketList) {
  ticketList.innerHTML = "";
  let xhr = sendRequest("allTickets");
  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        console.log(xhr.response);
        const data = JSON.parse(xhr.response);
        for (let ticket of data) {
          drawTicket(ticketList, ticket);
        }
      } catch (e) {
        console.error(e);
      }
    }
  });
}
function drawTicket(ticketList, ticket) {
  if(ticket.status){
    ticketList.insertAdjacentHTML(
      "beforeEnd",
      `<div class="ticket" data-id=${ticket.id}>
          <div class="header">
            <input class="checkbox" type="checkbox" name="done" id="checkbox" checked>
          <div class="name">${ticket.name}</div>
          <div class="date">${ticket.date}</div>
          <div class="ticket-btns">
            <svg class="edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
              <path d="M 23.90625 3.96875 C 22.859286 3.96875 21.813178 4.3743215 21 5.1875 L 5.40625 20.78125 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 11.21875 26.59375 L 26.8125 11 C 28.438857 9.373643 28.438857 6.813857 26.8125 5.1875 C 25.999322 4.3743215 24.953214 3.96875 23.90625 3.96875 z M 23.90625 5.875 C 24.409286 5.875 24.919428 6.1069285 25.40625 6.59375 C 26.379893 7.567393 26.379893 8.620107 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.893072 6.1069285 23.403214 5.875 23.90625 5.875 z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.533142 22.500659 9.4993415 21.466858 8.21875 20.8125 L 20.3125 8.71875 z M 6.9375 22.4375 C 8.1365842 22.923393 9.0766067 23.863416 9.5625 25.0625 L 6.28125 25.71875 L 6.9375 22.4375 z"/>
            </svg>
            <svg class="delete"xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16">
              <path d="M4.11 2.697L2.698 4.11 6.586 8l-3.89 3.89 1.415 1.413L8 9.414l3.89 3.89 1.413-1.415L9.414 8l3.89-3.89-1.415-1.413L8 6.586l-3.89-3.89z"/>
          </svg>
          </div>
          </div>
          <div class="description">
          </div>
        </div>`,
    );
    return;
  }
  ticketList.insertAdjacentHTML(
    "beforeEnd",
    `<div class="ticket" data-id=${ticket.id}>
        <div class="header">
          <input class="checkbox" type="checkbox" name="done" id="checkbox">
        <div class="name">${ticket.name}</div>
        <div class="date">${ticket.date}</div>
        <div class="ticket-btns">
          <svg class="edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path d="M 23.90625 3.96875 C 22.859286 3.96875 21.813178 4.3743215 21 5.1875 L 5.40625 20.78125 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 11.21875 26.59375 L 26.8125 11 C 28.438857 9.373643 28.438857 6.813857 26.8125 5.1875 C 25.999322 4.3743215 24.953214 3.96875 23.90625 3.96875 z M 23.90625 5.875 C 24.409286 5.875 24.919428 6.1069285 25.40625 6.59375 C 26.379893 7.567393 26.379893 8.620107 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.893072 6.1069285 23.403214 5.875 23.90625 5.875 z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.533142 22.500659 9.4993415 21.466858 8.21875 20.8125 L 20.3125 8.71875 z M 6.9375 22.4375 C 8.1365842 22.923393 9.0766067 23.863416 9.5625 25.0625 L 6.28125 25.71875 L 6.9375 22.4375 z"/>
          </svg>
          <svg class="delete"xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16">
            <path d="M4.11 2.697L2.698 4.11 6.586 8l-3.89 3.89 1.415 1.413L8 9.414l3.89 3.89 1.413-1.415L9.414 8l3.89-3.89-1.415-1.413L8 6.586l-3.89-3.89z"/>
        </svg>
        </div>
        </div>
        <div class="description">
        </div>
      </div>`,
  );
  return;
}
function sendRequest(method, id, data){
  let url = "http://localhost:1001";
  let requestMethod;
  let requestUrl;
  if(["createTicket", "changeTicket"].includes(method)){
    requestMethod="POST";
  }
  else{
    requestMethod = "GET";
  }
  if(id){
    requestUrl = `${url}?method=${method}&id=${id}`
  }
  else{
    requestUrl = `${url}?method=${method}`
  }
  let xhr = new XMLHttpRequest();
  xhr.open(requestMethod, requestUrl);
  if(requestMethod === "GET"){
    xhr.send();
    return xhr;
  }
  xhr.send(data);
  return xhr;
}
