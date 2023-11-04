import { Client, REST, Routes, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import {commands} from "./commands";

dotenv.config();
const TOKEN: string = process.env["TOKEN"] as string;
const TEST_GUILD_ID: string = process.env["TEST_GUILD_ID"] as string;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
});

async function registerCommands(clientID: string) {
  const commandsData = Object.values(commands).map(
    (command: any) => command.data
  );
  const rest = new REST({ version: "10" }).setToken(TOKEN);
  if (TEST_GUILD_ID) {
    await rest.put(Routes.applicationGuildCommands(clientID, TEST_GUILD_ID), {
      body: commandsData,
    });
    console.log(
      "Successfully registered application commands for development guild"
    );
  } else {
    await rest.put(Routes.applicationCommands(clientID), {
      body: commandsData,
    });
    console.log("Successfully registered application commands globally");
  }
}

client.once("ready", async () => {
  await registerCommands(client.user?.id as any);
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
      let currCommand = commands[commandName as keyof typeof commands] as any;
      try {
        await currCommand.execute(interaction);
      } catch (error) {
        if (error) console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
});
client.login(TOKEN);