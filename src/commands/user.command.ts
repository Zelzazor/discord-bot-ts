import { type CacheType, type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Replies with user info!'),
  async execute (interaction: ChatInputCommandInteraction<CacheType>) {
    return await interaction.reply(`This command was run by ${interaction.user.username}`)
  }
}
