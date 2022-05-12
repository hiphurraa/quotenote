import dotenv from "dotenv";
import promise from "bluebird";
import pgPromise from "pg-promise";

//Set pgp to use bluebird as promise library
const options = {
  promiseLib: promise,
  query: (e) => {
    process.env.NODE_ENV ? "" : console.log(e.query);
  },
};

dotenv.config();

//Create database connection
const connectionString = process.env.NODE_ENV
  ? process.env.TEST_DB_URL
  : process.env.DATABASE_URL;
const ssl = {
  rejectUnauthorized: false,
};

//Local test db doesnt accept ssl connections by default
var config = {};
//Use this config for both remote prod/dev database and different config for local tests
// if (process.env.NODE_ENV) config = { connectionString };
// else config = { connectionString, ssl };

//Use this config if you're just running a local database. Uncomment line 30, and comment line 26-27
config = { connectionString };

const pgp = pgPromise(options);
const db = pgp(config);

export default db;
