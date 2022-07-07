import { Pet } from "../models";
import { index } from "../lib/algolia";
import { uploadToCloudinary } from "../lib/cloudinary";

export async function createPet(pet) {
  const picture = pet.data;
  const { name, latitud, longitud } = pet;
  uploadToCloudinary(picture);

  const [newMascota, created] = await Pet.findOrCreate({
    where: { name },
    defaults: {
      name,
      lat: latitud,
      lng: longitud,
    },
  });

  if (created) {
    const algoliaRes = await index
      .saveObject({
        objectID: newMascota.get("id"),
        name: newMascota.get("name"),
        state: newMascota.get("state"),
        _geoloc: {
          lat: newMascota.get("lat"),
          lng: newMascota.get("lng"),
        },
      })
      .catch((error) => {
        return error.message;
      });
  }
  return newMascota;
}
