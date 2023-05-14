import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/Teams.model';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams Model', () => {
  beforeEach(() => {
    sinon.stub(Team, 'findAll').resolves([
      { id: 1, teamName: 'Team 1' },
      { id: 2, teamName: 'Team 2' },
    ] as Team[]);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should retrieve all teams', async () => {
    const res: Response = await chai.request(app).get('/teams');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([
      { id: 1, teamName: 'Team 1' },
      { id: 2, teamName: 'Team 2' },
    ]);
  });

  it('should retrieve a single team by ID', async () => {
    const res: Response = await chai.request(app).get('/teams/1');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ id: 1, teamName: 'Team 1' });
  });
});