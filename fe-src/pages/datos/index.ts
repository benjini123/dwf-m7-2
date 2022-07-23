import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "datos-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {
      const formEl: any = this.querySelector(".datos__form");
      formEl.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const password = e.target.contraseña.value;
        const passwordB = e.target.contraseña2.value;
        const currentState = state.getState() as any;
        const { email } = currentState.user;

        if (password === passwordB && name && password !== "") {
          if (currentState.token) {
            state.updateUser(name, password, email).then(() => {
              console.log(`user updated to ${name}`);
              Router.go("/home");
            });
          } else {
            state
              .signUp(name, password, email)
              .then(() => {
                const cs = state.getState();
                console.log("welcome " + cs.user.name + "!");

                state.appendToken(password, email);
                Router.go(currentState.src);
              })
              .catch((err) => {
                console.log("error");
                window.alert(err.message);
              });
          }
        } else {
          window.alert(
            "las contraseñas deben coincidir y debe ingresar un nombre"
          );
        }
      });
    }
    render() {
      const cs = state.getState();
      const existingData = cs.token;

      this.innerHTML = `
      <nav-comp></nav-comp>
      <div class="datos__container">
        <h1 style="padding:20px">Mis datos</h1>
        <form class="datos__form">
          <div>
            <label for="name"><h6>Nombre</h6></label>
            <input class="datos__input" type="name" name="name" value="${
              existingData ? cs.user.name : ""
            }"/>
          </div> 
          <div class="datos__input-contras"> 
            <div>
              <label for="contraseña"><h6>contraseña</h6></label>
              <input class="datos__input" type="password" name="contraseña" value="${
                existingData ? cs.user.password : ""
              }"/>
            </div>  
            <div> 
              <label for="contraseña2"><h6>repetir contraseña</h6></label>
              <input class="datos__input" type="password" name="contraseña2" value="${
                existingData ? cs.user.password : ""
              }"/>
            </div>  
          </div>
          <button type="submit" class="email__button button"><h5>ingresar</h5></button>
        </form>
      </div>
    `;

      this.className = "datos__page";
    }
  }
);
