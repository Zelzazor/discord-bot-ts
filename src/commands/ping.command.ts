import { type CacheType, type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),
  async execute (interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.reply({ content: 'pong', ephemeral: true })
  }
}
