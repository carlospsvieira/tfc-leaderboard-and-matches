import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignoreW
import chaiHttp = require('chai-http');
import { Response } from 'superagent';

import { app } from '../app';
import Match from '../database/models/Matches.model';
import Team from '../database/models/Teams.model';

chai.use(chaiHttp);

const { expect } = chai;

describe('Leaderboard API', () => {
  let matchFindAllStub: sinon.SinonStub;
  let teamFindAllStub: sinon.SinonStub;

  beforeEach(() => {
    matchFindAllStub = sinon.stub(Match, 'findAll');
    teamFindAllStub = sinon.stub(Team, 'findAll');
  });

  afterEach(() => {
    matchFindAllStub.restore();
    teamFindAllStub.restore();
  });

  it('should retrieve the home leaderboard', async () => {
    // Sample match and team data for testing
    const matches = [
      {
        id: 1,
        homeTeamId: 1,
        homeTeamGoals: 3,
        awayTeamId: 2,
        awayTeamGoals: 2,
        inProgress: false,
        homeTeam: { teamName: 'Team A' },
        awayTeam: { teamName: 'Team B' },
      },
      {
        id: 2,
        homeTeamId: 2,
        homeTeamGoals: 1,
        awayTeamId: 1,
        awayTeamGoals: 2,
        inProgress: false,
        homeTeam: { teamName: 'Team B' },
        awayTeam: { teamName: 'Team A' },
      },
    ];
    const teams = [
      { id: 1, teamName: 'Team A' },
      { id: 2, teamName: 'Team B' },
    ];

    matchFindAllStub.resolves(matches);
    teamFindAllStub.resolves(teams);

    const res: Response = await chai.request(app).get('/leaderboard/home');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').with.length(2);

    const leaderboard = res.body;
    expect(leaderboard[0].name).to.equal('Team A');
    expect(leaderboard[1].name).to.equal('Team B');

    expect(leaderboard[0].totalPoints).to.equal(4);
    expect(leaderboard[0].totalGames).to.equal(2);
    expect(leaderboard[0].totalVictories).to.equal(1);
    expect(leaderboard[0].totalDraws).to.equal(0);
    expect(leaderboard[0].totalLosses).to.equal(1);
    expect(leaderboard[0].goalsFavor).to.equal(4);
    expect(leaderboard[0].goalsOwn).to.equal(4);
    expect(leaderboard[0].goalsBalance).to.equal(0);
    expect(leaderboard[0].efficiency).to.equal('33.33');
  });
});
