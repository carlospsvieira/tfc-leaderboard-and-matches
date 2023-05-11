import { Request, Response } from 'express';
import TeamService from '../services/Teams.service';

class TeamsController {
  public static async getAllTeams(_req: Request, res: Response): Promise<void> {
    try {
      const teams = await TeamService.getAllTeams();
      res.status(200).json(teams);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public static async getTeamById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const team = await TeamService.getTeamById(Number(id));
    console.log(team);

    if (team) {
      res.status(200).json(team);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  }
}

export default TeamsController;
