import { type CacheType, type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import queue from '../utils/queue.util'

export default {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop current queue'),

  async execute (interaction: ChatInputCommandInteraction<CacheType>) {
    if (queue.getQueue(interaction.guildId ?? '') != null) {
      const guildQueue = queue.getQueue(interaction.guildId ?? '')
      guildQueue?.stop()
      queue.removeQueue(interaction.guildId ?? '')
      return await interaction.reply({ content: 'Stopped queue!', ephemeral: true })
    } else {
      return await interaction.reply({ content: 'No queue found!', ephemeral: true })
    }
  }
}
