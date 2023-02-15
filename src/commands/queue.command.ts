import { type CacheType, type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import queue from '../utils/queue.util'

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show current queue'),

  async execute (interaction: ChatInputCommandInteraction<CacheType>) {
    if (queue.getQueue(interaction.guildId ?? '') != null) {
      const guildQueue = queue.getQueue(interaction.guildId ?? '')
      const songList = guildQueue?.getSongList()

      if (!songList) return await interaction.reply({ content: 'No songs found!', ephemeral: true })

      return await interaction.reply({
        content: `Current queue: \n${(songList.length > 0) ? songList.map(song => song.title).join('\n') : 'No songs found!'}`,
        ephemeral: true
      })
    } else {
      return await interaction.reply({ content: 'No queue found!', ephemeral: true })
    }
  }
}
