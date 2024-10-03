export default class Column {
  constructor(element, cards) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }
    this._element = element;
    if (cards) {
      this._cards = cards;
    } else {
      this._cards = [];
    }
    this._list = this._element.querySelector(".list");
    this._addBlock = this._element.querySelector(".add-block");
    this._link = this._element.querySelector(".link-block");
    this._form = this._element.querySelector(".form");

    this._list.addEventListener("click", (e) => {
      if (e.target.closest(".delete-svg")) {
        this.deleteCard(
          e.target
            .closest(".delete-svg")
            .previousElementSibling.textContent.replace(/\s+/g, " ")
            .trim(),
        );
        this.drawColumn();
      }
    });
    this._link.addEventListener("click", (e) => {
      e.preventDefault();
      this._addBlock.classList.remove("hidden");
      this._link.classList.add("hidden");
    });
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this._form.querySelector(".text").value) {
        this.addCard(this._form.querySelector(".text").value);
        this._form.reset();
        this._addBlock.classList.add("hidden");
        this._link.classList.remove("hidden");
      }
    });
    this._form.querySelector(".close-svg").addEventListener("click", () => {
      this._addBlock.classList.add("hidden");
      this._link.classList.remove("hidden");
    });
    this.drawColumn();
    let actualElement;

    const onMouseOver = (e) => {
      actualElement.style.top = e.clientY + "px";
      actualElement.style.left = e.clientX + "px";
    };
    const onMouseUp = (e) => {
      let mouseUpItem = e.target;
      if (mouseUpItem === document.documentElement) {
        mouseUpItem = document.body;
      }
      let list;
      if (e.target.classList.contains("column")) {
        list = e.target.querySelector(".list");
      } else if (document.body === e.target) {
        list = e.target.closest(".list");
      } else {
        list = e.target.closest(".column").querySelector(".list");
      }
      list.appendChild(actualElement);
      list.dispatchEvent(new Event("change"));
      actualElement.classList.remove("dragged");
      actualElement = undefined;

      document.documentElement.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseover", onMouseOver);
    };
    this._element.addEventListener("mousedown", (e) => {
      if (
        e.target.closest(".delete-svg") ||
        e.target.classList.contains("delete-svg")
      ) {
        this.deleteCard(
          e.target.closest(".card").textContent.replace(/\s+/g, " ").trim(),
        );
        this.drawColumn();
        this._list.dispatchEvent(new Event("change"));
      }
      if (e.target.closest(".list")) {
        e.preventDefault();
        if (e.target.closest(".card")) {
          this.deleteCard(
            e.target.closest(".card").textContent.replace(/\s+/g, " ").trim(),
          );
          actualElement = e.target.closest(".card");
          actualElement.classList.add("dragged");
          document.documentElement.addEventListener("mouseup", onMouseUp);
          document.documentElement.addEventListener("mouseover", onMouseOver);
        }
      }
    });
    this._list.addEventListener("change", () => {
      let cards = this._list.querySelectorAll(".card");
      let list = [];
      for (let card of cards) {
        list.push(card.textContent.replace(/\s+/g, " ").trim());
      }
      this._cards = list;
    });
  }
  drawCard(cardText) {
    let div = document.createElement("div");
    let text = document.createElement("div");
    text.classList.add("card-text");
    text.innerText = cardText;
    let svg = document.createElement("svg");
    svg.classList.add("delete-svg");
    div.appendChild(text);
    div.appendChild(svg);
    svg.outerHTML = `<svg class="delete-svg" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.11 2.697L2.698 4.11 6.586 8l-3.89 3.89 1.415 1.413L8 9.414l3.89 3.89 1.413-1.415L9.414 8l3.89-3.89-1.415-1.413L8 6.586l-3.89-3.89z"></path>
          </svg>`;
    div.classList.add("card");
    this._list.appendChild(div);
  }
  drawColumn() {
    this._list.innerHTML = "";
    for (let i = 0; i < this._cards.length; i++) {
      this.drawCard(this._cards[i]);
    }
  }
  addCard(title) {
    this._cards.push(title);
    this.drawColumn();
    this._list.dispatchEvent(new Event("change"));
  }
  deleteCard(title) {
    this._cards = this._cards.filter((t) => t !== title);
  }
}
