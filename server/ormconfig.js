const __prod__ = process.env.NODE_ENV === 'production';

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: !__prod__,
  logging: !__prod__,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscribers/**/*.js'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
};
