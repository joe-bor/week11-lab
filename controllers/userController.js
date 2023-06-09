const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, "secret");
    const user = await User.findOne({ _id: data._id });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    //go to db
    //send everything back
    const foundUsers = await User.find({});
    res.json(foundUsers);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const user = await User.findOne({ _id: req.params.id });
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await req.user.deleteOne();
    res.json({ message: "User DELETED" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      res.status(400).send("Invalid login credentials");
    } else {
      const token = await user.generateAuthToken(); // if stored by default, how to access
      //localStorage.setItem('token', token)
      console.log(token);
      res.json({ user, token });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    //find a user -> req.user
    token = null;
    //remove jwt token from user?
    res.json(token);
    console.log("logout successfully");
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
