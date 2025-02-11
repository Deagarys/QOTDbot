const { ActivityType } = require("discord.js");
module.exports = (argument, client, handler) => {
    client.user.setActivity({
        name: "Check out my makers streams!",
        type: ActivityType.Streaming,
        url: 'https://twitch.tv/deagarys'
    });
    console.log("✅  - status set");
};