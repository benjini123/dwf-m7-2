import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "password-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {
      const formEl: any = this.querySelector(".password__form");

      formEl.addEventListener("submit", (e: any) => {
        e.preventDefault();
        const password = e.target.password.value as any;

        state
          .signIn(password)
          .then(() => {
            console.log(`welcome! Succesfully signed in`);
            Router.go("/home");
          })
          .catch((error) => {
            window.alert(error.message);
          });
      });
    }
    render() {
      this.innerHTML = `
      <nav-comp></nav-comp>
      <form class="password__form">
      <div class="password__form-data">
        <h1 style="padding:20px">Ingresar</h1>
        <label for="password"> <h6>contraseña:</h6> </label>
        <input type="password" name="password" class="password__input"/>
        <button type="submit" class="password__button button"><h5>ingresar</h5></button>
      </div>  
      </form>
    `;

      this.className = "password__container";
    }
  }
);
