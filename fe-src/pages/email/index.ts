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

      formEl.addEventListener("submit", async (e: any) => {
        e.preventDefault();

        const email: string = e.target.email.value;

        const userExists = (await state.getUser(email)) as any;
        if (userExists === false) {
          Router.go("/datos");
        } else {
          Router.go("/password");
        }
      });
    }
    render() {
      this.innerHTML = `
      <nav-comp></nav-comp>
      <form class="email__form">
        <div class="email__form-data">
          <h1 style="padding:20px">Ingresar</h1>
          <label for="email"><h6>email:</h6></label>
          <input class="email__input" type="email" name="email"/>
          <button type="submit" class="email__button button"><h5>ingresar</h5></button>
        </div>  
      </form>
      
      `;

      this.className = "email__container";
    }
  }
);
