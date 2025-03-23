const chrono = require('chrono-node');
const schedule = require('node-schedule');

function parseTime(text, targetLanguage) {
    let now = new Date();
    let parsedDate = chrono[targetLanguage].parseDate(text, now);

    return parsedDate ? parsedDate.toLocaleString('ru-RU') : null;
}

function scheduleJob(time, callback) {
    let parsedDate = chrono.parseDate(time);
    let job = schedule.scheduleJob(parsedDate, callback);
    return job;
}

module.exports = {parseTime, scheduleJob};