import { REST, Routes } from 'discord.js'
import commands from './commands'
import config from './config'

const commandsArray = Array.from(commands.values()).map(command => command.data.toJSON())

const rest = new REST({ version: '10' }).setToken(config.token ?? '')

void (async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    const data: any = await rest.put(
      Routes.applicationGuildCommands(config.applicationId ?? '', config.guildId ?? ''),
      { body: commandsArray }
    )

    console.log(`Successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    console.error(error)
  }
})()
