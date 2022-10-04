const Discord = require('discord.js');
const {Client} = require('discord.js');
const {GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions],
    partials: ['MESSAGE','REACTION','CHANNEL','USER']
})
const fs = require('fs');

client.warns = new Discord.Collection();
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
    require(`./handlers/${handler}`)(client, Discord);
})

client.on('ready', () =>{
client.user.setActivity(' TUI airlines!', {type: "WATCHING"})
})

client.login('mytoken');
