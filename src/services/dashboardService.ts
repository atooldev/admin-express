
export async function listEntities(
    dataAccess: any, // Replace 'any' with appropriate type
    dataModels: any[] // Replace 'any[]' with appropriate type
) {
    try {
        const models = await Promise.all(
            dataModels.map((model) => dataAccess.getTableMetadata(model))
        );

        return { data: models };
    } catch (err) {
        throw err;
    }
}

export async function listModelEntities(
    dataAccess: any, // Replace 'any' with appropriate type
    dataModels: any[], // Replace 'any[]' with appropriate type
    modelName: string,
    options: any // Replace 'any' with appropriate type for options
) {
    try {
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
    } catch (err) {
        throw err;
    }
}

export async function createEntity(
    dataAccess: any, // Replace 'any' with appropriate type
    dataModels: any[], // Replace 'any[]' with appropriate type
    entityName: string,
    body: any // Replace 'any' with appropriate type for the request body
) {
    try {
        const entityModel = dataModels.find(
            (model) => model.name?.toLowerCase() === entityName.toLowerCase()
        );

        if (!entityModel) {
            throw new Error('Entity not found');
        }

        const newRecord = await dataAccess.createData(entityModel, body);
        return newRecord;
    } catch (err) {
        throw err;
    }
}

export async function getModelFields(
    dataAccess: any, // Replace 'any' with appropriate type
    dataModels: any[], // Replace 'any[]' with appropriate type
    modelName: string
) {
    try {
        const model = dataModels.find(
            (m) => m.name?.toLowerCase() === modelName.toLowerCase()
        );

        if (!model) {
            throw new Error('Model not found');
        }

        const fields = await dataAccess.getModelData(model); // Use appropriate method here
        return { data: fields };
    } catch (err) {
        throw err;
    }
}

export async function getSingleModelEntity(
    dataAccess: any, // Replace 'any' with appropriate type
    dataModels: any[], // Replace 'any[]' with appropriate type
    modelName: string,
    id: string
) {
    try {
        const model = dataModels.find(
            (m) => m.name?.toLowerCase() === modelName.toLowerCase()
        );

        if (!model) {
            throw new Error('Model not found');
        }

        const record = await dataAccess.getDataById(model, id); // Use appropriate method here
        return { data: record };
    } catch (err) {
        throw err;
    }
}

export async function updateEntity(
    dataAccess: any, // Replace 'any' with appropriate type
    dataModels: any[], // Replace 'any[]' with appropriate type
    entityName: string,
    id: string,
    body: any // Replace 'any' with appropriate type for the request body
) {
    try {
        const entityModel = dataModels.find(
            (model) => model.name?.toLowerCase() === entityName.toLowerCase()
        );

        if (!entityModel) {
            throw new Error('Entity not found');
        }

        const updatedRecord = await dataAccess.updateData(entityModel, id, body);
        return updatedRecord;
    } catch (err) {
        throw err;
    }
}

export async function deleteEntity(
    dataAccess: any, // Replace 'any' with appropriate type
    dataModels: any[], // Replace 'any[]' with appropriate type
    entityName: string,
    id: string
) {
    try {
        const entityModel = dataModels.find(
            (model) => model.name?.toLowerCase() === entityName.toLowerCase()
        );

        if (!entityModel) {
            throw new Error('Entity not found');
        }

        await dataAccess.deleteData(entityModel, id);
        return { success: true };
    } catch (err) {
        throw err;
    }
}

// Add other controller functions as needed
