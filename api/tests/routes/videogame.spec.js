/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Videogame, conn } = require("../../src/db.js");
const { v4: uuidv4 } = require("uuid");

const agent = session(app);
const videogame = {
  id: uuidv4(),
  name: "Super Mario Bros",
  image: null,
  description: "Plataformer from Japan",
  released: null,
  rating: null,
  platforms: ["Super Nintendo"],
  genres: [],
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
  // describe("GET /videogames", () => {
  //   it("should get 200", function (done) {
  //     agent
  //       .get("/videogames")
  //       .set("Accept", "application/json")
  //       .expect(200)
  //       .end(function (err, res) {
  //         const content = JSON.parse(res.text);
  //         expect(content).to.be.a("array");
  //         expect(content).to.deep.include(videogame);
  //         done();
  //       });
  //   });
  // });

  // POST VIDEOGAMES

  // GET VIDEOGAME ID

  // DELETE VIDEOGAME ID
});
