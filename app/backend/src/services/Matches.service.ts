import Match from '../database/models/Matches.model';

class MatchesService {
  public static async getAllMatches(): Promise<Match[]> {
    try {
      const matches = await Match.findAll({
        include: [
          { association: Match.associations.homeTeam, attributes: ['teamName'] },
          { association: Match.associations.awayTeam, attributes: ['teamName'] },
        ],
      });

      return matches;
    } catch (error) {
      throw new Error('Failed to fetch matches');
    }
  }
}

export default MatchesService;
