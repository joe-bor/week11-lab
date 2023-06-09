const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(8080, () => {
  console.log("Testing on port 8080");
});
const User = require("../models/user");
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  mongoServer.stop();
  server.close;
});

afterAll((done) => done()); //what is this?

describe("Test user endpoints", () => {
  test("It should create a  new user", async () => {
    const response = await request(app).post("/users").send({
      name: "John Doe",
      username: "JohnDoe",
      email: "john.doe@email.com",
      password: "johndoepassword",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.user.name).toEqual("John Doe");
    expect(response.body.user.username).toEqual("JohnDoe");
    expect(response.body.user.email).toEqual("john.doe@email.com");
    expect(response.body).toHaveProperty("token");
  });

  test("It should login a user", async () => {
    const user = new User({
      name: "jane Doe",
      username: "janeDoe",
      email: "jane.doe@email.com",
      password: "janedoepassword",
    });
    await user.save();

    const response = await request(app)
      .post("/users/login")
      .send({ email: "jane.doe@email.com", password: "janedoepassword" });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.name).toEqual("jane Doe");
    expect(response.body.user.username).toEqual("janeDoe");
    expect(response.body.user.email).toEqual("jane.doe@email.com");
    expect(response.body).toHaveProperty("token");
  });

  test("It should update a user", async () => {
    const user = new User({
      name: "j Doe",
      username: "j Doe",
      email: "j.doe@email.com",
      password: "jdoepassword",
    });

    await user.save();
    const token = await user.generateAuthToken();
    const response = await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "mike doe", email: "mike.doe@email.com" });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual("mike doe");
    expect(response.body.email).toEqual("mike.doe@email.com");
  });

  test("It should delete a user", async () => {
    const user = new User({
      name: "jacob z",
      username: "jacobz-user",
      email: "jacob.z@email.com",
      password: "jacobpassword",
    });

    await user.save();
    const token = await user.generateAuthToken();
    const response = await request(app)
      .delete(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("User DELETED");
  });

  test("It should return a list of users", async () => {
    const response = await request(app).post("/users").send({
      name: "B",
      username: "B-user",
      email: "B@email.com",
      password: "B-pw",
    });
    const response2 = await request(app).get("/users");

    expect(response.statusCode).toBe(200);
    expect(response2.statusCode).toBe(200);
    expect(response.body.user.name).toEqual("B");
    expect(response.body.user.username).toEqual("B-user");
    expect(response.body.user.email).toEqual("B@email.com");
  });

  test("It should logout the user", async () => {
    const user = new User({
      name: "jacob z",
      username: "jacobz-user",
      email: "jacob.z@email.com",
      password: "jacobpassword",
    });

    await user.save();
    const token = await user.generateAuthToken();
    const response = await request(app)
      .post(`/users/logout`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(token).toEqual(null);
  });
});
