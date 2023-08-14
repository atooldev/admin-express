import { Request } from 'express';
import DataAccess from './adapters/dataAccess'; // Import the appropriate type for your data access object

declare global {
    namespace Express {
        interface Request {
            dataAccess: DataAccess;
        }
    }
}