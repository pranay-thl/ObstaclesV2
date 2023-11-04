import OpenAI from 'openai';
export class OpenAIBot {
    private openAIClient: OpenAI;
    constructor() {
        const OPENAI_API_KEY: string = process.env["OPENAI_API_KEY"] as string;
        this.openAIClient = new OpenAI({apiKey: OPENAI_API_KEY});
    }
    async parseMessage(message: string): Promise<any> {
        try{
            const chatStream = await this.openAIClient.chat.completions.create({
                messages: [{ role: 'user', content: message }],
                model: 'gpt-3.5-turbo',
                stream: true
            });
            return chatStream;
        }
        catch(err){
            //todo
            throw err;
        }
    }
}