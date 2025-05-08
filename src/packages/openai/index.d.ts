import { Message, RunOptions, Provider, StreamChunk } from '@robota/core';

// OpenAI 제공자 클래스
export class OpenAIProvider implements Provider {
    constructor(options: {
        client: any;
        model: string;
        temperature?: number;
    });

    getCompletion(messages: Message[], options?: RunOptions): Promise<string>;
    getCompletionStream(messages: Message[], options?: RunOptions): AsyncIterable<StreamChunk>;
} 