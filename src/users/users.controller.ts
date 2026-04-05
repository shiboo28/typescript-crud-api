import express from 'express';
import { type Request, type Response, type NextFunction } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import * as userService from './user.service';
import { Role } from '../_helpers/role';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

function createSchema(req: Request, res: Response, next: NextFunction): void {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(Role.Admin, Role.User).required()
  });
  validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
  const schema = Joi.object({
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    email: Joi.string().email().empty(''),
    password: Joi.string().min(6).empty(''),
    role: Joi.string().valid(Role.Admin, Role.User).empty('')
  });
  validateRequest(req, next, schema);
}

function getAll(req: Request, res: Response, next: NextFunction): void {
  userService.getAll().then(users => res.json(users)).catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
  userService.getById(Number(req.params.id)).then(user => res.json(user)).catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
  const params = { ...req.body, passwordHash: req.body.password };
  userService.create(params).then(result => res.json(result)).catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
  const params = req.body.password
    ? { ...req.body, passwordHash: req.body.password }
    : req.body;
  userService.update(Number(req.params.id), params).then(result => res.json(result)).catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
  userService._delete(Number(req.params.id)).then(result => res.json(result)).catch(next);
}