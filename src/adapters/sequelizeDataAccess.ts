import { QueryTypes, Sequelize } from 'sequelize';
import DataAccess from './dataAccess';

interface SequelizeConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  // Add other necessary properties as needed
}

class SequelizeDataAccess extends DataAccess {
  private sequelize: Sequelize;

  constructor(config: SequelizeConfig) {
    super();
    this.sequelize = new Sequelize(config.database, config.username, config.password, {
      ...config,
      host: config.host,
    });
  }

  async connect(): Promise<void> {
    await this.sequelize.authenticate();
  }

  async getAllData(): Promise<any[]> {
    return this.sequelize.query('SELECT * FROM data', { type: QueryTypes.SELECT });
  }

  // Add other CRUD methods if needed
}

export default SequelizeDataAccess;
