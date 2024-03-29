import { Pet } from "../models";
import { index } from "../lib/algolia";
import { cloudinary } from "../lib/cloudinary";

export async function createPet(pet) {
  const { nombre, latitud, longitud, userId, url, location } = pet;

  const imagen = await cloudinary.uploader.upload(url, {
    resource_type: "image",
    discard_original_filename: true,
    width: 1000,
  });

  const newMascota = await Pet.create({
    name: nombre,
    state: "lost",
    lat: latitud,
    lng: longitud,
    url: imagen.secure_url,
    location,
    userId,
  });

  const algoliaRes = await index
    .saveObject({
      objectID: newMascota.get("id"),
      name: newMascota.get("name"),
      state: newMascota.get("state"),
      url: newMascota.get("url"),
      _geoloc: {
        lat: newMascota.get("lat"),
        lng: newMascota.get("lng"),
      },
      location: newMascota.get("location"),
      userId,
    })
    .catch((error) => {
      return error.message;
    });

  return newMascota;
}

export async function updatePet(petObject, petId) {
  const { nombre, latitud, longitud, url, location } = petObject;

  const imagen = await cloudinary.uploader.upload(url, {
    resource_type: "image",
    discard_original_filename: true,
    invalidate: true,
    width: 1000,
  });

  const editPet = await Pet.update(
    {
      name: nombre,
      lat: latitud,
      lng: longitud,
      url: imagen.secure_url,
      location,
    },
    {
      where: {
        id: petId,
      },
    }
  );

  await index
    .partialUpdateObject({
      objectID: petId,
      name: nombre,
      url: imagen.secure_url,
      _geoloc: {
        lat: latitud,
        lng: longitud,
      },
      location: location,
    })
    .catch((error) => {
      return error.message;
    });

  return editPet;
}

export async function getGeoPets(lat, lng) {
  const { hits } = await index.search("", {
    aroundLatLng: [lat, lng].join(","),
    aroundRadius: 10000,
  });
  return hits;
}

export async function getUserPets(userId) {
  const mascotas = await Pet.findAll({
    where: { userId },
  });
  return mascotas;
}

export async function deletePet(petId) {
  await index.deleteObject(petId);
  const mascotas = await Pet.destroy({
    where: { id: petId },
  });
  return mascotas;
}

export async function getPets() {
  const mascotas = await Pet.findAll();
  return mascotas;
}
