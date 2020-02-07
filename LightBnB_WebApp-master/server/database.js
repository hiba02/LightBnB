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
//tristanjacobs@gmail.com
/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);

  const queryString = `SELECT properties.*, reservations.*, avg(rating) as average_rating
                      FROM reservations
                      JOIN properties ON reservations.property_id = properties.id
                      JOIN property_reviews ON properties.id = property_reviews.property_id 
                      WHERE reservations.guest_id = $1
                      AND reservations.end_date < now()::date
                      GROUP BY properties.id, reservations.id
                      ORDER BY reservations.start_date
                      LIMIT $2;`;
  const values = [guest_id, limit];
  return pool.query(queryString, values)
  .then(res => 
    res.rows
    // {console.log('getAllReservation res.rows:', res.rows);}
  )
  .catch(err=>{console.log(err);});
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
  // return pool.query(`
  // SELECT * FROM properties
  // LIMIT $1
  // `, [limit])
  // .then(res => res.rows);
// }

// {
//   city,
//   owner_id,
//   minimum_price_per_night,
//   maximum_price_per_night,
//   minimum_rating
// }


// SELECT properties.*, avg(property_reviews.rating) as average_rating
// FROM properties
// JOIN property_reviews ON properties.id = property_id
// WHERE city LIKE '%Ottawa%'
// GROUP BY properties.id
// ORDER BY cost_per_night
// LIMIT 20;



const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  if (options.length === 0) {
    let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
    // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

    // 4
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  
    // 5
    console.log(queryString, queryParams);
  
    // 6
    return pool.query(queryString, queryParams)
    .then(res => res.rows);

  } else {
  // 1
  
  // 2
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;

    // 3
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE city LIKE $${queryParams.length} `;
    }

    if (options.owner_id) {
      queryParams.push(`%${options.owner_id}%`);
      queryString += `AND owner_id = $${queryParams.length} `;
    }

    // if (options.minimum_price_per_night && options.maximum_price_per_night) {
    //   queryParams.push(`%${options.minimum_price_per_night}%`);
    //   // let cost_per_night
    //   console.log('1', queryParams);
    //   queryString += `AND $${queryParams.length} < cost_per_night` 
     
    //   queryParams.push(`%${options.maximum_price_per_night}%`);
    //   console.log('2', queryParams);

    //   queryString +=`AND cost_per_night < $${queryParams.length}`;
    // }
    if (options.minimum_price_per_night) {
      queryParams.push(Number(options.minimum_price_per_night));
      // let cost_per_night
      console.log('1', queryParams);
      queryString += `AND $${queryParams.length} < cost_per_night ` 
    }

    if (options.maximum_price_per_night) {
      queryParams.push(Number(options.maximum_price_per_night));
      console.log('2', queryParams);
      queryString +=`AND cost_per_night < $${queryParams.length} `;
    }


    if (options.minimum_rating) {
      queryParams.push(Number(options.minimum_rating));
      queryString += `AND property_reviews.rating >= $${queryParams.length} `;
    }
  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
  }
  

}


exports.getAllProperties = getAllProperties;






/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
  // {
  // owner_id: int,
  // title: string,
  // description: string,
  // thumbnail_photo_url: string,
  // cover_photo_url: string,
  // cost_per_night: string,
  // street: string,
  // city: string,
  // province: string,
  // post_code: string,
  // country: string,
  // parking_spaces: int,
  // number_of_bathrooms: int,
  // number_of_bedrooms: int
// }
  const queryString = `INSERT INTO properties (
    title, 
    description, 
    owner_id, 
    cover_photo_url, 
    thumbnail_photo_url, 
    cost_per_night, 
    parking_spaces, 
    number_of_bathrooms, 
    number_of_bedrooms, 
    active, 
    province, 
    city, 
    country, 
    street, 
    post_code) 
    
    VALUES (
    $1, 
    $2,
    $3, 
    $4,
    $5, 
    $6, 
    $7, 
    $8, 
    $9, 
    true, 
    $10, 
    $11, 
    $12, 
    $13, 
    $14);
    `;
  const values = [
    property.title,
    property.description,
    property.owner_id,
    property.cover_photo_url,
    property.thumbnail_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.province,
    property.city,
    property.country,
    property.street,
    property.post_code
    ];
    console.log('addProperty', queryString);
    return pool.query(queryString, values)
    .then(res => 
      res.rows
      // {console.log('getAllReservation res.rows:', res.rows);}
    )
    .catch(err=>{console.log(err);});
// {
//   owner_id: int,
//   title: string,
//   description: string,
//   thumbnail_photo_url: string,
//   cover_photo_url: string,
//   cost_per_night: string,
//   street: string,
//   city: string,
//   province: string,
//   post_code: string,
//   country: string,
//   parking_spaces: int,
//   number_of_bathrooms: int,
//   number_of_bedrooms: int
// }


}
exports.addProperty = addProperty;
//tristanjacobs@gmail.com


// SELECT properties.*, avg(property_reviews.rating) as average_rating
// FROM properties
// JOIN property_reviews ON properties.id = property_id
// WHERE city LIKE '%ottawa%' AND 4000 < cost_per_night AND cost_per_night < 10000
// GROUP BY properties.id
// ORDER BY cost_per_night
// LIMIT 20;
// [ '%ottawa%', 4000, 10000, 20 ]



// SELECT properties.*, avg(property_reviews.rating) as average_rating
// FROM properties
// JOIN property_reviews ON properties.id = property_id
// WHERE city LIKE '%Tumbler%' AND 100 < cost_per_night AND cost_per_night < 10000000 AND property_reviews >= 2 
// GROUP BY properties.id
// ORDER BY cost_per_night
// LIMIT 20;
// [ '%Tumbler%', 100, 10000000, 2, 20 ]