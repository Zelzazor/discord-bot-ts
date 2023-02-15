import { type CacheType, type ChatInputCommandInteraction, Collection, type SlashCommandBuilder } from 'discord.js'
import userCommand from './user.command'
import serverCommand from './server.command'
import pingCommand from './ping.command'
import playCommand from './play.command'
import queueCommand from './queue.command'
import skipCommand from './skip.command'
import stopCommand from './stop.command'

const commands = {
  user: userCommand,
  server: serverCommand,
  ping: pingCommand,
  play: playCommand,
  queue: queueCommand,
  skip: skipCommand,
  stop: stopCommand
}

const discordCommands = new Collection<string, { data: SlashCommandBuilder, execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<any> }>()

for (const command of Object.values(commands)) {
  if (!command.data || !command.execute) {
    console.log(`Command ${command.data.name} is missing data or execute function.`)
    continue
  }

  discordCommands.set(command.data.name, command)
}

export default discordCommands
