import { Request, Response } from 'express';
import MatchesService from '../services/Matches.service';

class MatchesController {
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
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}

export default MatchesController;
