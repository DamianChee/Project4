// usersController.js
const { Users } = require("../db/Index");

// Seed users
const seedUsers = async (req, res) => {
  try {
    const users = await Users.bulkCreate([
      { name: "Danza", username: "danza", password: "password", company_id: 1 },
      {
        name: "Albert",
        username: "albert",
        password: "password",
        company_id: 1,
      },
      { name: "Bryan", username: "bryan", password: "password", company_id: 1 },
      {
        name: "Damian",
        username: "damian",
        password: "password",
        company_id: 1,
      },
    ]);

    res.status(200).json({ status: "ok", msg: "seed completed", data: users });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "error in seeding attendance type",
      data: error.message,
    });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const newUser = await Users.create(req.body);

    res.status(200).json({ status: "ok", msg: "user created", data: newUser });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "error in creating user",
      data: error.message,
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({});

    res.status(200).json({ status: "ok", msg: "users returned", data: users });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "error in getting users",
      data: error.message,
    });
  }
};

const getAllUsersByCompany = async (req, res) => {
  try {
    const users = await Users.findAll({
      where: {
        company_id: req.body.company_id,
      },
    });

    res.status(200).json({ status: "ok", msg: "users found", data: users });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "error in getting users",
      data: error.message,
    });
  }
};

// Get user by id (primary key)
const getUserById = async (req, res) => {
  try {
    const user = await Users.findByPk(req.body.id);

    res.status(200).json({ status: "ok", msg: "user found", data: user });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "error in getting user",
      data: error.message,
    });
  }
};

// Get user by company
const getUserByCompany = async (req, res) => {
  try {
    const users = await Users.findAll({
      where: {
        name: req.body.name,
        company_id: req.body.name,
      },
    });

    res.status(200).json({ status: "ok", msg: "users found", data: users });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "error in getting users",
      data: error.message,
    });
  }
};

// Update user by id
const updateUser = async (req, res) => {
  try {
    const user = await Users.update(req.body, {
      where: {
        id: req.body.id,
      },
    });

    res.status(200).json({ status: "ok", msg: "user updated", data: user });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "error in updating user",
      data: error.message,
    });
  }
};

// Delete user by id
const deleteUser = async (req, res) => {
  try {
    const user = await Users.destroy({
      where: {
        id: req.body.id,
      },
    });

    res.status(200).json({ status: "ok", msg: "user deleted", data: user });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "error in deleting user",
      data: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const auth = await Users.findAll({ username: req.body.username });
    if (auth)
      return res.status(400).json({ status: "error", msg: "username used" });
    const password = await bcrypt.hash(req.body.password, 12);
    const data = await Users.create({
      name: req.body.name,
      username: req.body.username,
      password: password,
      company_id: req.body.company_id,
    });

    res.json({ status: "ok", msg: "user created", data: data });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "invalid registration" });
  }
};

const login = async (req, res) => {
  try {
    const auth = await Users.findAll({ username: req.body.username });
    if (!auth)
      return res.status(400).json({ status: "error", msg: "username failure" });

    const result = await bcrypt.compare(req.body.password, auth.password);
    if (!result) {
      console.error("email or password incorrect");
      return res.status(401).json({ status: "error", msg: "password failure" });
    }

    const claims = {
      id: auth.id,
      company_id: auth.company_id,
      role_id: auth.role_id,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.json({ status: "ok", msg: "logged in", data: auth, access, refresh });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error not authorized" });
  }
};

const refresh = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);

    const claims = {
      id: decoded.id,
      company_id: decoded.company_id,
      role_id: decoded.role_id,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    res.json({ access });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "not authorized" });
  }
};

module.exports = {
  seedUsers,
  createUser,
  getAllUsers,
  getAllUsersByCompany,
  getUserById,
  getUserByCompany,
  updateUser,
  deleteUser,
  register,
  login,
  refresh,
};
