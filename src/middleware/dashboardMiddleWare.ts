import { createDataAccess } from '@atooldev/orm-data-access';
import express from 'express';
import {
  createEntity,
  deleteEntity,
  getModelFields,
  getSingleModelEntity,
  listEntities,
  listModelEntities,
  updateEntity,
} from '../services/dashboardService';
import { handleError } from '../utils/errorHandler';

const router = express.Router();

export default function createDashboardMiddleware(
  ormName: string,
  config: any, // Replace 'any' with the appropriate type for the ORM configuration
  dataModels: any[], // Replace 'any[]' with the appropriate type for the dataModels array
  resources: any // Replace 'any' with the appropriate type for the resources
) {
  // Create the data access object using the Data Access Factory and config
  const dataAccess = createDataAccess(ormName, {
    config,
    // Add any additional configuration needed here
    dataModels,
  });

  const connectionPromise = dataAccess.connect();

  connectionPromise
    .then(() => {
      console.log('Connected to the database using ' + ormName + '.');
    })
    .catch((err) => {
      console.error('Error connecting to the database:', err);
      process.exit(1);
    });

  // Define routes using the controller functions
  router.get('/entities', async (req, res) => {
    try {
      const models = await listEntities(dataAccess, dataModels);
      res.json(models);
    } catch (err) {
      handleError(res, err);
    }
  });

  router.get('/entities/:modelName', async (req, res) => {
    try {
      const { modelName } = req.params;
      const { page = 1, perPage = 10, filter, include } = req.query;

      const options = {
        page: +page,
        perPage: +perPage,
        filter: filter ? JSON.parse(filter.toString()) : undefined,
        include: include ? include.toString().split(',') : undefined,
      };

      const records = await listModelEntities(
        dataAccess,
        dataModels,
        modelName,
        options
      );

      const processedData = resources.processData(records);
      res.json({
        ...processedData,
        meta: {
          total: records.total,
          page: options.page,
          perPage: options.perPage,
        },
      });
    } catch (err) {
      handleError(res, err);
    }
  });

  router.post('/entities/:modelName', async (req, res) => {
    try {
      const { modelName } = req.params;
      const entityModel = await createEntity(
        dataAccess,
        dataModels,
        modelName,
        req.body
      );

      const processedData = resources.processData(entityModel);
      res.status(201).json({ success: true, data: processedData });
    } catch (err) {
      handleError(res, err);
    }
  });

  router.get('/entities/:modelName/fields', async (req, res) => {
    try {
      const { modelName } = req.params;
      const fields = await getModelFields(dataAccess, dataModels, modelName);
      res.json(fields);
    } catch (err) {
      handleError(res, err);
    }
  });

  router.get('/entities/:modelName/:id', async (req, res) => {
    try {
      const { modelName, id } = req.params;
      const record = await getSingleModelEntity(
        dataAccess,
        dataModels,
        modelName,
        id
      );

      const processedData = resources.processData(record);
      res.json({ ...processedData });
    } catch (err) {
      handleError(res, err);
    }
  });

  router.put('/entities/:modelName/:id', async (req, res) => {
    try {
      const { modelName, id } = req.params;
      const updatedRecord = await updateEntity(
        dataAccess,
        dataModels,
        modelName,
        id,
        req.body
      );

      const processedData = resources.processData(updatedRecord);
      res.status(200).json({ success: true, data: processedData });
    } catch (err) {
      handleError(res, err);
    }
  });

  router.delete('/entities/:modelName/:id', async (req, res) => {
    try {
      const { modelName, id } = req.params;
      await deleteEntity(dataAccess, dataModels, modelName, id);
      res.status(204).send(); // No content
    } catch (err) {
      handleError(res, err);
    }
  });

  // Add other routes and middleware as needed for your backend
  // ...

  return router;
}
