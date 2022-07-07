import { Router } from "@vaadin/router";
import { state } from "../../state";
const vector = require("url:../../media/Vector.png");

customElements.define(
  "home-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }

    addListeners() {
      const buttonEl: any = this.querySelector(".main__boton-ubicacion");
      const containerEl: any = this.querySelector(".main__dogs-container");
      const locatorEl: any = this.querySelector(".main__locator");

      buttonEl.addEventListener("click", (e) => {
        e.preventDefault();
        locatorEl.style.display = "none";
        window.navigator.geolocation.getCurrentPosition((position: any) => {
          fetch(
            `${process.env.API_BASE_URL}/mascotas-cerca-de?lat=${position.coords.latitude}&lng=${position.coords.longitude}`,
            { method: "get", headers: { "Content-Type": "application/json" } }
          )
            .then((res) => {
              return res.json();
            })
            .then((resData) => {
              resData.forEach((ev: any) => {
                const div = document.createElement("div");
                div.innerHTML = `<lost-pet-card class="main__dog-card" location="${ev._geoloc.lat}" name="${ev.name}" pet-id="${ev.objectID}"><lost-pet-card>`;
                containerEl.appendChild(div);
              });
            })
            .catch((err) => {
              console.log(err.message);
            });
        });
      });

      const mainEl: any = this.querySelector(".main");

      mainEl.addEventListener("report", (e) => {
        e.preventDefault();
        e.stopPropagation();

        mainEl.style.display = "none";

        const { petId, name } = e.detail;
        const formCustomEl = document.createElement("form-comp");
        formCustomEl.setAttribute("id", `${petId}`);
        formCustomEl.setAttribute("name", `${name}`);

        this.appendChild(formCustomEl);
      });
    }
    render() {
      this.innerHTML = `
      <nav-comp></nav-comp>
      <main class="main">
        <h1 class="main__title">Mascotas perdidas cerca tuyo</h1>
        <div class="main__locator">
          <h4 class="main__notice">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</h4>
          <button class="main__boton-ubicacion"><h5>Dar mi ubicacion</h5></button>
        </div>
        <div class="main__dogs-container">
        </div>
      </main> 
      `;

      this.className = "home__page";
    }
  }
);
