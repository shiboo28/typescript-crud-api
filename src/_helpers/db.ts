import { Sequelize } from 'sequelize';
import { initUserModel, User } from '../users/user.model';

const config = require('../../config.json');

export interface Database {
  sequelize: Sequelize;
  User: typeof User;
}

const db = {} as Database;

export async function initialize(): Promise<void> {
  const { host, port, user, password, database } = config.database;
  const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'mysql',
    logging: false
  });

  db.sequelize = sequelize;
  initUserModel(sequelize);
  db.User = User;

  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log('✅ Database connected and synced');
}

export default db;