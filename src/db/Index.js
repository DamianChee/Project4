// models/index.js
const Sequelize = require("sequelize");
const config = require("../../config.json");

const env = process.env.DB_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
  }
);

// Constraint tables
const AttendanceTypes = require("../models/AttendanceTypes")(
  sequelize,
  Sequelize.DataTypes
);
const Roles = require("../models/Roles")(sequelize, Sequelize.DataTypes);

// Following Table hierarchy Company -> User -> Team & Attendance
const Companies = require("../models/Companies")(
  sequelize,
  Sequelize.DataTypes
);
const Users = require("../models/Users")(sequelize, Sequelize.DataTypes);
const Teams = require("../models/Teams")(sequelize, Sequelize.DataTypes);
const Attendances = require("../models/Attendances")(
  sequelize,
  Sequelize.DataTypes
);

module.exports = {
  sequelize,
  Attendances,
  AttendanceTypes,
  Companies,
  Roles,
  Teams,
  Users,
};
