
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database : "mydb"

})

//**This needs to be handled by an async function */
exports.getTableForDate = function (date, school) {
    var sql = `SELECT * FROM substitutions WHERE school='${school}' AND date='${date}`
    sql = `SELECT * FROM substitutions WHERE school='HhsFra' AND date='30.5.2018'`
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result)
      return result
      });
};
/*
con.connect(function(err) {
    con.query(sql, function (err, result, fields) { 
      if (err) throw err;
      console.log(result);
    });
  });
  */