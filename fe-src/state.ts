export const state = {
  data: {
    reportadas: [],
  },
  listeners: [],

  init() {
    const localData = JSON.parse(localStorage.getItem("account-data") as any);
    if (!localData) {
      return;
    } else {
      state.setState(localData);
    }
  },

  async getUser(email: string) {
    const cs = state.getState();
    cs.email = email;
    state.setState(cs);

    const userRes = await fetch("http://localhost:5656/users", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const userResData = await userRes.json();
  },

  async addPet(pet: Object) {
    const petRes = await fetch("http://localhost:5656/mascotas", {
      method: "POST",
      body: JSON.stringify(pet),
      headers: { "Content-Type": "application/json" },
    });

    if (petRes.ok) {
      const cs = this.getState();
      if (cs.reportadas) {
        cs.reportadas.push(pet);
        this.setState(cs);
      } else {
        cs.reportadas = [];
        cs.reportadas.push(pet);
        console.log(cs.reportadas);
        this.setState(cs);
      }
    } else {
      return new Error("no se pudo agregar tu mascota");
    }

    const petResData = await petRes.json();
    return petResData;
  },

  async signIn(password) {
    const currentState = state.getState();
    const email = currentState.email;

    const tokenData = await fetch("http://localhost:5656/auth/token", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    try {
      const tokenDataRes = await tokenData.json();
      currentState.token = tokenDataRes;
      state.setState(currentState);
      state.appendPets(email);

      document.dispatchEvent(
        new CustomEvent("sign", {
          detail: {
            email,
          },
          bubbles: true,
          composed: true,
        })
      );
    } catch {
      return new Error("no se pudo crear un token");
    }
  },

  async appendPets(email: string) {
    const cs = state.getState();
    const petsData = await fetch("http://localhost:5656/mascotas/reportadas", {
      method: "get",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const petsDataRes = await petsData.json();
    cs.reportadas = petsDataRes;
  },

  async appendToken(password, email) {
    const cs = state.getState();
    const data = await fetch("http://localhost:5656/auth/token", {
      method: "POST",
      body: JSON.stringify({ password, email }),
      headers: { "Content-Type": "application/json" },
    });

    try {
      const dataRes = await data.json();
      cs.token = dataRes;
      state.setState(cs);
    } catch {
      return new Error("no se pudo crear un token");
    }
  },

  async signUp(name, password, email) {
    const cs = state.getState() as any;

    const authRes = await fetch("http://localhost:5656/auth", {
      method: "POST",
      body: JSON.stringify({ name, password, email }),
      headers: { "Content-Type": "application/json" },
    });

    try {
      const authResData = await authRes.json();
      cs.name = authResData.name;
      state.setState(cs);

      state.appendToken(password, email);

      document.dispatchEvent(
        new CustomEvent("sign", {
          detail: {
            email,
          },
          bubbles: true,
          composed: true,
        })
      );
    } catch {
      return new Error("no se pudo autenticarse en el sistema");
    }
  },

  getState() {
    // const data = this.data;
    return this.data;
  },

  setState(newState: any) {
    this.data = newState;
    localStorage.setItem("account-data", JSON.stringify(newState));
    for (const cb of state.listeners as any) {
      cb();
    }
  },

  subscribe(callback: (any) => any) {
    state.listeners.push(callback as never);
  },
};
