const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const Suggestions = require('../models/Suggestions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggest a question for the QOTDs!')
        .addStringOption((option) =>
            option
                .setName('question')
                .setDescription('The question you want to suggest')
                .setRequired(true))
        .addAttachmentOption((option) =>
            option
                .setName("image")
                .setDescription("Image to go with the question")
                .setRequired(false)),

    run: async ({interaction, client, handler}) => {

        const question = interaction.options.get('question').value;
        let imageUrl = null;

        if (interaction.options.get('image') !== null)
            imageUrl = interaction.options.get('image').attachment.url;

        const embed = reviewEmbed(question, interaction.member.nickname || interaction.user.globalName, interaction.user.avatarURL(), imageUrl);
        const approve = new ButtonBuilder()
            .setCustomId('approve')
            .setLabel('Approve')
            .setStyle(ButtonStyle.Success);

        const reject = new ButtonBuilder()
            .setCustomId('reject')
            .setLabel('Reject')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(approve, reject);

        let message = await client.channels.cache.get(process.env.LOG_CHANNEL_ID).send({ content: `<@${interaction.user.id}>, has suggested the following:`, embeds: [embed], components: [row] });

        const newSuggestion = new Suggestions({
            question: question,
            approved: false,
            messageId: message.id,
            asked: false,
            imageUrl: imageUrl
        });

        await newSuggestion.save();

        interaction.reply({
            content: `Your question has been suggested!`,
            ephemeral: true
        });

        console.log("🔹  - New suggestion")
    },
    devOnly: false,
};

function reviewEmbed(question, nickname, avatarUrl, imageUrl) {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('QOTD Review')
        .setImage(imageUrl)
        .addFields(
            { name: 'Question', value: question },
        )
        .setTimestamp()
        .setFooter({ text: nickname, iconURL: avatarUrl });
}