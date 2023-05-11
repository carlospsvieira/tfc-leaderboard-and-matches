import Team from '../database/models/Teams.model';

class TeamService {
  public static async getAllTeams(): Promise<Team[]> {
    try {
      const teams = await Team.findAll();
      return teams;
    } catch (error) {
      throw new Error('Failed to retrieve teams');
    }
  }

  public static async getTeamById(id: number): Promise<Team | null> {
    const team = await Team.findByPk(id);
    return team;
  }
}

export default TeamService;
