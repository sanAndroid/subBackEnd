var cheerio = require('cheerio')
var appId = "com.PiQuadrat.NewsTableViewTest" 

exports.getStudentTags = function (htmlArray) {
    var tagArray = []
    htmlArray.forEach(element => {
        element = "<table>" + element + "</table>"
        $ = cheerio.load(element)
        $('td').eq(0).text().split(", ").forEach(tag => {
            tagArray.push(appId +".HhsFra." + tag)
        });
    });
    return tagArray
};

//this.getStudentTags(["nothing"])