/**
 * Capa de persistencia (Repositorio) conectada a la base de datos MongoDB en Docker.
 */
import { MongoClient, ObjectId } from 'mongodb';

// Cadena de conexión de MongoDB con usuario root y contraseña configurados en Docker
const uri = "mongodb://root:12345678@localhost:27017/?authSource=admin";
const client = new MongoClient(uri);
const dbName = "pizzas_db";
const collectionName = "pizzas";

/**
 * Obtiene la colección de pizzas conectando a MongoDB.
 * @returns {Promise<import('mongodb').Collection>} Referencia a la colección 'pizzas'
 */
async function obtenerColeccionAsync() {
  await client.connect();
  const db = client.db(dbName);
  return db.collection(collectionName);
}

/**
 * Regresa una lista completa con todas las pizzas existentes en MongoDB.
 * @returns {Promise<Array<Object>>} Arreglo con todos los documentos de pizzas.
 */
export async function obtenerTodasLasPizzasAsync() {
  const coleccion = await obtenerColeccionAsync();
  return await coleccion.find({}).toArray();
}

/**
 * Regresa una pizza a partir de su ID o null si no se encuentra en la base de datos.
 * @param {string|number} id Identificador de la pizza buscada.
 * @returns {Promise<Object|null>} El documento de la pizza encontrada o null.
 */
export async function obtenerPizzaPorIdAsync(id) {
  const coleccion = await obtenerColeccionAsync();
  let filtro = { id: isNaN(id) ? id : Number(id) };

  if (ObjectId.isValid(id) && String(new ObjectId(id)) === String(id)) {
    filtro = { $or: [{ id: isNaN(id) ? id : Number(id) }, { _id: new ObjectId(id) }] };
  }

  return await coleccion.findOne(filtro);
}

/**
 * Agrega y persiste una nueva pizza en la colección de MongoDB.
 * @param {Object} pizza Objeto con la información de la pizza a guardar.
 * @returns {Promise<Object>} La pizza insertada con su identificador generado.
 */
export async function agregarPizzaAsync(pizza) {
  const coleccion = await obtenerColeccionAsync();
  const resultado = await coleccion.insertOne(pizza);
  return { ...pizza, _id: resultado.insertedId };
}

/**
 * Actualiza los campos de una pizza en MongoDB filtrando por su ID.
 * @param {string|number} id Identificador de la pizza a modificar.
 * @param {Object} pizzaActualizada Objeto con los atributos actualizados.
 * @returns {Promise<Object|null>} El documento actualizado o null si no existe.
 */
export async function actualizarPizzaAsync(id, pizzaActualizada) {
  const coleccion = await obtenerColeccionAsync();
  let filtro = { id: isNaN(id) ? id : Number(id) };

  if (ObjectId.isValid(id) && String(new ObjectId(id)) === String(id)) {
    filtro = { $or: [{ id: isNaN(id) ? id : Number(id) }, { _id: new ObjectId(id) }] };
  }

  const resultado = await coleccion.updateOne(filtro, { $set: pizzaActualizada });
  if (resultado.matchedCount === 0) return null;

  return await obtenerPizzaPorIdAsync(id);
}

/**
 * Elimina una pizza de la base de datos según su ID.
 * @param {string|number} id Identificador de la pizza a remover.
 * @returns {Promise<boolean>} True si se eliminó correctamente, false si no se encontró.
 */
export async function borrarPizzaAsync(id) {
  const coleccion = await obtenerColeccionAsync();
  let filtro = { id: isNaN(id) ? id : Number(id) };

  if (ObjectId.isValid(id) && String(new ObjectId(id)) === String(id)) {
    filtro = { $or: [{ id: isNaN(id) ? id : Number(id) }, { _id: new ObjectId(id) }] };
  }

  const resultado = await coleccion.deleteOne(filtro);
  return resultado.deletedCount > 0;
}
