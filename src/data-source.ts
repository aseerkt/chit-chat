import { DataSource } from 'typeorm';
import ormconfig from './ormconfig';

export const AppDataSource = new DataSource(ormconfig);
