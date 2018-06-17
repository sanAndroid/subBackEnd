var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database : "mydb"

});



con.connect(function(err) {
  var mysql = require('mysql');
  if (err) throw err;
  console.log("Connected!");
      var sql = "CREATE TABLE test6 (class VARCHAR(63), time VARCHAR(63)," +
        "subject VARCHAR(63), sub VARCHAR(63),"+
        "fuer VARCHAR(63), room VARCHAR(63), subFrom VARCHAR(63),"  +
        "hint VARCHAR(63), way_of VARCHAR(63), date VARCHAR(63), dummy VARCHAR(63))"
      //sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
      console.log(sql)
*     con.query(sql, function (err, result, fields) {
      //con.query("SELECT * FROM today", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
      });
    console.log("Database created");
});
/*
var sql = "CREATE TABLE today (class VARCHAR(63), time VARCHAR(63), subject VARCHAR(63),   \
            sub VARCHAR(63), for VARCHAR(63)), room VARCHAR(63), sub_from VARCHAR(63),  \
            hint VARCHAR(63), way_of VARCHAR(63), date VARCHAR(63), dummy VARCHAR(63))"
*/ 