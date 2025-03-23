const { Telegraf, session, Markup} = require('telegraf');
const responses = require('./scripts/responses');
const time = require('./scripts/time');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session({
    defaultSession: () => ({})
}));

responses.load(process.env.INIT_CWD + process.env.ANSWERS_FILE);
responses.setLanguage('ru');

bot.start((ctx) => ctx.replyWithHTML(responses.getResponse('Start')));

bot.on('text', (ctx) => {
    let userMessage = ctx.message.text;
    let parsedTime = time.parseTime(userMessage, 'ru');

    if (parsedTime) {
        ctx.reply(responses.getResponse('AlertSetted', {alertTime: parsedTime}), 
            Markup.inlineKeyboard([
                Markup.button.callback('Да', 'addComment'),
                Markup.button.callback('Нет', 'noComment')
        ]));

        ctx.session.waitingForComment = true;
        ctx.session.alertTime = parsedTime;
        
        return;
    } else if (ctx.session.waitingForComment) {
        ctx.session.waitingForComment = false;
        parsedTime = ctx.session.alertTime;

        ctx.reply(responses.getResponse('CommentSetted'));

        time.scheduleJob(parsedTime, () => {
            ctx.reply(responses.getResponse('AlertWithComment', {comment: userMessage}));
        });

        return;
    }

    ctx.reply(responses.getResponse('Default'));
});

bot.action('addComment', (ctx) => {
    ctx.answerCbQuery();
    ctx.editMessageReplyMarkup({});
    ctx.reply('Напишите комментарий:');
});

bot.action('noComment', (ctx) => {
    ctx.answerCbQuery();
    ctx.editMessageReplyMarkup({});

    let scheduleTime = ctx.session.alertTime;

    time.scheduleJob(scheduleTime, () => {
        ctx.reply(responses.getResponse('DefaultAlert'));
    });

    ctx.reply(responses.getResponse('NoComment'));

    ctx.session.alertTime = null;
    ctx.session.waitingForComment = null;
});

bot.launch();