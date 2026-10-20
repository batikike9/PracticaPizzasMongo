# Práctica Pizzas - CRUD con Node.js y MongoDB

## Descripción del Proyecto
API REST modular implementada en **Node.js** con **Express** (ES Modules) y patrón de diseño Repositorio, persistiendo la información de un catálogo de pizzas en una base de datos NoSQL **MongoDB** ejecutada en un contenedor Docker.

## Instrucciones para Ejecutar el Proyecto

### 1. Iniciar MongoDB con Docker
El contenedor de la base de datos se ejecuta con las siguientes variables de autenticación:
```bash
docker run -d --name mongo-fest -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=12345678 mongo:latest
mongodb://root:12345678@localhost:27017/?authSource=admin
npm install
npm run dev
