## App structure

```
vortika/
|-- app.js
|-- templates/
|   |-- assets/
|   |   |-- styles/
|   |   |-- scripts/
|   |-- views/
|   |   |-- _default/
|   |   |-- draft/
|   |   |-- preview/
|   |   |-- public/
|-- services/
|   |-- importer.js
|-- routes/
|   |-- api.js
|   |-- core.js
|-- modules/
|   |-- feeds/
|   |   |-- feed.controller.js
|   |   |-- feed.views.js
|   |   |-- feed.model.js
|   |   |-- feed.service.js
|   |   |-- tests/
|   |-- jobs/             |
|   |-- mappings/         |
|   |-- pages/            |  These follow same structure.
|   |-- permissions/      |
|   |-- roles/            | 
|   |-- users/            |
|-- middleware/
|-- helpers/
|-- package.json
|-- package-lock.json
|-- nodemon.json
|-- Dockerfile
|-- .dockerignore
|-- .env`