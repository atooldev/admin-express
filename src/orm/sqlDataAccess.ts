import { ConnectionConfig, createConnection, QueryError, RowDataPacket } from 'mysql';
import DataAccess from './dataAccess';

interface SQLConfig extends ConnectionConfig {
  // Add any additional properties needed for the SQL configuration
}

class SQLDataAccess extends DataAccess {
  private connection: ReturnType<typeof createConnection>;

  constructor(config: SQLConfig) {
    super();
    this.connection = createConnection({
      ...config,
    });
  }

  connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  getAllData(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      // get all records from the table
      this.connection.query('SELECT * FROM data', (err: QueryError | null, results?: RowDataPacket[]) => {
        if (err) reject(err);
        else resolve(results || []);
      });
    });
  }

  // Add other CRUD methods if needed
}

export default SQLDataAccess;
