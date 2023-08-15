# Express Dashboard Middleware

Express Dashboard Middleware is a utility package that provides a middleware for creating a RESTful API for managing data models using the Express framework and an ORM. It abstracts away the common CRUD operations and exposes endpoints for managing entities/models in a database.

## Installation

```bash
npm install  @atooldev/orm-data-access  @atooldev/admin-express
```

## Usage

To use the Express Dashboard Middleware, follow these steps:

1. Import the required modules and types:

```typescript
import express from 'express';
import { createDataAccess } from '@atooldev/orm-data-access';
import { createDashboardMiddleware } from '@atooldev/admin-express';
```

2. Create an instance of Express and configure it:

```typescript
const app = express();
app.use(express.json());
```

3. Define your ORM configuration, data models, and resources:

```typescript
const ormName = 'your-orm'; // Replace with your actual ORM name
const ormConfig = {}; // Define your ORM configuration
const dataModels = []; // Define your data models
const resources = {
  processData: (data) => data, // Define your resource processing logic
};
```

4.Create the dashboard middleware and use it:

```typescript
const dashboardMiddleware = createDashboardMiddleware(ormName, ormConfig, dataModels, resources);
app.use('/dashboard', dashboardMiddleware);

```

5. Start your Express server:

```typescript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## API Endpoints

The middleware exposes the following endpoints:

### List all available entities/models

**Endpoint**: `GET /dashboard/entities`

This endpoint lists all available entities/models.

### Fetch all records of a specific model

**Endpoint**: `GET /dashboard/entities/:modelName`

Fetches all records of a specific model.

**Parameters**:

- `:modelName` (string): The name of the model.

**Query Parameters**:

- `page` (number): Page number for pagination (default: 1).
- `perPage` (number): Number of records per page (default: 10).
- `filter` (string, JSON): Filter criteria for data retrieval.
- `include` (string): Comma-separated list of related models to include.

### Create a new record for a specific model

**Endpoint**: `POST /dashboard/entities/:modelName`

Creates a new record for a specific model.

**Parameters**:

- `:modelName` (string): The name of the model.

**Request Body**:

- The data to create the record.

### Get fields for a specific model

**Endpoint**: `GET /dashboard/entities/:modelName/fields`

Retrieves fields for a specific model.

**Parameters**:

- `:modelName` (string): The name of the model.

### Fetch a specific record of a specific model

**Endpoint**: `GET /dashboard/entities/:modelName/:id`

Fetches a specific record of a specific model.

**Parameters**:

- `:modelName` (string): The name of the model.
- `:id` (string): The ID of the record to fetch.

### Update a specific record of a specific model

**Endpoint**: `PUT /dashboard/entities/:modelName/:id`

Updates a specific record of a specific model.

**Parameters**:

- `:modelName` (string): The name of the model.
- `:id` (string): The ID of the record to update.

**Request Body**:

- The data to update the record with.

### Delete a specific record of a specific model

**Endpoint**: `DELETE /dashboard/entities/:modelName/:id`

Deletes a specific record of a specific model.

**Parameters**:

- `:modelName` (string): The name of the model.
- `:id` (string): The ID of the record to delete.

## Contribute

Contributions to this middleware are welcome! If you encounter any issues, have suggestions, or want to improve the codebase, feel free to open an issue or submit a pull request.

To contribute to this project, follow these steps:

1. Fork the repository.
2. Clone your forked repository to your local machine.
3. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`.
4. Make your changes and test thoroughly.
5. Commit your changes: `git commit -m "Add your commit message here"`.
6. Push to the branch: `git push origin feature/your-feature-name`.
7. Create a pull request in this repository.

Thank you for contributing to making this middleware better!


## License

This project is licensed under the terms of the [MIT License](LICENSE).
