const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

let args = process.argv.slice(2);
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

pool.connect()

// const queryString = `
// SELECT id, name, email
// FROM users
// LIMIT $1;
// `
// const limit = process.argv[3] || 5;
// const values = [limit];
// pool.query(queryString, values)
// .then(res => {
//   res.rows.forEach(row => {
//     console.log(`row.id: ${row.id} row.name: ${row.name} row.email: ${row.email}`);
//   })
// }).catch(err => console.error('query error', err.stack));









/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
  
  const queryString = `SELECT * FROM users WHERE email=$1`;
  const values = [email];
  return pool.query(queryString, values)
  .then(res => 
      res.rows[0]  //[{}]
  //  res.rows
  )
  .catch(err=>{console.log(err)});
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  // return Promise.resolve(users[id]);
  const queryString = `SELECT name FROM users WHERE $1`;
  const values = [id];
  return pool.query(queryString, values)
  .then(res => {
    res.rows
  })
  .catch(err=>{console(err)});
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  const queryString = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`;
  const values = [user.name, user.email, user.password];
  return pool.query(queryString, values)
  .then(res => {
    res.rows
  })
  .catch(err=>{console(err)});
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
  return pool.query(`
  SELECT * FROM properties
  LIMIT $1
  `, [limit])
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
