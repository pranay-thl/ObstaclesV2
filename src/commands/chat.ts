import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
import {CommandInterface} from '../types';
import {OpenAIBot} from '../controller/openai'

export class Chat implements CommandInterface {
    public _data: any;
    private _openAIbot:OpenAIBot;
    constructor() {
      this._openAIbot = new OpenAIBot();
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
        await interaction.deferReply({ephemeral: true});
        let chat = interaction.options.getString("text").trim();
        let response = await this._openAIbot.parseMessage(chat);
        let currPart="";
        for await (const part of response) {
          let partResponse = part.choices[0]?.delta?.content || '';
          if(partResponse.includes("\n") && currPart) {
            let ind=partResponse.indexOf("\n")
            currPart+=partResponse.substring(0,ind);
            await interaction.editReply({content: `${currPart}`, ephemeral: true});
            currPart+=partResponse.substring(ind);
          }
          else {
            currPart+=partResponse;
          }
        }
        await interaction.editReply({content: `${currPart}`, ephemeral: true});
        return;
        //return await interaction.editReply({content: `${response}`, ephemeral: true});
      }
      catch(err) {
        console.log(err);
        return await interaction.editReply({content:"Failed to respond!", ephemeral: true })
      }
    }
    public get data() {
      return this._data;
    }
    public get openAI() {
      return this._openAIbot;
    }
}