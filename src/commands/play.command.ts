
import { type CacheType, type ChatInputCommandInteraction, type GuildMember, SlashCommandBuilder } from 'discord.js'
import ytdl from 'ytdl-core'
import queue, { Queue } from '../utils/queue.util'

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play youtube video on voice channel')
    .addStringOption(option => option.setName('url').setDescription('Youtube video url').setRequired(true)) as SlashCommandBuilder,

  async execute (interaction: ChatInputCommandInteraction<CacheType>) {
    const songUrl = interaction.options.getString('url', true) || ''
    if (!ytdl.validateURL(songUrl)) return await interaction.reply({ content: 'Invalid youtube url!', ephemeral: true })
    const member = interaction.member as GuildMember
    if (member.voice.channel === null) return await interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true })

    const songInfo = await ytdl.getInfo(songUrl)
    let guildQueue = queue.getQueue(interaction.guildId ?? '')

    if (!guildQueue) {
      const newQueue = new Queue(member.voice.channel)
      queue.addQueue(interaction.guildId ?? '', newQueue)
      guildQueue = newQueue
    }

    const song = guildQueue.getSong(songUrl)
    if (song) return await interaction.reply({ content: `Song ${song.title} is already in queue!`, ephemeral: true })

    await guildQueue.addSong({ title: songInfo.videoDetails.title, url: songUrl })
    return await interaction.reply({ content: `Song ${songInfo.videoDetails.title} added to queue!`, ephemeral: true })
  }
}
