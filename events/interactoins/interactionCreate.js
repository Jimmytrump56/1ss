const { commandInteraction } = require('discord.js');

module.exports = {
    name: 'interactionCreate',

    execute(interaction, client){
        if(interaction.isButton()){
            const { customId } = interaction;
        }
    }
}