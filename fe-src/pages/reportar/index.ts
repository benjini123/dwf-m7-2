import "dotenv/config";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import Dropzone from "dropzone";
import { state } from "../../state";
import { Router } from "@vaadin/router";

const MapboxClient = require("mapbox");
const mapboxClient = new MapboxClient(process.env.MAPBOX_TOKEN);

customElements.define(
  "reportar-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }

    render() {
      let editMode: boolean = true;

      const cs = state.getState();
      if (cs.mode === "report") {
        editMode = false;
      }

      this.innerHTML = `
      <nav-comp></nav-comp>
      <section class="reportar__section">
        <form class="dropzone" id="upload-form">
          <h1>${editMode ? "Editar" : "Reportar"} mascota perdida</h1>
          <div>
            <label for="nombre"><h6>nombre</h6></label>
            <input name="nombre" class="reportar__input-nombre nombre__input" value=${
              editMode ? cs.pet.name : ""
            }>
          </div>
          
          <button type="button" class="dropzone-previews button"></button>
          <button type="button" id="my-dropzone" class="reportar__form-button-agregar-foto button" >agregar/modificar foto</button>
          <div id="map" class="mapbox-map"></div>
          <div>
            <label for="q"><h6>ubicacion</h6></label>
            <div class="reportar__input-container">
              <input name="location" class="location-value ubicacion__input" type="search" value=${
                editMode ? cs.pet.location : ""
              }>
              <button type="button" class="reportar__form-button-location button">go</button>
            </div>
          </div>
          <h6>Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</h6>
          <div class="reportar__submit-button-container">
            <button type="submit" class="button"><h5>${
              editMode ? "Guardar" : "Reportar como perdida"
            }</h5></button>
            <button type="click" class="cancelar button"><h5>${
              editMode ? "Reportar como encontrado" : "cancelar"
            }</h5></button>
            <a class="reportar__despublicar" style="display:${
              editMode ? "initial" : "none"
            }"><h6>Despublicar</h6></a>
          </div>
        </form>
      </section>
      `;

      this.className = "reportar__container";

      const map = document.getElementById("map") as any;
      const form = document.querySelector("#upload-form") as any;
      const input = document.querySelector(".location-value") as any;
      const despublicarEl = document.querySelector(
        ".reportar__despublicar"
      ) as any;
      const btnLocationEl = document.querySelector(
        ".reportar__form-button-location"
      ) as any;

      let data: any;
      let longitud: any;
      let latitud: any;

      function initDropzone() {
        Dropzone.autoDiscover = false;
        let myDropzone = new Dropzone("#my-dropzone", {
          url: "/file/post",
          autoProcessQueue: false,
          previewsContainer: ".dropzone-previews",
          uploadMultiple: false,
          maxFiles: 1,
        });

        myDropzone.on("thumbnail", function (file) {
          data = file.dataURL;
        });

        myDropzone.on("maxfilesexceeded", function (file) {
          myDropzone.removeAllFiles();
          myDropzone.addFile(file);
          data = file.dataURL;
        });
      }

      function initMap() {
        mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
        return new mapboxgl.Map({
          container: map,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [-58.38162, -34.60376],
          zoom: 13,
          attributionControl: false,
        });
      }

      function initListeners(callback) {
        form.addEventListener("submit", async (e: any) => {
          e.preventDefault();
          e.stopPropagation();

          const nombre = e.target.nombre.value as any;
          const location = e.target.location.value as any;

          if (!nombre || !location || !data) {
            alert(
              "tiene que ingresar un nombre, una foto y una direccion para continuar"
            );
          } else {
            let pet: object = {
              nombre,
              latitud,
              longitud,
              url: data,
              location,
              userId: cs.user.userId,
            };

            if (!editMode) {
              const petRes = await state.addPet(pet);
              console.log({ newPet: petRes });

              Router.go("/mascotas");
            } else {
              const petRes = await state.modifyPet(pet);
              console.log(`pet has been successfully modified!`);

              Router.go("/mascotas");
            }
          }
        });

        despublicarEl.addEventListener("click", async (e: any) => {
          e.preventDefault();

          await state.removeLostPet(cs.pet.id);
          Router.go("/mascotas");
        });

        btnLocationEl.addEventListener("click", (e: any) => {
          e.preventDefault();
          e.stopPropagation();

          mapboxClient.geocodeForward(
            input.value,
            {
              country: "ar",
              autocomplete: true,
              language: "es",
            },
            function (err, data, res) {
              if (!err) callback(data.features);
            }
          );
        });
      }

      (function main() {
        initDropzone();
        const map = initMap();

        initListeners(function (results) {
          const firstResult = results[0];

          const marker = new mapboxgl.Marker()
            .setLngLat(firstResult.geometry.coordinates)
            .addTo(map);
          const [lng, lat] = firstResult.geometry.coordinates;
          longitud = lng;
          latitud = lat;
          map.setCenter(firstResult.geometry.coordinates);
          map.setZoom(14);
        });
      })();
    }
  }
);
