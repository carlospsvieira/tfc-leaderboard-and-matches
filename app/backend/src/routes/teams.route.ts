import * as express from 'express';
import TeamsController from '../controllers/Teams.controller';

const router = express.Router();

router
  .get('/teams', TeamsController.getAllTeams)
  .get('/teams/:id', TeamsController.getTeamById);

export default router;
