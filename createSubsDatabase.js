var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database : "mydb"

});



con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
      var sql = "CREATE TABLE substiutions (date TINYTEXT, school VARCHAR(63)," +
        "htmlrow TEXT)"
      //sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
      console.log(sql)
*     con.query(sql, function (err, result, fields) {
      //con.query("SELECT * FROM today", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
      });
    console.log("Database created");
});
