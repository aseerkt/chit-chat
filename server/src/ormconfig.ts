import { ConnectionOptions } from 'typeorm';
import { __prod__ } from './constants';

export default {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: !__prod__,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscribers/**/*.js'],
  cli: {
    entitiesDir: './src/entities',
    migrationsDir: './src/migrations',
    subscribersDir: './src/subscribers',
  },
} as ConnectionOptions;
