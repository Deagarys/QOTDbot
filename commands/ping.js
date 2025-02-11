const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong!'),

    run: ({ interaction, client, handler }) => {
        interaction.reply({
            content: `Pong! ${client.ws.ping}ms`,
            ephemeral: true
        });
    },
    devOnly: true,
};