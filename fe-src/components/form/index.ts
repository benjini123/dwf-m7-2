import { state } from "../../state";

const vector = require("url:../../media/Vector.png");

export function initFormComp() {
  customElements.define(
    "form-comp",
    class extends HTMLElement {
      shadow: ShadowRoot;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        this.styles();
        this.render();
      }
      styles() {
        const style = document.createElement("style");
        style.innerHTML = `

        form, div, image, label, input, textarea, button, h1, h4 {
          margin: 0;
          padding: 0;
          border: 0;
          font-size: 100%;
          font: inherit;
          vertical-align: baseline;
        }

        h1{
          font-size: 40px;
          font-weight: 700;
          line-height: 60px;
        }

        h4{
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
        }

        .button {
          width: 100%;
          height: 50px;
          border: 2px solid transparent;
          border-radius: 4px;
          font-family: "poppins";
          padding: 0;
          margin-top:30px;
          background-color: rgba(255, 255, 255, 0.762);
        }

        .main__form{
          display: flex;
          flex-direction: column;
          position: absolute;
          right: 20px;
          left:20px;
          padding: 17px;
          height: auto;
          background-color: #000000;
          border-radius: 6px;
          color: white;
          margin-top: 33px;
          max-width: 400px;
        }

        @media(min-width:420px){
          .main__form{
            left: 50%;
            transform: translate(-50%, 0);

          }
        }

        @keyframes close-animation {
          from{
            transform: translateX(0%)
          }
          to{
            transform: translateX(150%);
          }
        }

        .main__form.close{
          animation: close-animation .3s ease-out;
        }

        .main__form div{
          margin-top: 18px;
        }

        .main__form-cross{
          float:right;
          width:24px;
          height:24px;
        }

        form input {
          height: 50px;
          width: 100%;
          border-radius: 6px;
        
        }
        
        form textarea{
          width: 100%;
          height: 127px;
          border-radius: 6px;
        
        }
        
        form input, form textarea{
          border: 2px solid #000000;
        }

        `;

        this.shadow.appendChild(style);
      }

      closeEvent() {
        const formEl = this.shadow.querySelector(".main__form") as any;

        this.dispatchEvent(
          new CustomEvent("close", {
            bubbles: true,
            composed: true,
          })
        );

        formEl.classList.add("close");

        setTimeout(() => {
          this.remove();
        }, 300);
      }

      render() {
        const cs = state.getState();
        const div = document.createElement("div");

        div.innerHTML = `

        <form class="main__form">
          <span>
            <img class="main__form-cross" src="${vector}">
          </span>
          <h1>Reportar info de ${cs.pet.name}</h1>
          <div>
            <label for="name"><h4>nombre:</h4></label>
            <input id="name" type="text" name="name"/>
          </div>
          <div>
            <label for="phone"><h4>telefono:</h4></label>
            <input id="phone" type="number" maxlength="10" name="phone" />
          </div>
          <div>
            <label for="info"><h4>donde lo viste?</h4></label>
            <textarea id="info" name="info"></textarea>
          </div>
          <button type="submit" class="submit-button button">Submit</button>
        </form>
        `;

        this.shadow.appendChild(div);

        const formEl = this.shadow.querySelector(".main__form") as any;
        const crossEl = this.shadow.querySelector(".main__form-cross") as any;

        formEl.addEventListener("submit", (e: any) => {
          e.preventDefault();

          const target = e.target as any;
          const petReportData = {
            name: target.name.value,
            phone: target.phone.value,
            info: target.info.value,
            petId: cs.pet.id,
            userId: cs.pet.userId,
          };

          if (target.name.value && target.phone.value) {
            state.createReport(petReportData).then(() => {
              this.closeEvent();
            });
          } else {
            window.alert("debes ingresar nombre y numero de telefono");
          }
        });

        crossEl.addEventListener("click", (e: any) => {
          e.preventDefault();
          e.stopPropagation();

          this.closeEvent();
        });
      }
    }
  );
}
