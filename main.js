
const baseUrl = 'http://Lehrer:C1602Z@www.helmholtzschule-ffm.de/Schulleitung/StdPlan/';
const type = 'Klassen/';
var page = 1
var dataArray = ["0"];
var iDB = require('./insertToDataBase')

const getData = async () => {
    var day = 'f1/';
    var i = 1;
    var today = await makeRequest(i, day, ["string"]);
    var nextPage
    do {
        i++
        nextPage = await makeRequest(i, day, [today[0]])
        if (nextPage[0] === today[0]) {
            nextPage.shift()
            today = today.concat(nextPage)
        } else {
            break
        }
    } while (true)
    // Write to DB 
    day = 'f2/'
    var tomorrow = await makeRequest(1, day, ["string"])
    i = 1
    do {
        i++
        nextPage = await makeRequest(i, day, [tomorrow[0]])
        if (nextPage[0] === tomorrow[0]) {
            nextPage.shift()
            tomorrow = tomorrow.concat(nextPage)
        }
        else 
            break
   } while (true)
    await iDB.compareAndFire(today.slice(0),'HhsFra')
    console.log("After Compare and Fire?")
    iDB.endConnection(1000)
    return
    iDB.updateTable(today)
    iDB.updateTable(tomorrow)
}

async function makeRequest(i, day, dataArray) {
    cheerio = require('cheerio');
    var rp = require("request-promise");
    try {
        var url = baseUrl + type + day + '/subst_00' + i + '.htm';
        //console.log("GetDay: " + i)
        //console.log("GetDay: " + url)
        const body = await rp.get(url)
        const $ = cheerio.load(body)
        var currentDate = $("div.mon_title").eq(0).text().split(/[ ]+/)[0]
        //if (i === 1) {
        dataArray.pop()
        console.log("Erstes Datum: " + currentDate);
        dataArray.push($("div.mon_title").eq(0).text().split(/[ ]+/)[0])
        // push the the date in the first entry
        if ($("table.info").html() !== null) {
            dataArray.push($("table.info").html())
        }
        $("tr.list").each(function (index) {
            if (index != 0) {
                console.log("Zeile: " + index)
                //console.log($(this).html())
                dataArray.push($(this).html())
            }
        });
        return dataArray
   }
    catch (err) {
        console.log(err)
    }
};

getData()