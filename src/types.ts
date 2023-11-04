import { CommandInteraction, SlashCommandBuilder } from "discord.js";
export interface CommandInterface {
    data : any,
    execute(interaction: CommandInteraction): void;
}