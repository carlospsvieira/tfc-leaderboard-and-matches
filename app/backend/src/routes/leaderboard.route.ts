import * as express from 'express';
import LeaderboardController from '../controllers/Leaderboard.controller';

const router = express.Router();

router
  .get('/leaderboard/home', LeaderboardController.getHomeLeaderboard);

export default router;
