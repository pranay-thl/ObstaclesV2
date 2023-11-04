import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import {CommandInterface} from '../types';

export class Chat implements CommandInterface {
    public _data: any;
    constructor() {
      this._data = new SlashCommandBuilder()
        .setName("chat")
        .setDescription("Chat with Obstacles!")
        .addStringOption((option) => 
            option
                .setName("text")
                .setDescription("type your message")
                .setRequired(true)
        );
    }
    async execute(interaction: any): Promise<void> {
      try{
        let chat = interaction.options.getString("text").trim();
        return await interaction.reply({content: `echo : ${chat}`, ephemeral: true});
      }
      catch(err) {
        console.log(err);
        return await interaction.reply({content:"Failed to respond!", ephemeral: true })
      }
    }
    public get data() {
      return this._data;
    }
}