abstract class DataAccess {
  constructor() {
    if (new.target === DataAccess) {
      throw new Error('DataAccess is an abstract class and cannot be instantiated directly.');
    }
  }

  abstract connect(): Promise<void>;

  abstract getAllData(): Promise<any[]>;

  abstract getRepository(): any;

  abstract getModelFields(): Promise<any[]>;

  abstract getDataById(): Promise<any>;



  // You can replace 'any' with the appropriate type for your data.

  // Add other CRUD methods if needed: create, update, delete, etc.
}

export default DataAccess;
