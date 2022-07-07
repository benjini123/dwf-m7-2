const puppyImage = require("url:../../media/image 3.png");
const penImage = require("url:../../media/pen.png");

export function initCardComp() {
  customElements.define(
    "lost-pet-card",
    class extends HTMLElement {
      petId: any;
      name: any;
      location: any;
      constructor() {
        super();
        this.petId = this.getAttribute("pet-id");
        this.name = this.getAttribute("name");
        this.location = this.getAttribute("location");
      }
      connectedCallback() {
        this.render();
      }
      listeners() {}
      render() {
        this.innerHTML = `
                
        <img class="main__dog-image" src="${puppyImage}"/>
        <div class="main__dog-card-text">
          <h1 class="main__dog-name">${this.name}</h2>
          <h6 class="main__dog-location">${this.location}</h6>
          <a href="" class="main__report-info">reportar informacion</a>
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
          console.log("true");
        }

        reportLinkEl.addEventListener("click", (e) => {
          e.preventDefault();
          this.dispatchEvent(
            new CustomEvent("report", {
              detail: {
                petId: this.petId,
                name: this.name,
              },
              bubbles: true,
              composed: true,
              // esto hace que el evento pueda
              // ser escuchado desde un elemento
              // que está más "arriba" en el arbol
            })
          );
        });

        this.listeners();
      }
    }
  );
}
