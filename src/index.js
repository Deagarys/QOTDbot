require('dotenv').config();

const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, REST, Routes } = require("discord.js");
const { CommandHandler } = require('djs-commander');
const Suggestions = require("../models/Suggestions");
const mongoose= require('mongoose');
const cron = require("cron");
const path = require("path");
const { qotd } = require("./qotd");

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
// rest.put(Routes.applicationCommands("process.env.BOT_ID"), { body: [] })
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

let qotdJob = new cron.CronJob(process.env.CRON, job);
async function job() {
    await qotd(client);
}