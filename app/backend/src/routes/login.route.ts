import * as express from 'express';
import { validateToken, getRole } from '../middlewares/validateToken';
import LoginController from '../controllers/Login.controller';

const router = express.Router();

router
  .post('/login', LoginController.login)
  .get('/login/role', validateToken, getRole);

export default router;
