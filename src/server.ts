import express from 'express';
import { DataSourceOptions } from 'typeorm';
import createDashboardMiddleware from './dashboard';
import { Organization, Person } from './sources/typeorm/models';
// import UserEnity from './typeorm/UserEnity';
const app = express();

// Configuration for TypeORM
const typeORMConfig: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'root',
    password: 'root',
    database: 'test_db',
    synchronize: true,
};

// Entities definition for TypeORM (replace with your actual entity definitions)
const typeORMEntities = [
    Person,
    Organization
];

// Resources (if needed) to process the data before sending it to the client
const resources = {
    processData: (data: any) => {

        // Implement your data processing logic here
        // For example, transform the data, filter unwanted fields, etc.
        return data;
    },
};

// External API URL to fetch records
// Add the URL if you have any external API to fetch records

// Create the dashboard middleware with the specified parameters
const dashboardMiddleware = createDashboardMiddleware('typeorm', typeORMConfig, typeORMEntities, resources);

// Use the dashboard middleware in your Express app
app.use('/dashboard', dashboardMiddleware);

// Add other routes and middleware as needed for your app
// ...

// Start the server
const port = 4000;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
