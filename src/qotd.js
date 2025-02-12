const Suggestions = require("../models/Suggestions");
const {EmbedBuilder} = require("discord.js");

module.exports = {
    qotd: async (client) => {
        const count = await Suggestions.countDocuments({approved: true, asked: false}, {});
        var random = Math.floor(Math.random() * count)

        const question = await Suggestions.findOne({approved: true, asked: false}).skip(random);

        if (question === undefined || question === null) {
            console.log("❌ - No qotd in db");
            const embed = noQotdEmbed("There are currently no questions. Use /suggest to suggest more questions!");
            await client.channels.cache.get(process.env.QOTD_CHANNEL_ID).send({
                content: `<@&${process.env.QOTD_ROLE_ID}>`,
                embeds: [embed]
            });
            return;
        }

        const embed = qotdEmbed(question.question, question.imageUrl);
        let message = await client.channels.cache.get(process.env.QOTD_CHANNEL_ID).send({
            content: `<@&${process.env.QOTD_ROLE_ID}>`,
            embeds: [embed]
        });

        question.asked = true;
        await question.save();

        console.log("🔹  - qotdJob ran")
    }
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