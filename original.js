const express = require('express');
const {Pool} = require('pg');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const DB_STRING = 'postgresql://neondb_owner:npg_8GJkFvLQS0EY@ep-hidden-frog-a50vpmi1-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';

dotenv.config();


const app = express();

const pool = new Pool({
    connectionString: DB_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});

const createUser = async(email, hashPassword) => {
    const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashPassword]
    );
    return result.rows[0];
}

app.use(bodyParser.json());


app.get('/', async (req, res) => {    
    
    const user = await createUser('Ketan@example.com', '123456');

   
    res.send(user);
});

app.get('/users', async (req, res) => {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
});
  



const PORT = process.env.PORT ||  4001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


