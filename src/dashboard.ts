import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import DataAccessFactory from './orm/dataAccessFactory';

const app = express();
app.use(bodyParser.json());

export default function createDashboardMiddleware(
  ormName: string,
  config: any, // Replace 'any' with the appropriate type for the ORM configuration
  dataModels: any[], // Replace 'any[]' with the appropriate type for the dataModels array
  resources: any, // Replace 'any' with the appropriate type for the resources
) {
  // Create the data access object using the Data Access Factory and config
  const dataAccess = DataAccessFactory(ormName, config, dataModels);

  const connectionPromise = dataAccess.connect();

  connectionPromise.then(() => {
    console.log('Connected to the database using ' + ormName + '.');
  }).catch((err) => {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  });

  // Define a route to list all available entities/models
  app.get('/entities', (req: Request, res: Response) => {
    // Extract entity names from dataModels and return them
    const entities = dataModels.map((model) => model.name);
    res.json({ entities });
  });

  // Define a route to fetch all records of a specific model
  app.get('/entities/:modelName', async (req: Request, res: Response) => {
    try {
      const modelName = req.params.modelName;
      // Check if the modelName is valid and exists in dataModels
      const model = dataModels.find((m) => m.name === modelName);
      if (!model) {
        res.status(404).json({ error: 'Model not found' });
        return;
      }

      console.log('Fetching data for model:', model);
      // Fetch records from the data access layer based on the modelName
      const records = await dataAccess.getAllData(model); // Use appropriate method here

      // Process the records using the provided resources if needed
      // For example, you can transform the data before sending it to the client
      const processedData = resources.processData(records);
      res.json({ data: processedData });
    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  });

  app.post('/entities/:entityName', async (req, res) => {
    try {
      const entityName = req.params.entityName;
      // Check if the entityName is valid and exists in dataModels
      const entityModel = dataModels.find((model) => model.name === entityName);
      if (!entityModel) {
        res.status(404).json({ error: 'Entity not found' });
        return;
      }
  
      const repository = dataAccess.getRepository(entityModel); // Get the TypeORM repository
  
      // Create a new record using request body
      const newRecord = repository.create(req.body);
  
      // Save the new record
      const savedRecord = await repository.save(newRecord);
  
      res.json({ success: true, data: savedRecord });
    } catch (err) {
      console.error('Error adding data:', err);
      res.status(500).json({ error: err });
    }
  });
  // Add other routes and middleware as needed for your backend
  // ...

  return app;
}
