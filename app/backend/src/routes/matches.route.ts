import * as express from 'express';
import MatchesController from '../controllers/Matches.controller';
import { validateToken } from '../middlewares/validateToken';

const router = express.Router();

router
  .get('/matches', MatchesController.getAllMatches)
  .patch('/matches/:id', validateToken, MatchesController.updateMatchInProgress)
  .patch('/matches/:id/finish', validateToken, MatchesController.finishMatch);

export default router;
