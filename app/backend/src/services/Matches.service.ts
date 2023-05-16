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

  public static async updateMatchInProgress(
    id: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<void> {
    try {
      const match = await Match.findByPk(id);
      if (!match) {
        throw new Error('Match not found');
      }

      match.homeTeamGoals = homeTeamGoals;
      match.awayTeamGoals = awayTeamGoals;

      await match.save();
    } catch (error) {
      throw new Error('Failed to update match in progress');
    }
  }

  public static async createMatchInProgress(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<Match> {
    try {
      const match = await Match.create({
        homeTeamId,
        awayTeamId,
        homeTeamGoals,
        awayTeamGoals,
        inProgress: true,
      });

      return match;
    } catch (error) {
      throw new Error('Failed to create match in progress');
    }
  }
}

export default MatchesService;
