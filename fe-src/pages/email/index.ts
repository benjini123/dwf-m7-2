import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "email-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {
      const formEl = this.querySelector(".email__form") as any;

      formEl.addEventListener("submit", (e: any) => {
        e.preventDefault();
        const email: string = e.target.email.value;

        state.getUser(email);
      });
    }
    render() {
      this.innerHTML = `
      <nav-comp></nav-comp>
      <h1 style="padding:20px">Ingresar</h1>
      <form class="email__form">
        <div class="email__input">
          <label for="email"><h6>email:</h6></label>
          <input type="email" name="email"/>
        </div>  
        <button type="submit" class="email__button"><h5>ingresar</h5></button>
      </form>
      
      `;

      this.className = "email__container";
    }
  }
);
