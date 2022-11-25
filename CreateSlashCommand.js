const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9');
const {SlashCommandBuilder} = require("@discordjs/builders");
const { token } = require('./config.json');
const { CLIENT_ID } = require('./config.json')
const rest = new REST({version: '9'}).setToken(token);
( async () => {
    try {
        await rest.put(
            // Routes.applicationCommands(CLIENT_ID),
            Routes.applicationGuildCommands("1044881724137553940", "1044257691633205249"),
            {
                body: [
                    data = new SlashCommandBuilder()
                        .setName("충전")
                        .setDescription("라이센스형식으로 돈을 충전합니다")
                        .addStringOption(option => option.setName("라이센스").setDescription("라이센스코드 로 금액을 충전합니다").setRequired(true)),
                    data = new SlashCommandBuilder()
                        .setName("정보")
                        .setDescription("정보를 확인합니다")
                        .addStringOption(option => option.setName("대상").setDescription("대상이 없을 경우 본인을 확인합니다")),
                    data = new SlashCommandBuilder()
                        .setName("가입")
                        .setDescription("서비스 의 가입합니다")
                ]
            }
        )
    } catch (err) {
        console.log(err)
    }
})()
