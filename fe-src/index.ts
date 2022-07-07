import "./pages/home";
import "./pages/email";
import "./pages/datos";
import "./pages/password";
import "./pages/mascotas";
import "./pages/reportar";
import "./router";

import { initNavbarComp } from "./components/navbar";
import { initCardComp } from "./components/card";
import { initFormComp } from "./components/form";
import { state } from "./state";

(function () {
  initNavbarComp();
  initCardComp();
  initFormComp();
  state.init();
})();
