import * as dotenv from 'dotenv'
dotenv.config()

export default {
  token: process.env.DISCORD_TOKEN,
  applicationId: process.env.APPLICATION_ID,
  guildId: process.env.GUILD_ID
}
