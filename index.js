require("dotenv").config();
const sequelize = require("./db");
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const {Tg} = require("./models");

const token = '1946655280:AAFLTPYV0l7YSgdNAb25_FbJ4x3jRmzx-xY';
const webAppUrl = 'https://chamala.ru';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 1234

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}`)
        })
    } catch (e) {
        console.log(e);
    }
};

start();

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    const tg = await Tg.findOrCreate({
        where: {
            chatId
        },
        defaults: {
            chatId
        }
    })


    if (text === '/start') {
        await bot.sendMessage(chatId, 'Chamala - Изучение татарского языка в формате мини-игр. Нажми на большую кнопку внизу!)', {
            reply_markup: {
                keyboard: [
                    [
                        {text: 'Переведи', web_app: {url: webAppUrl + '/guess'}},
                        {text: 'Алиас', web_app: {url: webAppUrl + '/alias'}}
                    ],
                    [
                        {text: 'Собери', web_app: {url: webAppUrl + '/collect'}},
                    ]
                    // [{text: 'Переведи', web_app: {url: webAppUrl + '/translate'}}]
                    // [{text: 'Переведи', web_app: {url: webAppUrl + '/form'}}]
                ]
            }
        })
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
            await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
            await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            }, 3000)
        } catch (e) {
            console.log(e);
        }
    }
});

