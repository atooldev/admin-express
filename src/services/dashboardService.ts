export async function listEntities(
  dataAccess: any, // Replace 'any' with appropriate type
  dataModels: any[] // Replace 'any[]' with appropriate type
) {
  const models = await Promise.all(
    dataModels.map((model) => dataAccess.getTableMetadata(model))
  );

  return { data: models };
}

export async function listModelEntities(
  dataAccess: any, // Replace 'any' with appropriate type
  dataModels: any[], // Replace 'any[]' with appropriate type
  modelName: string,
  options: any // Replace 'any' with appropriate type for options
) {
  const model = dataModels.find(
    (m) => m.name?.toLowerCase() === modelName.toLowerCase()
  );

  if (!model) {
    throw new Error('Model not found');
  }

  const records = await dataAccess.getAllData(model, options);
  return {
    ...records,
    meta: {
      total: records.total,
      page: options.page,
      perPage: options.perPage,
    },
  };
}

export async function createEntity(
  dataAccess: any, // Replace 'any' with appropriate type
  dataModels: any[], // Replace 'any[]' with appropriate type
  entityName: string,
  body: any // Replace 'any' with appropriate type for the request body
) {
  const entityModel = dataModels.find(
    (model) => model.name?.toLowerCase() === entityName.toLowerCase()
  );

  if (!entityModel) {
    throw new Error('Entity not found');
  }

  const newRecord = await dataAccess.createData(entityModel, body);
  return newRecord;
}

export async function getModelFields(
  dataAccess: any, // Replace 'any' with appropriate type
  dataModels: any[], // Replace 'any[]' with appropriate type
  modelName: string
) {
  const model = dataModels.find(
    (m) => m.name?.toLowerCase() === modelName.toLowerCase()
  );

  if (!model) {
    throw new Error('Model not found');
  }

  const fields = await dataAccess.getModelData(model); // Use appropriate method here
  return { data: fields };
}

export async function getSingleModelEntity(
  dataAccess: any, // Replace 'any' with appropriate type
  dataModels: any[], // Replace 'any[]' with appropriate type
  modelName: string,
  id: string
) {
  const model = dataModels.find(
    (m) => m.name?.toLowerCase() === modelName.toLowerCase()
  );

  if (!model) {
    throw new Error('Model not found');
  }

  const record = await dataAccess.getDataById(model, id); // Use appropriate method here
  return { data: record };
}

export async function updateEntity(
  dataAccess: any, // Replace 'any' with appropriate type
  dataModels: any[], // Replace 'any[]' with appropriate type
  entityName: string,
  id: string,
  body: any // Replace 'any' with appropriate type for the request body
) {
  const entityModel = dataModels.find(
    (model) => model.name?.toLowerCase() === entityName.toLowerCase()
  );

  if (!entityModel) {
    throw new Error('Entity not found');
  }

  const updatedRecord = await dataAccess.updateData(entityModel, id, body);
  return updatedRecord;
}

export async function deleteEntity(
  dataAccess: any, // Replace 'any' with appropriate type
  dataModels: any[], // Replace 'any[]' with appropriate type
  entityName: string,
  id: string
) {
  const entityModel = dataModels.find(
    (model) => model.name?.toLowerCase() === entityName.toLowerCase()
  );

  if (!entityModel) {
    throw new Error('Entity not found');
  }

  await dataAccess.deleteData(entityModel, id);
  return { success: true };
}

// Add other controller functions as needed
