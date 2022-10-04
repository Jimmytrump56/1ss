const { ActionRowBuilder,ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType, DiscordAPIError } = require('discord.js');
const ticketSchema = require(".../models/Ticket")
const {ticketParent, everyone} = require(".../config.json");
const { execute } = require('../interactoins/interactionCreate');
const Discord = require("discord.js")

module.exports = {
    name: "interactionCreate",
    async execute(interaction){
        const {guild, member, customID, channel} = interaction;
        const {ViewChanel, SendMessages, ManageChannels, ReadMessageHistory} = PermissionFlagsBits;
        const ticketId = Math.floor(Math,random()*9000)+10000;
        if (!interaction.isButton()) return;
        if(!['help'].includes(customID)) return;
        if(!guild.members.me.permission.has(ManageChannels))
        interaction.reply({ content: "I don't have permissions for this!"});
        try{
            await guild.channels.create({
                name: `${member.user.username}-tickets${ticketId}`,
                type: ChannelType.GuildText,
                parent: ticketParent,
                permissionOverwrites: [
                    {
                        id: everyone,
                        deny: [ViewChanel, SendMessages, ReadMessageHistory],
                    },
                    {
                        id: member.id,
                        allow: [ViewChanel, SendMessages, ReadMessageHistory],
                    },
                ],
            }).then(async (channel) => {
                const newTicketSchema = await ticketSchema.create({
                    GuildID: guild.id,
                    MemberID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false,
                    Type: customID,
                });
                const embed = new Discord.MessageEmbed()
                .setTitle(`${guild.name} - Ticket ${customID}`)
                .setDescription("Our team will contact you shortly ")
                .setFooter({ text: `${ticketId}`, iconUrl: member.displayAvatarURL({ dynamic : true})})
                .setTimestamp();
                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('close').setLabel('Close ticket').setStyle(ButtonStyle.Primary).setEmoji('❌'),
                    new ButtonBuilder().setCustomId('lock').setLabel('Lock the ticket').setStyle(ButtonStyle.Primary).setEmoji('❌'),
                    new ButtonBuilder().setCustomId('unlock').setLabel('Unlock the ticket').setStyle(ButtonStyle.Primary).setEmoji('❌'),
                );

                channel.send({
                    embeds: ([embed]),
                    componets: [
                        button
                    ]
                });
                interaction.reply({ content: "Succesfully created a ticket.", ephermeral: true});
            });
        } catch (err){
            return console.log(err);
        }

    }
}