import { Json } from 'sequelize/types/utils';
import { DataSource, DataSourceOptions, EntityMetadata, getRepository, ObjectType, Repository } from 'typeorm';

interface TypeORMConfig {
  // Add any additional properties needed for the TypeORM configuration
}

class TypeORMDataAccess {
  private config: DataSourceOptions;
  private entities: ObjectType<any>[]; // Replace 'any' with the appropriate entity type
  private connection: any; // Replace 'any' with the appropriate connection type

  constructor(config: DataSourceOptions, entities: ObjectType<any>[]) {
    this.config = config;
    this.entities = entities;
  }

  async connect(): Promise<void> {
    try {
      const AppDataSource = new DataSource({
        ...this.config,
        entities: [...this.entities],
      });
      this.connection = AppDataSource

      await AppDataSource.initialize();
      console.log('Data Source has been connected!');
    } catch (err) {
      console.error('Error during Data Source connection:', err);
    }
  }

  getRepository(model: any): any {
    // Replace 'any' with the appropriate type for the model
    return this.connection.getRepository(model);
  }

  async getAllData(model: any, options: any = {}): Promise<{
    data: any[],
    total: number
  }> {
    const repository = this.getRepository(model);

    const { page = 1, perPage = 10, filter = {} } = options;

    // by default include all relations
    const include = options.include || repository.metadata.relations.map((relation: any) => relation.propertyName);

    // handle pagination
    const skip = (page - 1) * perPage;
    const take = perPage;

    const total = await repository.count({
      where: filter,
      relations: include
    });

    const records = await repository.find({
      skip,
      take,
      where: filter,
      relations: include
    });




    return {
      data: records,
      total: total
    }

  }


  async getModelData(model: any): Promise<any> {
    const repository: Repository<any> = this.getRepository(model);

    // return all related information(not records in the model) of the model including relations for the front end to be albe to build the form
    // i want to genreate form for create and update
    // i need to know the relations of the model
    // i need to know the columns of the model
    // i need to know the primary keys of the model


    const relations = repository.metadata.relations.map((relation: any) => relation.propertyName);
    const columns = repository.metadata.columns.map((column: any) => column.propertyName);
    const primaryKeys = repository.metadata.primaryColumns.map((column: any) => column.propertyName);
    const relationsMetadata = repository.metadata.relations.map((relation: any) => {
      return {
        propertyName: relation.propertyName,
        model: relation.inverseEntityMetadata.name,
        relatedTableName: relation.inverseEntityMetadata.tableName,
        relationType: relation.relationType
      }
    });

    // genrate the forms with required or not adn type 

    const forms = repository.metadata.columns.map((column: any) => {
      const relactionMetadata = relationsMetadata.find((relation: any) => relation.propertyName === column.propertyName);

      // return object on relation

      const field = {
        propertyName: column.propertyName,
        type: relactionMetadata ? 'object' : column.type,
        isNullable: column.isNullable,
        isPrimary: column.isPrimary,
        isGenerated: column.isGenerated,
        isUnique: column.isUnique,
        isBaseDate: column.isCreateDate || column.isUpdateDate || column.isDeleteDate,
        relationsMetadata: relactionMetadata
      }



      if (column.type === 'enum') {
        // add aray of enums to the field
        field['enums'] = column.enum.map((value: any) => value);
      }



      return field;
    });


    // add feilds to form for relations
    relationsMetadata.forEach((relation: any) => {
      const field = {
        propertyName: relation.propertyName,
        type: 'object',
        relationType: relation.relationType,
        isNullable: false,
        isPrimary: false,
        isGenerated: false,
        isUnique: false,
        isBaseDate: false,
        relationsMetadata: relation
      }
      forms.push(field);
    });

    // filter duplicated  fields
    const uniqueForms = forms.filter((field: any, index: number, self: any) =>

      index === self.findIndex((t: any) => (  
        t.propertyName === field.propertyName && t.type === field.type
      ))
    )
    
    return {
      forms: uniqueForms,
      relations: relations,
      columns: columns,
      primaryKeys: primaryKeys,
    }

  }






  async getDataById(model: any, id: string): Promise<any> {
    // Replace 'any' with the appropriate type for the model
    const repository = this.connection.getRepository(model);

    const relations = repository.metadata.relations.map((relation: any) => relation.propertyName);
    // get the data with relations
    const record = await repository.findOne({
      where: {
        id: id
      },
      relations: relations
    }
    );
    /// wich table each relation is related to
    const relationsMetadata = repository.metadata.relations.map((relation: any) => {
      return {
        propertyName: relation.propertyName,
        model: relation.inverseEntityMetadata.name,
        relatedTableName: relation.inverseEntityMetadata.tableName
      }
    });
    return {
      ...record,
      relationsMetadata: relationsMetadata
    };
  }

  getTableMetadata(model: any): {
    tableName: string,
    columns: string[],
    primaryKeys: string[],
    relations: string[],
    name: string
  } {
    // Replace 'any' with the appropriate type for the model
    const repository = this.connection.getRepository(model);
    const entityMetadata: EntityMetadata = repository.metadata;
    const metadata = {
      tableName: entityMetadata.tableName,
      columns: entityMetadata.columns.map(column => column.propertyName),
      primaryKeys: entityMetadata.primaryColumns.map(column => column.propertyName),
      relations: entityMetadata.relations.map(relation => relation.propertyName),
      name: entityMetadata.name
    }
    return metadata;
  }


  async createData(model: any, data: any): Promise<any> {
    // Replace 'any' with the appropriate type for the model
    const repository = this.connection.getRepository(model);

    const record = await repository.save(data);
    return record;
  }

  async updateData(model: any, id: string, data: any): Promise<any> {
    // Replace 'any' with the appropriate type for the model
    const repository = this.connection.getRepository(model);
    const record = await repository.update(id, data);
    return record;
  }

  async deleteData(model: any, id: string): Promise<any> {
    // Replace 'any' with the appropriate type for the model
    const repository = this.connection.getRepository(model);
    const record = await repository.delete(id);
    return record;
  }



}

export default TypeORMDataAccess;
