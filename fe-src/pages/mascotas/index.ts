import { state } from "../../state";

customElements.define(
  "mascotas-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }

    render() {
      this.innerHTML = `

      <nav-comp></nav-comp>
      <section id="mascotas-section">
      </section>
      <h6 style="display:none" id="no-reportadas">Aun no reportaste mascotas perdidas</h6>
      
    `;

      this.className = "pet__container";

      const mascotasCont = document.getElementById("mascotas-section") as any;

      state.appendPets().then((res: any) => {
        if (res.length >= 1) {
          res.forEach((pet) => {
            const div = document.createElement("div");
            div.innerHTML = `<lost-pet-card class=" main__dog-card" location="${pet.location}" name="${pet.name}" pet-id="${pet.id}" src="${pet.url}" edit><lost-pet-card>`;
            div.className = "card-container";
            mascotasCont.appendChild(div);
          });
        } else {
          const h6 = this.querySelector("#no-reportadas") as any;
          h6.style.display = "initial";
        }
      });
    }
  }
);
