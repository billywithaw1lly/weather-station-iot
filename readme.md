npm i express mongoose socket.io cors dotenv

```
weather-station-iot
├─ backend
│  ├─ .env
│  ├─ .prettierignore
│  ├─ .prettierrc
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ temp
│  └─ src
│     ├─ app.js
│     ├─ controllers
│     │  ├─ healthcheck.controllers.js
│     │  └─ reading.controllers.js
│     ├─ db
│     │  └─ index.js
│     ├─ index.js
│     ├─ middlewares
│     ├─ models
│     │  ├─ reading.models.js
│     │  └─ station.models.js
│     ├─ routes
│     │  ├─ healthcheck.routes.js
│     │  └─ reading.routes.js
│     ├─ sockets
│     │  └─ index.js
│     ├─ utils
│     │  ├─ api-error.js
│     │  ├─ api-response.js
│     │  ├─ async-handler.js
│     │  └─ constants.js
│     └─ validators
├─ frontend
├─ hardware
└─ readme.md

```