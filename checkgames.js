const notifier = require("node-notifier");
// "node-notifier" package that sends system notifications

const axios = require("axios");
// to fetch the url html data

const cheerio = require("cheerio");
// a node library used to parse and manipulate html docs

const path = require("path");

const cron = require("node-cron");
// is a task scheduler to set tasks at specific times

// i want to connect to the webiste and extract the html code and data in the date element to be able to
// compare it to todays date to see if there is a game today
const siteurl = "https://www.haifa-stadium.co.il/לוח_המשחקים_באצטדיון/"

async function checkWebsite() {
    const response = await axios.get(siteurl);
    const htmlContent = response.data;
    const $ = cheerio.load(htmlContent);
    const paragraphText = $("div.elementor-widget.elementor-widget-text-editor div.elementor-widget-container p").eq(2).text().trim();
    // .eq(n) extracts specific element from collection
    // text() gets the inner text of the element
    // trim() helps remove unwanted spaces



    let extractedDate = paragraphText.match(/\d{1,2}([\/.-])\d{1,2}\1\d{2}/g);
    // extracts a date from a block of text
    if(!extractedDate === undefined){
        compareDates(extractedDate)
    }else{
        sendNotification(false)
    }


}

function compareDates(extractedDate) {
    // the extracted ccontent according to the class
    let date = new Date().toLocaleDateString();

     let todaysdate=['27/05/2025']

    if (extractedDate[0] === date) {
        sendNotification(true)
        console.log(date)
    } else {
        sendNotification(false)
    }
}

function sendNotification(verdict) {


    notifier.notify({
        title: "Notification",
        message: verdict ? "There is a game today in Sami Ofer" : "No game today!",
        icon: path.join(__dirname, verdict ? 'icons/sad.png' : 'icons/happy.png'),
        sound: false,
        timeout: 10
    });

    // using cron package to schedule tasks
    cron.schedule('0 10,12,15,17 * * *', () => {

        notifier.notify({
            title: "Notification",
            message: verdict ? "There is a game today in Sami Ofer" : "No game today!",
            icon: path.join(__dirname, verdict ? 'icons/sad.png' : 'icons/happy.png'),
            sound: false,
            timeout: 10
        });

    });


}

checkWebsite()