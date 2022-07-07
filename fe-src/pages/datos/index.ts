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
      formEl.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const password = e.target.contraseña.value;
        const passwordB = e.target.contraseña2.value;
        const { email } = state.getState() as any;

        if (password === passwordB && email) {
          console.log("yup");
          state.signUp(name, password, email);
        } else {
          throw "las contraseñas deben coincidir";
        }
      });
    }
    render() {
      this.innerHTML = `
      <nav-comp></nav-comp>
      <h1 style="padding:20px">Mis datos</h1>
      <form class="datos__form">
        <div class="datos__input">
        
          <label for="name"><h6>Nombre</h6></label>
          <input type="name" name="name"/>
        </div>  
        <div class="datos__input">
          <label for="contraseña"><h6>contraseña</h6></label>
          <input type="password" name="contraseña"/>
          <label for="contraseña2"><h6>repetir contraseña</h6></label>
          <input type="password" name="contraseña2"/>
        </div>  
        <button type="submit" class="email__button"><h5>ingresar</h5></button>
      </form>
    `;

      this.className = "datos__container";
    }
  }
);
