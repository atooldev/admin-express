import { DataSource, DataSourceOptions, getRepository, ObjectType } from 'typeorm';

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
  async getAllData(model: any, options: any = {}): Promise<{
    data: any[],
    total: number
  }> {
    const repository = this.getRepository(model);

    const { page = 1, perPage = 10, filter = {}, include = [] } = options;

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

  async getModelFields(model: any): Promise<any[]> {
    const repository = this.getRepository(model);
    const fields = await Promise.all(
      repository.metadata.columns.map(async (column: any) => {
        const type = column.type;

        let typeName = type.name;

        if (type instanceof Object) {
          if (type.constructor && type.constructor.name === 'Array') {
            typeName = 'array';
          } else if (type.constructor && type.constructor.name === 'Object') {
            typeName = 'object';
          }
        }

        const field: any = {
          name: column.propertyName,
          type: typeName?.toLowerCase(),
          required: !column.isNullable,
        };
        if (column.type === 'enum') {
          console.log('column', column);
          field.enum = column.enum;
        }

        if (column.referencedColumn && column.referencedColumn.propertyName) {
          field.relation = {
            type: 'foreign_key',
            target: column.referencedColumn.propertyName,
          };
        }

        return field;
      })
    );

    return fields;
  }

  getRepository(model: any): any {
    // Replace 'any' with the appropriate type for the model
    return this.connection.getRepository(model);
  }

  async getDataById(model: any, id: string): Promise<any> {
    // Replace 'any' with the appropriate type for the model
    const repository = this.connection.getRepository(model);
    // Error fetching data from the database: Error: You must provide selection conditions in order to find a single row.

    const record = await repository.findOne({
      where: {
        id: id
      }
    });

    return record;
  }

  // Add other CRUD methods if needed

}

export default TypeORMDataAccess;
