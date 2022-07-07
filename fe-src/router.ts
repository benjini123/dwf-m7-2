import { Router } from "@vaadin/router";

const rootEl = document.querySelector(".root");
const router = new Router(rootEl);
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/home", component: "home-page" },
  { path: "/email", component: "email-page" },
  { path: "/datos", component: "datos-page" },
  { path: "/password", component: "password-page" },
  { path: "/mascotas", component: "mascotas-page" },
  { path: "/reportar", component: "reportar-page" },
]);
