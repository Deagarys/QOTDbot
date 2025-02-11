const Suggestions = require("../../models/Suggestions");

module.exports = async (interaction, client) => {

    if (!interaction.isButton())
        return;

    const suggestion = await Suggestions.findOne({messageId: interaction.message.id})

    suggestion.approved = interaction.customId === 'approve';

    await suggestion.save();

    const channel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);
    const msg = await channel.messages.fetch(interaction.message.id);

    msg.edit(`Question has been ${interaction.customId === 'approve' ? 'approved ✅' : 'rejected ❌'} by <@${interaction.user.id}>`, { components: [] });
    msg.edit({ components: [] });

    console.log("🔹  - suggestion button clicked")
};