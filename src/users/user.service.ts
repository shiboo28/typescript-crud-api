import bcrypt from 'bcryptjs';
import db from '../_helpers/db';
import { UserCreationAttributes } from './user.model';

export async function getAll() {
  return db.User.findAll();
}

export async function getById(id: number) {
  const user = await db.User.findByPk(id);
  if (!user) throw new Error('User not found');
  return user;
}

export async function create(params: UserCreationAttributes) {
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw new Error(`Email "${params.email}" is already registered`);
  }
  const user = new db.User(params);
  user.passwordHash = await bcrypt.hash(params.passwordHash, 10);
  await user.save();
  return { message: 'User created successfully' };
}

export async function update(id: number, params: Partial<UserCreationAttributes>) {
  const user = await db.User.scope('withHash').findByPk(id);
  if (!user) throw new Error('User not found');
  if (params.passwordHash) {
    params.passwordHash = await bcrypt.hash(params.passwordHash, 10);
  }
  await user.update(params);
  return { message: 'User updated successfully' };
}

export async function _delete(id: number) {
  const user = await db.User.findByPk(id);
  if (!user) throw new Error('User not found');
  await user.destroy();
  return { message: 'User deleted successfully' };
}