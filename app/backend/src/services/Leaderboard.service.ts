import Match from '../database/models/Matches.model';
import Team from '../database/models/Teams.model';

interface TeamLeaderboard {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
}

class LeaderboardService {
  public static async getHomeLeaderboard(): Promise<TeamLeaderboard[]> {
    const matches = await Match.findAll({
      include: [
        { association: Match.associations.homeTeam, attributes: ['teamName'] },
        { association: Match.associations.awayTeam, attributes: ['teamName'] },
      ],
    });

    const teams = await Team.findAll();

    const leaderboard: TeamLeaderboard[] = [];

    teams.forEach((team) => {
      const teamMatches = LeaderboardService.getTeamMatches(matches, team.id);
      const teamLeaderboard = LeaderboardService.calculateTeamPerformance(team, teamMatches);

      leaderboard.push(teamLeaderboard);
    });

    return leaderboard;
  }

  private static getTeamMatches(matches: Match[], teamId: number): Match[] {
    return matches.filter((match) => match.homeTeamId === teamId && !match.inProgress);
  }

  private static calculateTeamPerformance(team: Team, matches: Match[]): TeamLeaderboard {
    const totalGames = matches.length;
    const goalsFavor = LeaderboardService.calculateGoalsFavor(matches);
    const goalsOwn = LeaderboardService.calculateGoalsOwn(matches);
    const totalVictories = LeaderboardService.calculateTotalVictories(matches);
    const totalDraws = LeaderboardService.calculateTotalDraws(matches);
    const totalLosses = LeaderboardService
      .calculateTotalLosses(totalGames, totalVictories, totalDraws);
    const totalPoints = LeaderboardService.calculateTotalPoints(totalVictories, totalDraws);

    return {
      name: team.teamName,
      totalPoints,
      totalGames,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
    };
  }

  private static calculateGoalsFavor(matches: Match[]): number {
    return matches.reduce((total, match) => total + match.homeTeamGoals, 0);
  }

  private static calculateGoalsOwn(matches: Match[]): number {
    return matches.reduce((total, match) => total + match.awayTeamGoals, 0);
  }

  private static calculateTotalVictories(matches: Match[]): number {
    return matches.filter((match) => match.homeTeamGoals > match.awayTeamGoals).length;
  }

  private static calculateTotalDraws(matches: Match[]): number {
    return matches.filter((match) => match.homeTeamGoals === match.awayTeamGoals).length;
  }

  private static calculateTotalLosses(
    totalGames: number,
    totalVictories: number,
    totalDraws: number,
  ): number {
    return totalGames - totalVictories - totalDraws;
  }

  private static calculateTotalPoints(totalVictories: number, totalDraws: number): number {
    return totalVictories * 3 + totalDraws;
  }
}

export default LeaderboardService;
