import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_ID,
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get("/dbTestAuthor", async(req, res) => {

    let sql = "SELECT * FROM q_authors";

   try {
        const [rows] = await pool.query(sql);
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});

app.get("/dbTestQuote", async(req, res) => {

    let sql = "SELECT * FROM q_quotes";

   try {
        const [rows] = await pool.query(sql);
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});

app.get('/', async (req, res) => {
    let authorSql = `SELECT authorId, firstName, lastName
               FROM q_authors
               ORDER BY lastName`;

    let quoteSql = `SELECT DISTINCT category
                    FROM q_quotes`;

    try {
        const [rows] = await pool.query(authorSql);
        const [quoteRows] = await pool.query(quoteSql);
        res.render("index",{"authors":rows, "quotes":quoteRows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});

app.get('/searchByKeyword', async (req, res) => {
    let keyword = req.query.keyword;
    
    let sql = `SELECT quote, authorId, firstName, lastName
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE quote LIKE ?`;

    let sqlParams = [`%${keyword}%`];
    
    try {
        const [rows] = await pool.query(sql, sqlParams);
        res.render("results",{"quotes":rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});

app.get('/searchByAuthor', async (req, res) => {
    let userAuthorId = req.query.authorId;
    
    let sql = `SELECT authorId, firstName, lastName, quote
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE authorId = ?`;

    let sqlParams = [userAuthorId];
    
    try {
        const [rows] = await pool.query(sql, sqlParams);
        res.render("results",{"quotes":rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});

app.get('/api/author/:id', async (req, res) => {
  let authorId = req.params.id;
  let sql = `SELECT *
            FROM q_authors
            WHERE authorId = ?`;
    try {
        let [rows] = await pool.query(sql, [authorId]);
        res.send(rows)
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});

app.get('/searchByCategory', async (req, res) => {
    let userCategory = req.query.categories;
    
    let sql = `SELECT *
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE category = ?`;

    let sqlParams = [userCategory];
    
    try {
        const [rows] = await pool.query(sql, sqlParams);
        res.render("results",{"quotes":rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});

// app.get('/api/author/:id', async (req, res) => {
//   let authorId = req.params.id;
//   let sql = `SELECT *
//             FROM q_authors
//             WHERE authorId = ?`;
//     try {
//         let [rows] = await pool.query(sql, [authorId]);
//         res.send(rows)
//     } catch (err) {
//         console.error("Database error:", err);
//         res.status(500).send("Database error");
//     }
// });



app.listen(3000, ()=>{
    console.log("Express server running")
})