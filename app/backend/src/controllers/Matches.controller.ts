import { NextFunction, Request, Response } from 'express';
import MatchesService from '../services/Matches.service';
import Team from '../database/models/Teams.model';

class MatchesController {
  private static serverErrorMessage = 'Internal Server Error';

  public static async validateMatchInput(req: Request, res: Response, next: NextFunction) {
    const { homeTeamId, awayTeamId } = req.body;
    const errorMessage = 'It is not possible to create a match with two equal teams';

    const homeTeam = await Team.findByPk(homeTeamId);
    const awayTeam = await Team.findByPk(awayTeamId);

    if (!homeTeam || !awayTeam) {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }

    if (homeTeamId === awayTeamId) {
      return res.status(422).json({ message: errorMessage });
    }

    next();
  }

  public static getAllMatches = async (req: Request, res: Response) => {
    try {
      const { inProgress } = req.query;
      const matches = await MatchesService.getAllMatches();

      let filteredMatches = matches;

      if (inProgress === 'true') {
        filteredMatches = matches.filter((match) => match.inProgress);
      } else if (inProgress === 'false') {
        filteredMatches = matches.filter((match) => !match.inProgress);
      }

      res.json(filteredMatches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: this.serverErrorMessage });
    }
  };

  public static finishMatch = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await MatchesService.finishMatchById(Number(id));

      return res.status(200).json({ message: 'Finished' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: this.serverErrorMessage });
    }
  };

  public static updateMatchInProgress = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { homeTeamGoals, awayTeamGoals } = req.body;

      await MatchesService.updateMatchInProgress(Number(id), homeTeamGoals, awayTeamGoals);

      return res.status(200).json({ homeTeamGoals, awayTeamGoals });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: this.serverErrorMessage });
    }
  };

  public static createMatchInProgress = async (req: Request, res: Response) => {
    try {
      const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;

      const match = await MatchesService.createMatchInProgress(
        homeTeamId,
        awayTeamId,
        homeTeamGoals,
        awayTeamGoals,
      );

      return res.status(201).json(match);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: this.serverErrorMessage });
    }
  };
}

export default MatchesController;
