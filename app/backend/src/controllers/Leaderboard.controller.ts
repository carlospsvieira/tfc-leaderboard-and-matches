import { Request, Response } from 'express';
import LeaderboardService, { TeamLeaderboard } from '../services/Leaderboard.service';

class LeaderboardController {
  public static async getHomeLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const leaderboard: TeamLeaderboard[] = await LeaderboardService.getHomeLeaderboard();
      res.status(200).json(leaderboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default LeaderboardController;
