const vector = require("url:../../media/Vector.png");

export function initFormComp() {
  customElements.define(
    "form-comp",
    class extends HTMLElement {
      petId: any;
      name: any;
      constructor() {
        super();
      }
      connectedCallback() {
        this.petId = this.getAttribute("petId");
        this.name = this.getAttribute("name");
        this.render();
      }

      listeners() {
        const formEl = this.querySelector(".main__form") as any;
        const crossEl = this.querySelector(".main__form-cross") as any;
        const mainEl = document.querySelector(".main") as any;

        formEl.addEventListener("submit", (e: any) => {
          e.preventDefault();
          e.stopPropagation();
          const name = e.target.name.value;
          const phone = e.target.phone.value;
          const info = e.target.info.value;
          const id = this.petId;

          fetch(`/report/:${id}`, {
            method: "post",
            body: JSON.stringify(name, phone, info),
          })
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              console.log(data);
            });
        });

        crossEl.addEventListener("click", (e: any) => {
          e.preventDefault();
          e.stopPropagation();
          mainEl.style.display = "";
          this.remove();
        });
      }

      render() {
        this.innerHTML = `
        <form class="main__form">
          <img class="main__form-cross" src="${vector}">
          <h1>Reportar info de ${this.name}</h1>
          <label for="name"><h4>nombre:</h4></label>
          <input id="name" type="text" />
          <label for="phone"><h4>telefono:</h4></label>
          <input id="phone" type="phone" />
          <label for="info"><h4>donde lo viste?</h4></label>
          <textarea id="info"></textarea>
          <button type="submit" class="submit-button">Sumbit</button>
        </form>
        `;

        this.listeners();
      }
    }
  );
}
