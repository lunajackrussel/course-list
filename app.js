const path = require("path");
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

//ejs
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//MySQL接続
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "course_list_db",
});

/*
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
*/

/* データベース作成
  con.query('CREATE DATABASE course_list_db', function (err, result) {
    if (err) throw err; 
      console.log('database created');
    });
    const sql = 'CREATE TABLE courses (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, course VARCHAR(255) NOT NULL, comment VARCHAR(255) NOT NULL)';
	con.query(sql, function (err, result) {  
	if (err) throw err;  
	console.log('table created');  
	}); 
*/

/*
app.get('/', (request, response) => {
    const sql = "select * from courses"
    con.query(sql, function (err, result, fields) {  
    if (err) throw err;
    response.send(result)
        });
    });
*/


app.get("/", (req, res) => {
  const sql = "select * from courses";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", { courses: result });
  });
});

app.post("/", (req, res) => {
  const sql = "INSERT INTO courses SET ?";
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
   // res.send("登録が完了しました");
    res.redirect('/');
  });
});

app.get("/create", (req, res) =>
  res.sendFile(path.join(__dirname, "views/form.html"))
);

//Update form
app.get("/edit/:id", (req, res) => {
    const sql = "SELECT * FROM courses WHERE id = ?";
    con.query(sql, [req.params.id], function (err, result, fields) {
      if (err) throw err;
      res.render("edit", { course: result });
    });
  });

//Update
app.post("/update/:id", (req, res) => {
  const sql = "UPDATE courses SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});

//Delete
app.get("/delete/:id", (req, res) => {
  const sql = "DELETE FROM courses WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
