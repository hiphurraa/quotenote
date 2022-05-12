import chai from "chai";
import chatHttp from "chai-http";
import "chai/register-should.js";
import app from "../server.js";
import { dropData } from './testUtils.js';

chai.use(chatHttp);

const { expect } = chai;



describe("Testing the registration endpoint:", () => {

  before(async () => {
    await dropData();
  });

  it("It should register a new user", (done) => {
    const userData = {
      name: "Test user",
      email: "test@email.com",
      password: "samePassword",
      password2: "samePassword",
    };
    chai
      .request(app)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.include({ message: "User registered" });
        done();
      });
  });
  it("It shouldn't register new user with same details", (done) => {
    const userData = {
      name: "Test user",
      email: "test@email.com",
      password: "samePassword",
      password2: "samePassword",
    };
    chai
      .request(app)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.include({ email: "Email already in use" });
        expect(res.body).to.include({ name: "Name already in use" });
        done();
      });
  });
  it("It shouldn't register a new user when email field is missing", (done) => {
    const userData = {
      name: "TestUserWithMissingEmail",
      password: "samePassword",
      password2: "samePassword",
    };
    chai
      .request(app)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.include({ email: "Email field is required!" });
        done();
      });
  });
  it("It shouldn't register a new user when name field is missing", (done) => {
    const userData = {
      email: "randomEmailMissingName@email.com",
      password: "samePassword",
      password2: "samePassword",
    };
    chai
      .request(app)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.include({ name: "Name field is required!" });
        done();
      });
  });
  it("It shouldn't register a new user when password field is missing", (done) => {
    const userData = {
      name: "RandomUserMissingPas",
      email: "randomEmailMissingPassword@email.com",
      password2: "missingPassword",
    };
    chai
      .request(app)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.include({
          password: "Password field is required!",
        });
        expect(res.body).to.include({
          passwordLength: "Password must be atleast 6 characters",
        });
        expect(res.body).to.include({ passwordMatch: "Passwords must match" });
        done();
      });
  });
  it("It shouldn't register a new user when password2 field is missing", (done) => {
    const userData = {
      name: "RandomUserMissingPas",
      email: "randomEmailMissingPassword@email.com",
      password: "missingPassword2",
    };
    chai
      .request(app)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.include({
          password2: "Password confirmation field is required!",
        });
        expect(res.body).to.include({ passwordMatch: "Passwords must match" });
        done();
      });
  });
  it("It should register a new user with unique details", (done) => {
    const userData = {
      name: "Test user1",
      email: "test1@email.com",
      password: "same1Password",
      password2: "same1Password",
    };
    chai
      .request(app)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.include({ message: "User registered" });
        done();
      });
  });
  it("It should register a new user with unique details", (done) => {
    const userData = {
      name: "Test user2",
      email: "test2@email.com",
      password: "samePassword",
      password2: "samePassword",
    };
    chai
      .request(app)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.include({ message: "User registered" });
        done();
      });
  });
  it("It shouldn't register a user with invalid email address", (done) => {
    const userData = {
      name: "Test user",
      email: "test14123@",
      password: "samePassword",
      password2: "samePassword",
    };
    chai
      .request(app)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.include({ email: "Email field is invalid!" });
        done();
      });
  });
  it("It shouldn't register a user with used name", (done) => {
    const userData = {
      name: "Test user",
      email: "test14123@email.com",
      password: "samePassword",
      password2: "samePassword",
    };
    chai
      .request(app)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.include({ name: "Name already in use" });
        done();
      });
  });
});

describe("Testing the login endpoint", () => {
  it("It shouldn't login a user with unconfirmed email", (done) => {
    const userData = {
      email: "test@email.com",
      password: "samePassword",
    };
    chai
      .request(app)
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(409);
        expect(res.body).to.include({title : "Please confirm your email"});        
        done();
      });
  });
  it("It shouldn't login user that's not been registered", (done) => {
    const userData = {
      email: "notRegistered@email.com",
      password: "samePassword",
    };
    chai
      .request(app)
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.include({ message: "User not found" });
        done();
      });
  });
  it("It shouldn't login user with wrong password", (done) => {
    const userData = {
      email: "test@email.com",
      password: "differentPassword",
    };
    chai
      .request(app)
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.include({ password: "Incorrect password" });
        done();
      });
  });
  it("It shouldn't login user with details from mixed accounts", (done) => {
    const userData = {
      email: "test1@email.com",
      password: "samePassword",
    };
    chai
      .request(app)
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send(userData)
      .end((err, res) => {
        expect(res.status).to.not.equal(200);
        expect(res.body).to.include({ password: "Incorrect password" });
        done();
      });
  });
});
