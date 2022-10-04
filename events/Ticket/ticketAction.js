const Discord = require('discord.js');
const {createTranscript} = require('discord-html-transcripts')
const {ButtonInteraction, PermissionFlagBits} = require('discord.js');
const {transcripts} = require(".../config.json");
const ticketSchema = require(".../models/Ticket.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction){
        const {guild, member, customId, channel} = interaction
        const {ManageChannels, SendMessages} = PermissionFlagBits

        if(!interaction.isButton()) return;
        if(!["close", "lock", "unlock"].includes(customId)) return;

        if(!guild.members.me.permission.has(ManageChannels))
            return interaction.reply({content: "I do not have the permissions for this. ", ephermal: true});

        const embed = new Discord.MessageEmbed()
        .setColor("Aqua")

        ticketSchema.findOne({ChannelID: channel.id}, async (err, data)=>{
            if(err) throw err;
            if(!data) return;

            const fetchedMember = await guild.members.cache.get(data.MemberID);

            switch(customId){
                case "closed":
                    if(data.closed == true)
                    return interaction.reply({content: "Ticket is getting deleted...", ephermal: true});

                    const transcript = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        filename: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`,
                    });
                    await ticketSchema.updateOne({ ChannelID: channel.id},{Closed: true})

                    const transcriptEmbed = new Discord.MessageEmbed()
                    .setTitle(`Transcript ID: ${data.TicketID}`)
                    .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
                    .setColor('RED')
                    .setTimestamp();

                    const transcriptProcess = new Discord.MessageEmbed()
                    .setTitle(`Saving transcript...`)
                    .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
                    .setColor('RED')
                    .setDescription("Ticket will be closed in 10s, enable DMs to recieve this ticket's transcript!")
                    .setTimestamp();

                    const res = await guild.channels.cache.get(transcripts).send({
                        embeds: [transcriptEmbed],
                        files: [transcript]

                    });
                    channel.send({embeds: [transcriptProcess]});

                    setTimeout(function(){
                        member.send({
                            embeds: [transcriptEmbed.setDescription(`Access your ticket transcript: ${res.url}`)]
                        }).catch(()=> channel.send('Couldn\'t send transcript to direct messages'));
                        channel.delete();
                    }, 10000);
                    break;
                    case "lock":
                        if(!message.member.roles.cache.find((role) => role.name === 'staff')) return interaction.reply({ content: 'You do not have permission for that!', ephermal: true});

                        if(data.Locked == true)
                        return interaction.reply({content: 'Ticket is already locked!', ephermal: true});

                        await ticketSchema.updateOne({ ChannelID: channel.id}, {Locked: true});
                        embed.setDescription("Ticket was locked succefully 🔒");
                        channel.permissionOverwrites.edit(fetchedMember, {SendMessages: false});
                        return interaction.reply({ embeds: [embed]});
                    case "unlock":
                        if(!message.member.roles.cache.find((role) => role.name === 'staff')) return interaction.reply({ content: 'You do not have permission for that!', ephermal: true});

                        if(data.Locked == false)
                        return interaction.reply({content: 'Ticket is already unlocked!', ephermal: true});

                        await ticketSchema.updateOne({ ChannelID: channel.id}, {Locked: false});
                        embed.setDescription("Ticket was unlocked succefully 🔒");
                       // channel.permissionOverwrites.edit(fetchedMember, {SendMessages: false});
                        return interaction.reply({ embeds: [embed]});
            };
        })
    }
}