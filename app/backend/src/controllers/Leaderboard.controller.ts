import { Request, Response } from 'express';
import LeaderboardService from '../services/Leaderboard.service';

class LeaderboardController {
  public static async getHomeLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const leaderboard = await LeaderboardService.getHomeLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  }
}

export default LeaderboardController;
