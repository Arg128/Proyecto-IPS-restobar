TESTS:

- Cada comunicación hacia el backend debe de ser exitosa, metodos GET, POST.
  
  
* COCINA:
  - Realizar un seguimiento del menú y stock de provisiones
    (Se deben de mostrar correctamente).
  - Tambien verificar si compila todos los componentes.
  - Si un componente no se renderíza luego de realizar alguna acción
    (Preguntarme sobre posibles sugerencias).
  - Verificar si algún resource, como una foto de perfil, etc. no se muestra
    en pantalla.



### COMO COLOCAR Y ANALIZAR MI PROPIA BASE DE DATOS:

- En el archivo [drizzle.config.js](./packages/database/drizzle.config.js) se ubica la manera de realiarlo.

- De forma local, Turso + Drizzle utilizará el archivo [database.db](./database/database.db) escrito en SQLite3.

- Pero si lo quieres probar con la nube, solo basta con colocar tu entorno en .env a NODE_ENV=production. Y añadir las respectivas variables de entorno:
´´´
  TURSO_DATABASE_URL='<your.turso.io>'
  TURSO_AUTH_TOKEN='<your_auth_token>'
´´´
