import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import DataAccessFactory from './adapters/dataAccessFactory';

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
    // return object with name and label and unique id for each model
    const entities = dataModels.map((model) => {
      return {
        name: model.name?.toLowerCase(),
        label: model.name,
      };
    }
    );
    res.json({ data: entities });
  });

  // Define a route to fetch all records of a specific model
  app.get('/entities/:modelName', async (req: Request, res: Response) => {
    try {
      const modelName = req.params.modelName?.toLowerCase();
      // Check if the modelName is valid and exists in dataModels
      const model = dataModels.find((m) => m.name?.toLowerCase() === modelName);
      if (!model) {
        res.status(404).json({ error: 'Model not found' });
        return;
      }

      const { page = 1, perPage = 10, filter, include } = req.query;

      const options: {
        page: number,
        perPage: number,
        filter?: object,
        include?: string[]
      } = {
        page: +page,
        perPage: +perPage,
      };

      if (filter) {
        options.filter = JSON.parse(filter?.toString()); // Assuming filter is provided as a JSON string
      }

      if (include) {
        options.include = include?.toString().split(',');
      }

      // Fetch records from the data access layer based on the modelName and options
      const records = await dataAccess.getAllData(model, options);

      // Process the records using the provided resources if needed
      // For example, you can transform the data before sending it to the client
      const processedData = resources.processData(records);
      res.json({
        ...records,
        meta: {
          total: records.total,
          page: options.page,
          perPage: options.perPage,
        },
      });
    } catch (err) {
      console.error('Error fetching data from the database:', JSON.stringify(err));
      // return error trace
    
      res.status(500).json({
        error: {
          message: 'An error occurred while fetching data',
          meta:{
            message: err.message,
            stack: err.stack,
            code : err.code,
          }
          // errro is empty object
        }
      });
    }
  });


  app.post('/entities/:entityName', async (req, res) => {
    try {
      const entityName = req.params.entityName?.toLowerCase();
      // Check if the entityName is valid and exists in dataModels
      const entityModel = dataModels.find((model) => model.name?.toLowerCase() === entityName);
      if (!entityModel) {
        res.status(404).json({ error: 'Entity not found' });
        return;
      }

      // validate request body
      const fields = await dataAccess.getModelFields(entityModel);
      // ignore id field
      fields.shift();
      const body = req.body;
      const bodyKeys = Object.keys(body);
      const missingFields = fields.filter((field) => {
        return field.required && !bodyKeys.includes(field.name);
      });
      if (missingFields.length > 0) {
        res.status(400).json({ error: 'Missing required fields', fields: missingFields });
        return;
      }

      const repository = dataAccess.getRepository(entityModel); // Get the TypeORM repository

      // Create a new record using request body
      const newRecord = repository.create(req.body);

      // Save the new record
      const savedRecord = await repository.save(newRecord);
      res.status(201).json({ success: true, data: savedRecord });
    } catch (err) {
      console.error('Error adding data:', err);
      res.status(500).json({
        error: {
          message: 'An error occurred while fetching data',
          meta: { err }
        }
      });
    }
  });
  // get model fields
  app.get('/entities/:modelName/fields', async (req: Request, res: Response) => {
    try {
      const modelName = req.params.modelName?.toLowerCase();
      // Check if the modelName is valid and exists in dataModels
      const model = dataModels.find((m) => m.name?.toLowerCase() === modelName);
      if (!model) {
        res.status(404).json({ error: 'Model not found' });
        return;
      }

      // Fetch records from the data access layer based on the modelName
      const fields = await dataAccess.getModelFields(model); // Use appropriate method here

      // Process the records using the provided resources if needed
      // For example, you can transform the data before sending it to the client
      // const processedData = resources.processData(records);
      res.json({ data: fields });
    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).json({
        error: {
          message: 'An error occurred while fetching data',
          meta: { err }
        }
      });
    }
  });

  // Define a route to fetch a specific record of a specific model
  app.get('/entities/:modelName/:id', async (req: Request, res: Response) => {
    try {
      const modelName = req.params.modelName?.toLowerCase();
      // Check if the modelName is valid and exists in dataModels
      const model = dataModels.find((m) => m.name?.toLowerCase() === modelName);
      if (!model) {
        res.status(404).json({ error: 'Model not found' });
        return;
      }

      // Fetch the record from the data access layer based on the modelName and id
      const record = await dataAccess.getDataById(model, req.params.id); // Use appropriate method here

      // Process the record using the provided resources if needed
      // For example, you can transform the data before sending it to the client
      const processedData = resources.processData(record);
      res.json({ data: processedData });
    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).json({
        error: {
          message: 'An error occurred while fetching data',
          meta: { err }
        }
      });
    }
  });
  // Add other routes and middleware as needed for your backend
  // ...

  return app;
}
