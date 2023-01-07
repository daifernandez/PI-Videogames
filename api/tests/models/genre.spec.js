const { Genre, conn } = require("../../src/db.js");

describe("Genre model", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  after(function () {
    Genre.sync({ force: true });
  });
  describe("Validators", () => {
    beforeEach(() => Genre.sync({ force: true }));
    describe("name", () => {
      it("should throw an error if name is null", async (done) => {
        await Genre.create({})
          .then(() => done(new Error("Expected to fail without a name")))
          .catch(done());
      });
      //testear que jun genero se puede crear cuando tiene nombre
      it("should be able to create a genre with name", async (done) => {
        await Genre.create({ name: "Action" })
          .then(done())
          .catch((error) => done(new Error(error.message)));
      });
    });
  });
});
