import { Router } from "@vaadin/router";
import { state } from "../../state";

const puppyImage = require("url:../../media/image 3.png");
const penImage = require("url:../../media/pen.png");

export function initCardComp() {
  customElements.define(
    "lost-pet-card",
    class extends HTMLElement {
      petId: any;
      name: any;
      location: any;
      src: any;
      userId: any;
      constructor() {
        super();

        this.petId = this.getAttribute("pet-id");
        this.name = this.getAttribute("name");
        this.location = this.getAttribute("location");
        this.src = this.getAttribute("src");
        this.userId = this.getAttribute("user-id");
      }
      connectedCallback() {
        this.render();
      }
      render() {
        this.innerHTML = `
                
        <img class="card__pet-image" src="${this.src}"/>
        <div class="main__dog-card-text">
          <h1 class="main__dog-name">${this.name}</h2>
          <h6 class="main__dog-location">${this.location}</h6>
          <a class="main__report-info">reportar informacion</a>
          <img style="display:none" src="${penImage}" class="edit-mode-pen"/>
        </div>
        `;

        this.className = "main__dog-card";

        const penEl = this.querySelector(".edit-mode-pen") as any;
        const reportLinkEl = this.querySelector(".main__report-info") as any;
        const editMode = this.hasAttribute("edit") as boolean;

        if (editMode) {
          penEl.style.display = "initial";
          reportLinkEl.style.display = "none";
          this.style.position = "initial";

          const cs = state.getState();
          cs.mode = "edit";
          state.setState(cs);
        }

        penEl.addEventListener("click", (e: any) => {
          e.preventDefault();

          const cs = state.getState();

          cs.pet = {
            id: this.petId,
            name: this.name,
            location: this.location,
            src: this.src,
          };

          state.setState(cs);

          Router.go("reportar");
        });

        document.addEventListener("close", (e: any) => {
          this.classList.toggle("close");
        });

        reportLinkEl.addEventListener("click", (e: any) => {
          e.preventDefault();

          this.classList.add("close");

          const cs = state.getState();

          cs.pet = {
            id: this.petId,
            name: this.name,
            location: this.location,
            userId: this.userId,
          };

          state.setState(cs);

          this.dispatchEvent(
            new CustomEvent("report", {
              bubbles: true,
              composed: true,
            })
          );
        });
      }
    }
  );
}
