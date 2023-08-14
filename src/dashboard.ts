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

    const models = dataModels.map((model) => {
      return dataAccess.getTableMetadata(model);
    });

    res.json({ data:models  });
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
          meta: {
            message: err.message,
            stack: err.stack,
            code: err.code,
          }
          // errro is empty object
        }
      });
    }
  });


  app.post('/entities/:modelName', async (req, res) => {
    try {
      const entityName = req.params.modelName?.toLowerCase();
      // Check if the entityName is valid and exists in dataModels
      const entityModel = dataModels.find((model) => model.name?.toLowerCase() === entityName);
      if (!entityModel) {
        res.status(404).json({ error: 'Entity not found' });
        return;
      }
      const body = req.body;

      // create record
      const newRecord = await dataAccess.createData(entityModel, body);

      // Process the records using the provided resources if needed
      // For example, you can transform the data before sending it to the client
      const processedData = resources.processData(newRecord);

      res.status(201).json({ success: true, data: processedData });
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
      const fields = await dataAccess.getModelData(model); // Use appropriate method here
      
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

  // update 
  app.put('/entities/:modelName/:id', async (req, res) => {
    try {
      const entityName = req.params.modelName?.toLowerCase();
      // Check if the entityName is valid and exists in dataModels
      const entityModel = dataModels.find((model) => model.name?.toLowerCase() === entityName);
      if (!entityModel) {

        res.status(404).json({ error: 'Entity not found' });
        return;
      }

      // update record
      const updatedRecord = await dataAccess.updateData(entityModel, req.params.id, req.body);

      // Process the records using the provided resources if needed
      // For example, you can transform the data before sending it to the client
      const processedData = resources.processData(updatedRecord);

      res.status(200).json({ success: true, data: processedData });

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

  // delete
  app.delete('/entities/:modelName/:id', async (req, res) => {
    try {
      const entityName = req.params.modelName?.toLowerCase();
      // Check if the entityName is valid and exists in dataModels
      const entityModel = dataModels.find((model) => model.name?.toLowerCase() === entityName);
      if (!entityModel) {
        res.status(404).json({ error: 'Entity not found' });
        return;
      }

      // delete record
      const deletedRecord = await dataAccess.deleteData(entityModel, req.params.id);

      // Process the records using the provided resources if needed
      // For example, you can transform the data before sending it to the client
      const processedData = resources.processData(deletedRecord);

      // deleted  doesn't return anything just send deleted status
      res.status(204)

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





  // Add other routes and middleware as needed for your backend
  // ...

  return app;
}
