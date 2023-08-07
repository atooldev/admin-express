import TypeORMDataAccess from './typeormDataAccess';
import SequelizeDataAccess from './sequelizeDataAccess';
import SQLDataAccess from './sqlDataAccess';

function createDataAccess(ormName: string, config: any, dataModels: any) {
  switch (ormName) {
    case 'typeorm':
      return new TypeORMDataAccess(config, dataModels);
    // case 'sequelize':
    //   return new SequelizeDataAccess(config, dataModels);
    // case 'sql':
    //   return new SQLDataAccess(config, dataModels);
    default:
      throw new Error('Unsupported ORM: ' + ormName);
  }
}

export default createDataAccess;
