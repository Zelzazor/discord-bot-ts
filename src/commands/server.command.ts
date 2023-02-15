import { type CacheType, type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Replies with server info!'),
  async execute (interaction: ChatInputCommandInteraction<CacheType>) {
    return await interaction.reply(`This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`)
  }
}
