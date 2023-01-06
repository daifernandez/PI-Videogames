const { Videogame, conn } = require("../../src/db.js");

describe("Videogame model", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  describe("Validators", () => {
    beforeEach(() => Videogame.sync({ force: true }));
    describe("create", () => {
      it("should work when its a valid", async (done) => {
        await Videogame.create({
          name: "Super Mario Bros",
          description: "simple game",
          platforms: ["Nintendo"],
          createdInDB: true,
        })
          .then(done())
          .catch((error) => done(new Error(error.message)));
      });
    });
    describe("name", () => {
      it("should throw an error if name is null", async (done) => {
        await Videogame.create({
          description: "simple game",
          platforms: ["Nintendo"],
          createdInDB: true,
        })
          .then(() => done(new Error("Expected to fail without a name")))
          .catch(done());
      });
    });
    describe("describe", () => {
      it("should throw an error if describe is null", (done) => {
        Videogame.create({
          name: "Super Mario Bros",
          platforms: ["Nintendo"],
          createdInDB: true,
        })
          .then(() => done(new Error("It requires description")))
          .catch(() => done());
      });
    });
    describe("platforms", () => {
      it("should throw an error if platforms is null", (done) => {
        Videogame.create({
          name: "Super Mario Bros",
          description: "simple game",
          createdInDB: true,
        })
          .then(() => done(new Error("It requires platforms")))
          .catch(() => done());
      });
    });
  });
});
