import Match from '../database/models/Matches.model';
import Team from '../database/models/Teams.model';

export interface TeamLeaderboard {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number,
  efficiency: string,
}

export interface TeamStats {
  totalGames: number;
  goalsFavor: number;
  goalsOwn: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
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

    const leaderboard: TeamLeaderboard[] = LeaderboardService.createLeaderboard(matches, teams);

    leaderboard.sort(LeaderboardService.compareTeams);

    return leaderboard;
  }

  private static createLeaderboard(matches: Match[], teams: Team[]): TeamLeaderboard[] {
    return teams.map((team) => {
      const teamMatches = LeaderboardService.getTeamMatches(matches, team.id);
      const teamStats = LeaderboardService.calculateTeamStats(teamMatches);
      const totalPoints = LeaderboardService.calculateTotalPoints(teamStats);
      const goalsBalance = LeaderboardService.calculateGoalsBalance(teamStats);
      const efficiency = LeaderboardService.calculateEfficiency(totalPoints, teamStats.totalGames);

      return {
        name: team.teamName,
        totalPoints,
        ...teamStats,
        goalsBalance,
        efficiency,
      };
    });
  }

  // Helper function 1: Get team matches
  private static getTeamMatches(matches: Match[], teamId: number): Match[] {
    return matches.filter((match) => match.homeTeamId === teamId && !match.inProgress);
  }

  // Helper function 2: Calculate team statistics
  private static calculateTeamStats(matches: Match[]): TeamStats {
    const totalGames = matches.length;
    const goalsFavor = matches.reduce((total, match) => total + match.homeTeamGoals, 0);
    const goalsOwn = matches.reduce((total, match) => total + match.awayTeamGoals, 0);
    const totalVictories = matches.reduce(
      (total, match) => (match.homeTeamGoals > match.awayTeamGoals ? total + 1 : total),
      0,
    );
    const totalDraws = matches.reduce((total, match) => (match
      .homeTeamGoals === match.awayTeamGoals ? total + 1 : total), 0);
    const totalLosses = totalGames - totalVictories - totalDraws;

    return {
      totalGames,
      goalsFavor,
      goalsOwn,
      totalVictories,
      totalDraws,
      totalLosses,
    };
  }

  private static calculateTotalPoints(teamStats: TeamStats): number {
    return teamStats.totalVictories * 3 + teamStats.totalDraws;
  }

  private static calculateGoalsBalance(teamStats: TeamStats): number {
    return teamStats.goalsFavor - teamStats.goalsOwn;
  }

  private static calculateEfficiency(totalPoints: number, totalGames: number): string {
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
    return efficiency;
  }

  private static compareTeams(a: TeamLeaderboard, b: TeamLeaderboard): number {
    if (a.totalPoints > b.totalPoints) {
      return -1;
    } if (a.totalPoints < b.totalPoints) {
      return 1;
    }
    const goalDiffA = a.goalsFavor - a.goalsOwn;
    const goalDiffB = b.goalsFavor - b.goalsOwn;

    if (goalDiffA > goalDiffB) {
      return -1;
    } if (goalDiffA < goalDiffB) {
      return 1;
    }
    if (a.goalsFavor > b.goalsFavor) {
      return -1;
    } if (a.goalsFavor < b.goalsFavor) {
      return 1;
    }
    return 0;
  }
}

export default LeaderboardService;
