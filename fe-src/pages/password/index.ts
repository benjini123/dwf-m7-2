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

        state.signIn(password);
      });
    }
    render() {
      this.innerHTML = `
      <nav-comp></nav-comp>
      <h1 style="padding:20px">Ingresar</h1>
      <form class="password__form">
        <div class="password__input">
          <label for="password"><h6>contraseña:</h6></label>
          <input type="password" name="password"/>
        </div>  
        <button type="submit" class="email__button"><h5>ingresar</h5></button>
      </form>
    `;

      this.className = "password__container";
    }
  }
);
