import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "mascotas-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {}
    render() {
      this.innerHTML = `
      <nav-comp></nav-comp>
      <section id="mascotas-section">
        <h6 id="no-reportadas">Aun no reportaste mascotas perdidas</h6>
      </section>
      
    `;

      this.className = "password__container";

      const mascotasCont = document.getElementById("mascotas-section") as any;

      const cs = state.getState();

      if (cs.reportadas) {
        const h6El = document.getElementById("no-reportadas") as any;
        h6El.style.display = "none";
        cs.reportadas.forEach((pet) => {
          const div = document.createElement("div");
          div.innerHTML = `<lost-pet-card class="main__dog-card" location="${pet.latitud}" name="${pet.nombre}" pet-id="${pet.id}" edit><lost-pet-card>`;
          mascotasCont.appendChild(div);
        });
      }
    }
  }
);
