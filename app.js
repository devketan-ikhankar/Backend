const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const DB_STRING = 'postgresql://neondb_owner:npg_8GJkFvLQS0EY@ep-hidden-frog-a50vpmi1-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';




dotenv.config();


const app = express();

const pool = new Pool({
    connectionString: DB_STRING  // process.env.DB_STRING,
    // ssl: {
    //     rejectUnauthorized: false
    // }
});

const createUser = async (email, password, returnFields = '*') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING ' + returnFields,
    
    [email, hashedPassword]
  );
  return result.rows[0];
};

const getUser = async (email, password) => {
  // Retrieve the user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return null; // User not found
    }

    const user = result.rows[0];

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null; // Password does not match
    }

    return user; // Return the user if authentication is successful
};



app.use(bodyParser.json());



app.get('/', async (req, res) => {
  const columns = req.query.columns || '*';
  console.log('columns:', columns);
    const user = await createUser('ketan@example.com', 'ketan', columns);
    res.send(user);
});


app.get('/auth', async (req, res) => {
  const user = await getUser('ketan@example.com', 'ketan');
  if(!
    user) {
    res.send('User not found');
    return;
  }
  res.send(user);
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});