import { z } from 'zod';

// 메시지 인터페이스
export interface Message {
    role: 'user' | 'assistant' | 'system' | 'function';
    content: string;
    name?: string;
    function_call?: {
        name: string;
        arguments: string;
    };
}

// 함수 호출 모드 타입
export type FunctionCallMode = 'auto' | 'disabled' | 'force';

// 실행 옵션 인터페이스
export interface RunOptions {
    functionCallMode?: FunctionCallMode;
    forcedFunction?: string;
    forcedArguments?: Record<string, any>;
}

// 스트림 청크 인터페이스
export interface StreamChunk {
    content?: string;
    functionCall?: {
        name: string;
        arguments: string;
    };
}

// 모델 제공자 인터페이스
export interface Provider {
    getCompletion(messages: Message[], options?: RunOptions): Promise<string>;
    getCompletionStream(messages: Message[], options?: RunOptions): AsyncIterable<StreamChunk>;
}

// 메모리 인터페이스
export interface Memory {
    addMessage(message: Message): void;
    getMessages(): Message[];
    clear(): void;
}

// 기본 대화 메모리 클래스
export class ConversationMemory implements Memory {
    constructor(options?: { maxMessages?: number });
    addMessage(message: Message): void;
    getMessages(): Message[];
    clear(): void;
}

// 도구 인터페이스
export type ToolParameters = z.ZodObject<any>;

export interface ToolOptions<Params extends ToolParameters> {
    name: string;
    description: string;
    parameters: Params;
    execute: (params: z.infer<Params>) => Promise<any>;
}

// 도구 클래스
export class Tool<Params extends ToolParameters> {
    name: string;
    description: string;
    parameters: Params;
    execute: (params: z.infer<Params>) => Promise<any>;
    constructor(options: ToolOptions<Params>);
}

// 에이전트 클래스
export class Agent {
    name: string;
    description: string;
    provider: Provider;
    tools: Tool<any>[];
    systemPrompt: string;
    memory?: Memory;

    constructor(options: {
        name: string;
        description: string;
        provider: Provider;
        tools?: Tool<any>[];
        systemPrompt: string;
        memory?: Memory;
    });

    run(input: string): Promise<string>;
}

// ReAct 패턴 에이전트
export class ReActAgent extends Agent {
    constructor(options: {
        name: string;
        description: string;
        provider: Provider;
        tools?: Tool<any>[];
        systemPrompt: string;
        memory?: Memory;
    });
    run(input: string): Promise<string>;
}

// PlanningAgent 클래스
export class PlanningAgent extends Agent {
    constructor(options: {
        name: string;
        description: string;
        provider: Provider;
        tools?: Tool<any>[];
        systemPrompt: string;
        memory?: Memory;
    });
    run(input: string): Promise<string>;
}

// AgentTeam 클래스
export interface AgentTeamOptions {
    name: string;
    agents: Agent[];
    workflow: (team: { agents: Record<string, Agent> }, task: string) => Promise<string>;
}

export class AgentTeam {
    name: string;
    agents: Record<string, Agent>;
    workflow: (team: { agents: Record<string, Agent> }, task: string) => Promise<string>;

    constructor(options: AgentTeamOptions);
    run(task: string): Promise<string>;
}

// Robota 메인 클래스
export class Robota {
    provider: Provider;
    systemPrompt?: string;
    systemMessages?: Message[];
    memory?: Memory;

    constructor(options: {
        provider: Provider;
        systemPrompt?: string;
        systemMessages?: Message[];
        memory?: Memory;
    });

    registerFunctions(functions: Record<string, Function>): void;
    registerTools(tools: Tool<any>[]): void;
    setFunctionCallMode(mode: FunctionCallMode): void;
    run(input: string, options?: RunOptions): Promise<string>;
    runStream(input: string, options?: RunOptions): Promise<AsyncIterable<StreamChunk>>;
}

export { z }; 