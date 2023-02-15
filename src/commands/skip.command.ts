import { type CacheType, type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import queue from '../utils/queue.util'

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip current song'),

  async execute (interaction: ChatInputCommandInteraction<CacheType>) {
    if (queue.getQueue(interaction.guildId ?? '') != null) {
      const guildQueue = queue.getQueue(interaction.guildId ?? '')
      guildQueue?.skipSong()
      return await interaction.reply({ content: 'Skipped current song!', ephemeral: true })
    } else {
      return await interaction.reply({ content: 'No queue found!', ephemeral: true })
    }
  }
}
