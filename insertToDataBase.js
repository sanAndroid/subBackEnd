var mysql = require('mysql');
var getTags = require('./getHtmlContent')
var fcm = require('./sendMessages')

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"

});


exports.endConnection = function (ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
  con.end()
}

exports.updateTable = function (substitutionTable) {
  var sql = `DELETE FROM substitutions`
  con.query(sql, function (err, result) {
    if (err) throw err;
    insertTable(substitutionTable)
  });
};

var insertTable = function (substitutionTable) {
  const date = substitutionTable.shift();
  const info = substitutionTable.shift();
  subLen = substitutionTable.length;
  var sql
  for (i = 0; i < subLen; i++) {
    sql = `INSERT INTO substitutions (date,school,htmlrow) VALUES ('${date}','HhsFra', '${substitutionTable[i]}')`
    //console.log(`Line: ${i} inserted`);
    con.query(sql, async function (err, result) {
      if (err) throw err;
      console.log("Insert to tabel: " + result)
    });
  }
};

//**This needs to be handled by an asy */
exports.compareAndFire = async function (day, school) {
  sql = `SELECT htmlrow FROM substitutions WHERE school='${school}' AND date='${day[0]}'`
  day.splice(0, 2)
  con.query(sql, function (err, result) {
    if (err) throw err
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
    for (i = 0; i < day.length; i++) {
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
      for (j = 0; j < day.length; j++) {
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
    for (i in newTags) {
      fcm.pushTopic(messaging, newTags[i], newEntries[i])
    }
    //console.log("Insert doNew Entries: "  newEntries)
    console.log("Insert To Database - New Tags:" + getTags.getStudentTags(newEntries))
  }
  );
};
