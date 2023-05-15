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

  public static async finishMatchById(id: number): Promise<void> {
    try {
      const match = await Match.findByPk(id);
      if (!match) {
        throw new Error('Match not found');
      }
      match.inProgress = false;

      await match.save();
    } catch (error) {
      throw new Error('Failed to finish the match');
    }
  }
}

export default MatchesService;
