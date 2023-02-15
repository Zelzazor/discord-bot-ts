import { Client, Events, GatewayIntentBits } from 'discord.js'
import commands from './commands'
import config from './config'

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] })

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = commands.get(interaction.commandName)

  if (command == null) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
  }
})

void client.login(config.token ?? '')
