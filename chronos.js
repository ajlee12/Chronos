const hpropagate = require('hpropagate');
const mongoMiddleware = require('./mwMongo.js');
const sqlMiddleware = require('./mwSQL.js');

const chronos = {};

/* 
propagate places an unique x-correlating-id into the headers of each request/response.
The same id persist thru the whole life cycle of the request.
*/
chronos.propagate = () => {
  hpropagate({ propagateInResponses: true });
};

// microCom logs all microservice-microservice and microservice-client comm. into the user-owned database.

/* PARAMETERS:
  * microserviceName: what the user wants current microservice to be called
  * databaseType: type of database user is providing: Mongo or PostgreSQL
  * userOwnedDB: URL to user database
  * queryFreq: Not necessary for microCom as microCom monitors only when an endpoint is hit
  * wantMicroHealth: "yes" or "no". If yes, .microHealth is invoked.
  * isDockerized: "yes" or "no". If yes, .microDocker is invoked to log container stats instead.
    * Defaults to 'no'.
*/
chronos.microCom = (
  microserviceName,
  databaseType,
  userOwnedDB,
  wantMicroHealth,
  queryFreq = 'm',
  isDockerized = 'no', 
  req, res, next) => {
  // Handles if user inputs an array. Grabs information and assigns to correct parameters
  if (Array.isArray(microserviceName) === true && microserviceName.length >= 4) {
    microserviceName = microserviceName[0];
    databaseType = microserviceName[1];
    userOwnedDB = microserviceName[2];
    wantMicroHealth = microserviceName[3];
    queryFreq = microserviceName[4] || 'm';
    isDockerized = isDockerized[5] || 'no';
  }
  // Changes user inputs to lowercase to account for any capitalization errors.
  microserviceName = microserviceName.toLowerCase();
  databaseType = databaseType.toLowerCase();
  wantMicroHealth = wantMicroHealth.toLowerCase();
  queryFreq = queryFreq.toLowerCase();
  isDockerized = isDockerized.toLowerCase();

  // Ensures that the required parameters are entered, errors out otherwise
  if (!microserviceName || !databaseType || !userOwnedDB || !wantMicroHealth) {
    throw new Error(
      'Please verify that you have provided all four required parameters',
    );
  }

  // Verifies that the user has enteres strings, throws error otherwise
  if (
    typeof microserviceName !== 'string'
      || typeof databaseType !== 'string'
      || typeof userOwnedDB !== 'string'
      || typeof wantMicroHealth !== 'string'
      || typeof queryFreq !== 'string'
      || typeof isDockerized !== 'string'
  ) {
    throw new Error(
      'Please verify that the parameters you entered are all strings',
    );
  }

  // Checks the type of database provided by the user and uses appropriate middleware files.
  // Throws error if input db type is not supported
  if (databaseType === 'mongo' || databaseType === 'mongodb') {
    return mongoMiddleware.microCom(userOwnedDB, microserviceName, wantMicroHealth, queryFreq, isDockerized);
  } if (databaseType === 'sql' || databaseType === 'postgresql') {
    return sqlMiddleware.microCom(userOwnedDB, microserviceName, wantMicroHealth, queryFreq, isDockerized);
  }
  throw new Error(
    'Chronos currently only supports Mongo and PostgreSQL databases. Please enter "mongo" or "sql"',
  );
};

module.exports = chronos;
