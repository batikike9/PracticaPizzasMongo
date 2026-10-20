import express from 'express';
import cors from 'cors';
import {
  obtenerTodasLasPizzasAsync,
  obtenerPizzaPorIdAsync,
  agregarPizzaAsync,
  actualizarPizzaAsync,
  borrarPizzaAsync
} from './repositorios/pizza.repositorio.js';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Configuración para recibir payloads JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Obtener todas las pizzas (GET)
app.get("/api/v1/pizzas", async (req, res) => {
  const pizzas = await obtenerTodasLasPizzasAsync();
  return res.status(200).json(pizzas);
});

// 2. Obtener pizza por ID (GET)
app.get("/api/v1/pizzas/:id", async (req, res) => {
  const id = req.params.id;
  const pizza = await obtenerPizzaPorIdAsync(id);
  if (!pizza) {
    return res.status(404).json({ mensaje: "No existe la pizza con ese ID" });
  }
  return res.status(200).json(pizza);
});

// 3. Agregar pizza (POST)
app.post("/api/v1/pizzas", async (req, res) => {
  const nuevaPizza = req.body;
  const pizzaGuardada = await agregarPizzaAsync(nuevaPizza);
  return res.status(201).json(pizzaGuardada);
});

// 4. Actualizar pizza (PUT)
app.put("/api/v1/pizzas/:id", async (req, res) => {
  const id = req.params.id;
  const pizza = await actualizarPizzaAsync(id, req.body);
  if (!pizza) {
    return res.status(404).json({ mensaje: "No existe la pizza con ese ID" });
  }
  return res.status(200).json({ mensaje: "Datos actualizados", pizza });
});

// 5. Eliminar pizza (DELETE)
app.delete("/api/v1/pizzas/:id", async (req, res) => {
  const id = req.params.id;
  const eliminado = await borrarPizzaAsync(id);
  if (!eliminado) {
    return res.status(404).json({ mensaje: "No existe la pizza con ese ID" });
  }
  return res.status(200).json({ mensaje: "Datos eliminados" });
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor de pizzas ejecutándose en http://localhost:${PORT}`);
});
