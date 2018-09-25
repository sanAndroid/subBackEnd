
const baseUrl = 'http://Lehrer:C1602Z@www.helmholtzschule-ffm.de/Schulleitung/StdPlan/';
const type = 'Klassen/';
const iDB = require('./insertToDataBase')
const cheerio = require('cheerio') 
const rp = require("request-promise");

const getData = async () => {
    let day = 'f1/'; // Url Teil, der den Tag ausgibt
    let i = 1;
    let today = await makeRequest(i, day, ["string"]);
    let nextPage
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
    let tomorrow = await makeRequest(1, day, ["string"])
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
    
    iDB.compareAndFire(today.slice(0),'HhsFra')
    iDB.compareAndFire(tomorrow.slice(0),'HhsFra')
}

async function makeRequest(i, day, dataArray) {
    try {
        let url = baseUrl + type + day + '/subst_00' + i + '.htm';
        //console.log("GetDay: " + i)
        //console.log("GetDay: " + url)
        const body = await rp.get(url)
        const $ = cheerio.load(body)
        let currentDate = $("div.mon_title").eq(0).text().split(/[ ]+/)[0]
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
                //console.log("Zeile: " + index)
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

// Entry Point
getData()
