const {openticket} = require("../config.json")
const { ActionRowBuilder,ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    name: 'ticket',
    async execute (client, message, args, Discord, interaction){
        const {guild} = interaction;
        const embed = new Discord.MessageEmbed()
        .setDescription("Open a ticket in the discord server.")
        const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId('help').setLabel('Questions or help').setStyle(ButtonStyle.Primary).setEmoji('❓')
        );
        await guild.channels.cache.get(openticket).send({
            embeds: ([embed]),
            componets: [
                button
            ]
        });
        interaction.reply({ content: "Ticket message has been sent.", ephemeral: true});
    }
}