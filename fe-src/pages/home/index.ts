import { Router } from "@vaadin/router";
import { state } from "../../state";
import "dotenv/config";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
const vector = require("url:../../media/Vector.png");

customElements.define(
  "home-page",
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
      <main>
      <div class="main__home main">
        <h1 class="main__title">Pet Finder</h1>
        <h5 class="main__notice">Dar mi ubicación:</h5>
        <div class="main__dogs-container">
        </div>
      </div> 
      <div id="maphome"></div>
      </main>
      `;

      this.className = "home__page";

      const titleEl: any = this.querySelector(".main__title");
      const noticeEl: any = this.querySelector(".main__notice");
      const containerEl: any = this.querySelector(".main__dogs-container");
      const mainEl: any = this.querySelector(".main");

      mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
      const map = new mapboxgl.Map({
        container: "maphome", // container ID
        style: "mapbox://styles/mapbox/streets-v11", // style URL
        center: [-24, 42], // starting center in [lng, lat]
        zoom: 0.4, // starting zoom
        projection: "globe", // display map as a 3D globe
      });

      map.on("style.load", () => {
        map.setFog({
          range: [-1, 2],
          "horizon-blend": 0.01,
          color: "#FF7276",
          "high-color": "#add8e6",
        }); // Set the default atmosphere style
      });

      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          // When active the map will receive updates to the device's location as it changes.
          trackUserLocation: true,
          // Draw an arrow next to the location dot to indicate which direction the device is heading.
          showUserHeading: true,
        })
      );

      const locatorButton = document.querySelector(
        ".mapboxgl-ctrl-top-right"
      ) as any;

      locatorButton.addEventListener("click", (e: any) => {
        e.preventDefault();

        locatorButton.style.display = "none";
        noticeEl.classList.add("open");
        titleEl.classList.add("open");

        window.navigator.geolocation.getCurrentPosition((position: any) => {
          const { latitude, longitude } = position.coords;
          state.locatePets(latitude, longitude).then((pets) => {
            pets.forEach((ev: any) => {
              const popup = new mapboxgl.Popup({
                offset: 25,
                className: "popup-styling",
              }).setHTML(`<h4 class="main__popup-title">${ev.name}</h4>`);

              popup.on("open", (e) => {
                const div = document.createElement("div") as any;

                div.innerHTML = `<lost-pet-card class="main__dog-card" location="${ev.location}" name="${ev.name}" pet-id="${ev.objectID}" src="${ev.url}" user-id="${ev.userId}"><lost-pet-card>`;

                div.className = "main__dog-card-div";

                containerEl.appendChild(div);
              });

              popup.on("close", (e) => {
                const div = document.querySelector(
                  ".main__dog-card-div"
                ) as any;
                if (div) {
                  div.remove();
                }
              });

              const marker = new mapboxgl.Marker()
                .setLngLat([ev._geoloc.lng, ev._geoloc.lat])
                .setPopup(popup)
                .addTo(map);
            });
          });
        });
      });

      mainEl.addEventListener("report", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const div = document.querySelector(".main__dog-card-div") as any;
        div.classList.add("report");

        // mainEl.style.display = "none";
        const formCustomEl = document.createElement("form-comp");
        this.appendChild(formCustomEl);
      });
    }
  }
);
