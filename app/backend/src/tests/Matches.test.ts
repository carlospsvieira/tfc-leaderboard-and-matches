import * as sinon from "sinon";
import * as chai from "chai";
// @ts-ignore
import chaiHttp = require("chai-http");
import Match from "../database/models/Matches.model";
import { app } from "../app";
import { Response } from "superagent";

chai.use(chaiHttp);

const { expect } = chai;

describe("Matches Service", () => {
  beforeEach(() => {
    sinon.stub(Match, "findAll").resolves([
      { id: 1, homeTeam: "Team 1", awayTeam: "Team 2", date: "2023-05-14" },
      { id: 2, homeTeam: "Team 3", awayTeam: "Team 4", date: "2023-05-15" },
    ] as unknown as Match[]);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should retrieve all matches", async () => {
    const res: Response = await chai.request(app).get("/matches");

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([
      { id: 1, homeTeam: "Team 1", awayTeam: "Team 2", date: "2023-05-14" },
      { id: 2, homeTeam: "Team 3", awayTeam: "Team 4", date: "2023-05-15" },
    ]);
  });

  it("should retrieve a single match by ID", async () => {
    const res: Response = await chai.request(app).get("/matches/1");

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      id: 1,
      homeTeam: "Team 1",
      awayTeam: "Team 2",
      date: "2023-05-14",
    });
  });

  it("should create a new match", async () => {
    const matchData = {
      homeTeam: "Team 5",
      awayTeam: "Team 6",
      date: "2023-05-16",
    };

    sinon
      .stub(Match, "create")
      .resolves({ id: 3, ...matchData } as unknown as Match);

    const res: Response = await chai
      .request(app)
      .post("/matches")
      .send(matchData);

    expect(res.status).to.equal(201);
    expect(res.body).to.deep.equal({ id: 3, ...matchData });
  });

  it("should update an existing match", async () => {
    const updatedMatchData = {
      id: 1,
      homeTeam: "Team A",
      awayTeam: "Team B",
      date: "2023-05-14",
    };

    sinon.stub(Match, "update").resolves([1]);

    const res: Response = await chai
      .request(app)
      .put("/matches/1")
      .send(updatedMatchData);

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(updatedMatchData);
  });

  it("should delete a match", async () => {
    sinon.stub(Match, "destroy").resolves(1);

    const res: Response = await chai.request(app).delete("/matches/1");

    expect(res.status).to.equal(204);
    expect(res.text).to.be.empty;
  });

  it("should return an error if required fields are missing", async () => {
    const matchData = {
      awayTeam: "Team 7",
      date: "2023-05-17",
    };

    const res: Response = await chai
      .request(app)
      .post("/matches")
      .send(matchData);

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: "Missing required fields" });
  });

  it("should return an error if the provided date is invalid", async () => {
    const matchData = {
      homeTeam: "Team 8",
      awayTeam: "Team 9",
      date: "2023-05-32",
    };

    const res: Response = await chai
      .request(app)
      .post("/matches")
      .send(matchData);

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: "Invalid date format" });
  });

  it("should return an error if the match ID is not provided", async () => {
    const updatedMatchData = {
      homeTeam: "Team C",
      awayTeam: "Team D",
      date: "2023-05-14",
    };

    const res: Response = await chai
      .request(app)
      .put("/matches")
      .send(updatedMatchData);

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: "Match ID is required" });
  });

  it("should return an error if the match ID does not exist", async () => {
    const updatedMatchData = {
      id: 100,
      homeTeam: "Team C",
      awayTeam: "Team D",
      date: "2023-05-14",
    };

    const res: Response = await chai
      .request(app)
      .put("/matches/100")
      .send(updatedMatchData);

    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({ error: "Match not found" });
  });
});

it("should return an error if the match ID does not exist", async () => {
  const res: Response = await chai.request(app).delete("/matches/100");

  expect(res.status).to.equal(404);
  expect(res.body).to.deep.equal({ error: "Match not found" });
});
