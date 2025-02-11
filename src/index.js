require('dotenv').config();

const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, REST, Routes } = require("discord.js");
const { CommandHandler } = require('djs-commander');
const Suggestions = require("../models/Suggestions");
const mongoose= require('mongoose');
const cron = require("cron");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites
    ]
});
// const rest = new REST().setToken(process.env.TOKEN);
// rest.put(Routes.applicationCommands("1274828671617859584"), { body: [] })
//     .then(() => console.log('Successfully deleted all application commands.'))
//     .catch(console.error);

client.on("ready", async (c) => {
    console.log("✅  - Bot is ready.")
    qotdJob.start();
    console.log("✅  - qotdJob started");
});

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        new CommandHandler({
            client: client,
            commandsPath: path.join(__dirname, "../commands"),
            eventsPath: path.join(__dirname, "../events")
        });

        await client.login(process.env.TOKEN);
    } catch (e) {
        console.log(e);
    }
})();

let qotdJob = new cron.CronJob('0 12 * * *', qotd);
async function qotd() {
    const count = await Suggestions.countDocuments({approved: true, asked: false}, {});
    var random = Math.floor(Math.random() * count)

    const question = await Suggestions.findOne({approved: true, asked: false}).skip(random);

    if (question === undefined || question === null) {
        console.log("❌ - No qotd in db");
        const embed = noQotdEmbed("There are currently no questions. Use /suggest to suggest more questions!");
        await client.channels.cache.get(process.env.QOTD_CHANNEL_ID).send({content: `<@&${process.env.QOTD_ROLE_ID}>`, embeds: [embed]});
        return;
    }

    const embed = qotdEmbed(question.question, question.imageUrl);
    let message = await client.channels.cache.get(process.env.QOTD_CHANNEL_ID).send({content: `<@&${process.env.QOTD_ROLE_ID}>`, embeds: [embed]});

    question.asked = true;
    await question.save();

    console.log("🔹  - qotdJob ran")
}

function qotdEmbed(question, imageUrl) {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Question of the day!')
        .setImage(imageUrl)
        .setDescription(question)
        .setTimestamp()
}

function noQotdEmbed(question) {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Question of the day!')
        .setDescription(question)
        .setTimestamp()
}