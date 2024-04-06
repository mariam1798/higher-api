require("dotenv").config({ path: "../.env" });
DB_NAME = "higher";
DB_USER = "root";
DB_PASSWORD = "rootroot";
DB_HOST = "127.0.0.1";
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: DB_HOST,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      charset: "utf8",
    },
  },
};
