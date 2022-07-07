import { state } from "../../state";
import Dropzone from "dropzone";
import "dotenv/config";
const MapboxClient = require("mapbox");
const mapboxClient = new MapboxClient(process.env.MAPBOX_TOKEN);
import * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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
      this.innerHTML = `
      <nav-comp></nav-comp>
      <section class="reportar__section">
        <form class="dropzone" id="upload-form">
          <h1>Reportar mascota perdida</h1>
          <div>
            <label for="nombre"><h6>nombre</h6></label>
            <input name="nombre" class="reportar__input-nombre">
          </div>
          
          <button type="button" class="dropzone-previews" ></button>
          <button type="button" id="my-dropzone" class="reportar__form-button-agregar-foto">agregar/modificar foto</button>
          <div id="map" class="mapbox-map"></div>
          <div>
            <label for="q"><h6>ubicacion</h6></label>
            <div class="reportar__input-container">
              <input name="q" class="location-value" type="search" />
              <button type="button" class="reportar__form-button-location">go</button>
            </div>
          </div>
          <h6>Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</h6>
          <div class="reportar__submit-button-container">
            <button><h5>Reportar como perdida</h5></button>
            <button class="cancelar"><h5>Cancelar</h5></button>
          </div>
        </form>
      </section>
      `;

      this.className = "reportar__container";

      const map = document.getElementById("map") as any;
      const form = document.querySelector("#upload-form") as any;
      const input = document.querySelector(".location-value") as any;
      const btnLocation = document.querySelector(
        ".reportar__form-button-location"
      ) as any;
      let data;
      let longitud;
      let latitud;

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
          console.log(data);
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

      function initSearchForm(callback) {
        form.addEventListener("submit", (e: any) => {
          e.preventDefault();
          e.stopPropagation();

          const nombre = e.target.nombre.value as any;

          const pet = state.addPet({ latitud, longitud, nombre });
          console.log(pet);
        });

        btnLocation.addEventListener("click", (e: any) => {
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

        initSearchForm(function (results) {
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
