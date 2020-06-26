import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import * as UserController from './controllers/UserController';
import * as SessionController from './controllers/SessionController';
import SearchController from './controllers/SearchController';
import PhotoController from './controllers/PhotoController';
import authMiddle from './middlewares/auth';

const routes = new Router();

const uploadPhoto = multer(multerConfig);

routes.post('/user', UserController.store);
routes.get('/users', UserController.index);
routes.put('/user', authMiddle, UserController.update);
routes.delete('/user', authMiddle, UserController.deleteUser);

routes.post('/files', authMiddle, uploadPhoto.single('file'), PhotoController);
routes.post('/session', SessionController.store);
routes.post('/forgot', SessionController.forgot);
routes.post('/reset/:id', SessionController.reset);

routes.get('/search', SearchController);

export default routes;
