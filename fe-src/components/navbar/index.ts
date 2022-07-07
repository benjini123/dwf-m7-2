import { Router } from "@vaadin/router";
import { state } from "../../state";

const paws = require("url:../../media/paws.png");
const burguer = require("url:../../media/burguer.png");
const vector = require("url:../../media/Vector.png");

export function initNavbarComp() {
  customElements.define(
    "nav-comp",
    class extends HTMLElement {
      shadow: ShadowRoot;
      src: any;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        this.addStyles();
        this.render();
        this.sessionHandler();
        this.listeners();
      }
      addStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
        .header {
          margin: 0 auto;
        }
        
        .respmenu {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          background-color: #FF6868;
          position:relative;
          width:100%;
          padding:20px;
          color: white;
        }
        .respmenu .header__logo-burguer, .respmenu .header__logo-vector {
          font-size: 48px;
          pointer-events: none;
        }
        .respmenu .header__logo-vector{
          position: absolute;
          right: 20px;
        }
        .respmenu input[type="checkbox"], .respmenu .header-logo-burguer, .respmenu .header-logo-vector {
          position: absolute;
          margin: 0;
          padding: 0;
          right: 20px;
          top: 20px;
          width: 48px;
          height: 48px;
        }
        .respmenu input[type="checkbox"]{
          opacity:0;
        }
        
        .header__logo-burguer, .header__logo-paws, .header__logo-vector {
          height: 48px;
          width: 48px;
        }
        .respmenu nav {
          display: none;
        }
        
        .respmenu input:checked ~ nav {
          display: flex;
          flex-direction:column;
          height:100vh;
          width: 100%;
          align-content: center
        }
        .respmenu input:checked ~ img {
          display: none;
        }
        .header__container input[type="checkbox"] {
          opacity: 0;
        }
        nav ul{
          list-style: none;
          padding: 0;
          margin: 0;
          height:100vh;
          display:flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom:90px;
          gap:20px
        }
        .respmenu a {
          color: inherit;
          text-decoration: none;
          display: block;
          padding: 10px 20px;
          width:100%;
          padding: 0;
        }
        `;

        this.shadow.appendChild(style);
      }

      sessionHandler() {
        const opcionEl = [
          ...(this.shadow.querySelectorAll(".header__opciones") as any),
        ];

        // for each navigation option
        opcionEl.forEach((item) => {
          item.addEventListener("click", (e: any) => {
            e.preventDefault();
            e.stopPropagation();

            const currentState = state.getState();
            currentState.src = e.target.getAttribute("src");
            state.setState(currentState);

            if (currentState.email && currentState.token) {
              // if logged in
              Router.go(currentState.src);
            } else {
              // if not logged in
              Router.go("/email");
            }
          });
        });
      }

      listeners() {
        const sessionInfo = this.shadow.querySelector(
          ".header__session-info"
        ) as any;

        document.addEventListener("sign", (e: any) => {
          e.preventDefault();

          const { email } = e.detail as any;
          const currentState = state.getState() as any;
          const src = currentState.src || "/home";

          const div = document.createElement("div");
          div.innerHTML = `
          <h2>${email}<h2>
          <a class="link"><h6>cerrar sesion</h6></a>
          `;

          const sessionClose = div.querySelector(".link") as any;
          sessionClose.addEventListener("click", (e: any) => {
            e.preventDefault();

            div.remove();
            state.setState({});
          });

          sessionInfo.appendChild(div);

          Router.go(`${src}`);
        });
      }

      render() {
        const div = document.createElement("div");

        div.innerHTML = `
        <header class="header"> 
          <div class="respmenu">
            <input type="checkbox" class="header__checkbox-input" />
            <img src="${paws}" class="header__logo-paws" />
            <img src="${burguer}" class="header__logo-burguer" />
            <nav>
              <img src="${vector}" class="header__logo-vector" />
              <ul>
                <li>
                  <a name="a" class="header__opciones">
                    <h3 src="/datos">mis datos</h3
                  </a>
                </li>
                <li>
                  <a class="header__opciones">
                    <h3 src="/mascotas">mis mascotas reportadas</h3>
                  </a>
                </li>
                <li>
                  <a name="c" class="header__opciones">
                    <h3 src="/reportar">reportar mascota</h3>
                  </a>
                </li>
              </ul>
              <div class="header__session-info">
              </div>
            </nav>
            </div>
        </header>
        `;

        this.shadow.appendChild(div);
      }
    }
  );
}
