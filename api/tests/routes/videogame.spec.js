/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Videogame, conn } = require("../../src/db.js");

const agent = session(app);
const videogame = {
  name: "Super Mario Bros",
  description: "Plataformer from Japan",
  platforms: ["Super Nintendo"],
  createdInDB: true,
};

describe("Videogame routes", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() =>
    Videogame.sync({ force: true }).then(() => Videogame.create(videogame))
  );

  // GET VIDEOGAMES
  describe("GET /videogames", () => {
    it("should get 200", () => agent.get("/videogames").expect(200));
  });

  // POST VIDEOGAMES

  // GET VIDEOGAME ID

  // DELETE VIDEOGAME ID

  // PUT VIDEOGAME ID -> EN CASO DE HACERLO ?
});
