import OpenAI from 'openai';
export class OpenAIBot {
    private openAIClient: OpenAI;
    private userContext: Record<string,any>;
    constructor() {
        const OPENAI_API_KEY: string = process.env["OPENAI_API_KEY"] as string;
        this.openAIClient = new OpenAI({apiKey: OPENAI_API_KEY});
        this.userContext = {};
    }
    async updateContext(userId: string,message: {role: string, content: string}) {
        try{
            if(!this.userContext[userId]) {
                this.userContext[userId] = [];
                setTimeout(() => {
                    this.userContext[userId] = [];
                }, 3600000);
            }
            this.userContext[userId].push(message);
        }
        catch(err) {
            //pass
        }
    }
    async parseMessage(userId:string,message: string): Promise<any> {
        try{
            this.updateContext(userId,{role: 'user', content: message});
            const chatStream = await this.openAIClient.chat.completions.create({
                messages: this.userContext[userId],
                model: 'gpt-4o',
                stream: true
            });
            return chatStream;
        }
        catch(err){
            //todo
            //reset user context
            this.userContext[userId] = [];
            throw err;
        }
    }
}