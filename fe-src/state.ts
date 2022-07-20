const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5656";
export type mode = "edit" | "report";

export const state = {
  data: {},
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

    const userRes = await fetch(API_BASE_URL + "/user/" + email, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });

    const userResData = await userRes.json();

    if (userResData.userId) {
      cs.userId = userResData.userId;
      console.log(userResData.userId);
    }

    state.setState(cs);
    return userResData;
  },

  async locatePets(latitude, longitude) {
    const petsData = await fetch(
      API_BASE_URL + "/mascotas-cerca-de?lat=" + latitude + "&lng=" + longitude,
      { method: "get", headers: { "Content-Type": "application/json" } }
    );
    const petsDataRes = await petsData.json();
    return petsDataRes;
  },

  async addPet(petData: any) {
    const cs = state.getState();
    const { token } = cs;

    const petRes = await fetch(API_BASE_URL + "/mascotas", {
      method: "POST",
      body: JSON.stringify(petData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    });

    const petResData = await petRes.json();
    return petResData;
  },

  async modifyPet(petData: any) {
    const cs = state.getState();
    console.log(petData);

    const petRes = await fetch(API_BASE_URL + "/mascotas/editar/" + cs.pet.id, {
      method: "PATCH",
      body: JSON.stringify(petData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${cs.token}`,
      },
    });
    const petResData = await petRes.json();
    return petResData;
  },

  async removeLostPet(petId) {
    const cs = state.getState();
    const { token } = cs;

    const petRes = await fetch(API_BASE_URL + "/mascotas/" + petId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    });

    const petResData = await petRes.json();
    cs.pet = {};
    state.setState(cs);
    return petResData;
  },

  async signIn(password) {
    const currentState = state.getState();
    const email = currentState.email;

    const tokenData = await fetch(API_BASE_URL + "/auth/token", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const tokenDataRes = await tokenData.json();
    if (tokenDataRes === false) {
      throw new Error("contraseña incorrecta");
    } else {
      currentState.token = tokenDataRes;
      state.setState(currentState);
    }
  },

  async appendPets() {
    const cs = state.getState();
    const { userId } = cs;

    const petsData = await fetch(API_BASE_URL + "/mascotas/" + userId, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });

    const petsDataRes = await petsData.json();
    return petsDataRes;
  },

  async appendToken(password, email) {
    const cs = state.getState();
    const data = await fetch(API_BASE_URL + "/auth/token", {
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

    const authRes = await fetch(API_BASE_URL + "/auth", {
      method: "POST",
      body: JSON.stringify({ name, password, email }),
      headers: { "Content-Type": "application/json" },
    });

    try {
      const authResData = await authRes.json();
      cs.userId = authResData;
      state.setState(cs);

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
      window.alert("error al registrar el usuario");
    }
  },

  async createReport(petReportData) {
    const cs = state.getState();
    const { token } = cs;

    const reportRes = await fetch(API_BASE_URL + "/report", {
      method: "post",
      body: JSON.stringify(petReportData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    });

    const reportResData = await reportRes.json();

    return reportResData;
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
