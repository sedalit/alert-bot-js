const { Telegraf } = require('telegraf');
const responses = require('./scripts/responses');

const bot = new Telegraf(process.env.BOT_TOKEN);
responses.load(process.env.INIT_CWD + process.env.ANSWERS_FILE);
responses.setLanguage('ru');

bot.start((ctx) => ctx.reply(responses.getResponse('Start')));
bot.launch();