import type Discord from 'discord.js'
import type DiscordVoice from '@discordjs/voice'

export interface Song {
  title: string
  url: string
}

export interface IQueue {
  voiceChannel: Discord.VoiceBasedChannel
  audioPlayer: DiscordVoice.AudioPlayer
  connection: DiscordVoice.VoiceConnection | null
  songs: Song[]

  play: (song: Song) => void
  stop: () => void
  skipSong: () => void
  skip: () => void
  addSong: (song: Song) => void
  getSong: (url: string) => Song | undefined
  getSongList: () => Song[]
}
