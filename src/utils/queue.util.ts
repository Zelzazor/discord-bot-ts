import type Discord from 'discord.js'
import * as DiscordVoice from '@discordjs/voice'
import { createAudioPlayer, createAudioResource, joinVoiceChannel, demuxProbe } from '@discordjs/voice'
import ytdl from 'ytdl-core'
import { type IQueue, type Song } from '../interfaces'
import type internal from 'stream'

async function probeAndCreateResource (readableStream: internal.Readable): Promise<DiscordVoice.AudioResource> {
  const { stream, type } = await demuxProbe(readableStream)
  return createAudioResource(stream, { inputType: type })
}

export class Queue implements IQueue {
  voiceChannel: Discord.VoiceBasedChannel
  audioPlayer: DiscordVoice.AudioPlayer
  connection: DiscordVoice.VoiceConnection | null
  songs: Song[]

  constructor(voiceChannel: Discord.VoiceBasedChannel) {
    this.voiceChannel = voiceChannel
    this.audioPlayer = createAudioPlayer()
    this.connection = null
    this.songs = []

    this.audioPlayer.on('error', error => {
      console.error('Error:', error.message, 'with track', error.resource.metadata)
    })

    this.audioPlayer.on('stateChange', (_oldState, newState) => {
      if (newState.status === DiscordVoice.AudioPlayerStatus.Idle) {
        this.skip()
      }
    })
  }

  async play(song: Song): Promise<void> {
    try {
      const stream = ytdl(song.url, { filter: 'audioonly' })
      const resource = await probeAndCreateResource(stream)

      this.audioPlayer.play(resource)

      if (this.connection == null) {
        this.connection = joinVoiceChannel({
          channelId: this.voiceChannel.id,
          guildId: this.voiceChannel.guild.id,
          adapterCreator: this.voiceChannel.guild.voiceAdapterCreator
        })
      }
      console.log('Playing song: ' + song.title)
      this.connection.subscribe(this.audioPlayer)
    } catch (err) {
      console.error(err)
    }
  }

  stop(): void {
    if (this.connection != null) this.connection.destroy()
    this.songs = []
  }

  skipSong(): void {
    this.audioPlayer.stop(true)
  }

  skip(): void {
    this.songs.shift()
    if (this.songs.length === 0) { this.stop(); return }

    void this.play(this.songs[0])
  }

  async addSong(song: Song): Promise<void> {
    if (this.audioPlayer.state.status === DiscordVoice.AudioPlayerStatus.Idle) await this.play(song)
    this.songs.push(song)
  }

  getSong(url: string): Song | undefined {
    return this.songs.find((song) => song.url === url)
  }

  getSongList(): Song[] {
    return this.songs
  }
}

export class QueueConstructor {
  private static instance: QueueConstructor
  private readonly queues: Map<string, Queue>

  private constructor () {
    this.queues = new Map()
  }

  public static getInstance (): QueueConstructor {
    if (!QueueConstructor.instance) {
      QueueConstructor.instance = new QueueConstructor()
    }

    return QueueConstructor.instance
  }

  public getQueue(guildId: string): Queue | undefined {
    return this.queues.get(guildId)
  }

  public addQueue(guildId: string, queue: Queue): void {
    this.queues.set(guildId, queue)
  }

  public removeQueue(guildId: string): void {
    this.queues.delete(guildId)
  }
}

const queue = QueueConstructor.getInstance()

export default queue
