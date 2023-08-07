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

  async getAllData(model: any): Promise<any[]> {
    // Replace 'any' with the appropriate type for the model
    const repository = this.connection.getRepository(model);
    const records = await repository.find();
    return records;
  }

   getRepository(model: any): any{
    // Replace 'any' with the appropriate type for the model
    return this.connection.getRepository(model);
  }
  // Add other CRUD methods if needed

}

export default TypeORMDataAccess;
