var mysql = require('promise-mysql');
var getTags = require('./getHtmlContent')
var fcm = require('./sendMessages')

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb",
  connectionLimit: 20
});


/*
exports.endConnection = function (ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
  con.end()
}
*/

updateTable = function (substitutionTable) {
  var sql = `DELETE FROM substitutions`
  var connection
  const date = substitutionTable.shift();
  const info = substitutionTable.shift(); // TODO: Write this into another table
  subLen = substitutionTable.length;
  mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb",
    connectionLimit: 20
  }).then(function (con) {
    connection = con
    console.log("Deleting Database")
    // return 
    connection.query(sql);
  }).then(function () {
    for (i = 0; i < subLen; i++) {
      sql = `INSERT INTO substitutions (date,school,htmlrow) VALUES ('${date}','HhsFra', '${substitutionTable[i]}')`
      con.query(sql);
    }
    console.log("Finished writing to Database");

  }).then(function () {
    console.log("Closing Deleting Connection to Database")
    connection.end()
  }).catch(function (err) {
    console.log("Error while deleting db")
  });
};

exports.compareAndFire = async function (day, school) {
  sql = `SELECT htmlrow FROM substitutions WHERE school='${school}' AND date='${day[0]}'`
  var substitutionTable = day
  //day.splice(0, 2)
  var connection
  mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb",
    connectionLimit: 20
  }).then(function (con) {
    connection = con
    console.log("Receiving Data from Database")
    return result = con.query(sql)
  }).then(function (result) {
    var dbEntries = []
    var newEntries = []
    var removedEntries = []
    //Fill the array with the databasse entries  
    for (let key in result) {
      //console.log(key)
      dbEntries.push(result[key]["htmlrow"])
    }
    // Checks if an entry in day exist already in the db
    // If not add it to new array
    for (i = 2; i < day.length; i++) {
      var inside = true
      for (j = 0; j < dbEntries.length; j++) {
        if (dbEntries[j] == day[i])
          inside = false
      }
      if (inside) newEntries.push(day[i])
    }

    // Checks if there if an entry has been removed 
    // in the new table
    for (i = 0; i < dbEntries.length; i++) {
      var inside = true
      for (j = 2; j < day.length; j++) {
        if (dbEntries[i] == day[j])
          inside = false
      }
      if (inside) removedEntries.push(day[i])
    }

    //console.log("Removed Entries: " + removedEntries)
    var messaging = fcm.initializeMessaging()
    var removedTags = getTags.getStudentTags(removedEntries)
    var newTags = getTags.getStudentTags(newEntries)
    console.log("Removed Tags: " + getTags.getStudentTags(removedEntries))
    for (i in removedTags) {
      fcm.pushTopic(messaging, removedTags[i], removedEntries[i])
    }
    console.log("New Tags: " + getTags.getStudentTags(newEntries))
    for (i in newTags) {
      fcm.pushTopic(messaging, newTags[i], newEntries[i])
    }
    //console.log("Insert doNew Entries: "  newEntries)
    console.log("Insert To Database - New Tags:" + getTags.getStudentTags(newEntries))
  }).then(function () {
    connection.end()
    fcm.shutdown()
    updateTable(substitutionTable)
  }).catch(function (err) {
    console.log("Error while inserting substitutions to database");
  });
};
