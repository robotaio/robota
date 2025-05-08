/**
 * Robota 라이브러리 코어 모듈
 */

const { z } = require('zod');

// 메시지 인터페이스
class Message {
    constructor(data) {
        this.role = data.role;
        this.content = data.content;
        if (data.name) this.name = data.name;
        if (data.function_call) this.function_call = data.function_call;
    }
}

// 메모리 인터페이스
class ConversationMemory {
    constructor(options = {}) {
        this.messages = [];
        this.maxMessages = options.maxMessages || 100;
    }

    addMessage(message) {
        this.messages.push(message);
        if (this.messages.length > this.maxMessages) {
            this.messages = this.messages.slice(this.messages.length - this.maxMessages);
        }
    }

    getMessages() {
        return [...this.messages];
    }

    clear() {
        this.messages = [];
    }
}

// 도구 클래스
class Tool {
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.parameters = options.parameters;
        this.execute = options.execute;
    }
}

// 에이전트 클래스
class Agent {
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.provider = options.provider;
        this.tools = options.tools || [];
        this.systemPrompt = options.systemPrompt;
        this.memory = options.memory;
    }

    async run(input) {
        console.log(`[${this.name}] 입력 받음: ${input}`);

        const messages = [];

        if (this.systemPrompt) {
            messages.push({ role: 'system', content: this.systemPrompt });
        }

        if (this.memory) {
            messages.push(...this.memory.getMessages());
        }

        messages.push({ role: 'user', content: input });

        const response = await this.provider.getCompletion(messages);

        if (this.memory) {
            this.memory.addMessage({ role: 'user', content: input });
            this.memory.addMessage({ role: 'assistant', content: response });
        }

        return response;
    }
}

// ReAct 패턴 에이전트
class ReActAgent extends Agent {
    constructor(options) {
        super(options);
    }

    async run(input) {
        console.log(`[ReAct ${this.name}] 입력 받음: ${input}`);
        return super.run(input);
    }
}

// 계획 에이전트
class PlanningAgent extends Agent {
    constructor(options) {
        super(options);
    }

    async run(input) {
        console.log(`[Planning ${this.name}] 입력 받음: ${input}`);
        return super.run(input);
    }
}

// 에이전트 팀
class AgentTeam {
    constructor(options) {
        this.name = options.name;
        this.agents = options.agents.reduce((map, agent) => {
            const key = agent.name.toLowerCase().replace(/\s+/g, '');
            map[key] = agent;
            return map;
        }, {});
        this.workflow = options.workflow;
    }

    async run(task) {
        console.log(`[Team ${this.name}] 작업 시작: ${task}`);
        return this.workflow({ agents: this.agents }, task);
    }
}

// Robota 메인 클래스
class Robota {
    constructor(options) {
        this.provider = options.provider;
        this.systemPrompt = options.systemPrompt;
        this.systemMessages = options.systemMessages;
        this.memory = options.memory || new ConversationMemory();
        this.functions = {};
        this.tools = [];
        this.functionCallMode = 'auto';
    }

    registerFunctions(functions) {
        this.functions = { ...this.functions, ...functions };
        console.log('[Robota] 함수 등록됨:', Object.keys(functions));
    }

    registerTools(tools) {
        this.tools.push(...tools);
        console.log('[Robota] 도구 등록됨:', tools.map(t => t.name));
    }

    setFunctionCallMode(mode) {
        this.functionCallMode = mode;
        console.log('[Robota] 함수 호출 모드 설정:', mode);
    }

    async run(input, options) {
        console.log('[Robota] 입력 받음:', input);

        const messages = [];

        if (this.systemPrompt) {
            messages.push({ role: 'system', content: this.systemPrompt });
        } else if (this.systemMessages) {
            messages.push(...this.systemMessages);
        }

        if (this.memory) {
            messages.push(...this.memory.getMessages());
        }

        messages.push({ role: 'user', content: input });

        let responseText = '';

        if (options?.functionCallMode === 'force' && options.forcedFunction) {
            console.log(`[Robota] 강제 함수 호출: ${options.forcedFunction}`);

            if (this.functions[options.forcedFunction]) {
                const args = options.forcedArguments || {};
                try {
                    const result = await this.functions[options.forcedFunction](...Object.values(args));
                    responseText = `함수 ${options.forcedFunction}을(를) 호출했습니다. 결과: ${JSON.stringify(result)}`;
                } catch (error) {
                    responseText = `함수 호출 중 오류가 발생했습니다: ${String(error)}`;
                }
            } else {
                responseText = `요청한 함수 ${options.forcedFunction}을(를) 찾을 수 없습니다.`;
            }
        } else {
            responseText = await this.provider.getCompletion(messages, options);

            if (
                this.functionCallMode === 'auto' ||
                options?.functionCallMode === 'auto'
            ) {
                for (const [funcName, func] of Object.entries(this.functions)) {
                    if (input.toLowerCase().includes(funcName.toLowerCase())) {
                        console.log(`[Robota] 자동 함수 호출 감지: ${funcName}`);

                        try {
                            const result = await func();
                            responseText += `\n\n함수 ${funcName}을(를) 호출했습니다. 결과: ${JSON.stringify(result)}`;
                        } catch (error) {
                            console.error(`[Robota] 함수 호출 오류:`, error);
                        }

                        break;
                    }
                }
            }
        }

        if (this.memory) {
            this.memory.addMessage({ role: 'user', content: input });
            this.memory.addMessage({ role: 'assistant', content: responseText });
        }

        return responseText;
    }

    async runStream(input, options) {
        console.log('[Robota] 스트리밍 입력 받음:', input);

        const messages = [];

        if (this.systemPrompt) {
            messages.push({ role: 'system', content: this.systemPrompt });
        } else if (this.systemMessages) {
            messages.push(...this.systemMessages);
        }

        if (this.memory) {
            messages.push(...this.memory.getMessages());
        }

        messages.push({ role: 'user', content: input });

        if (this.memory) {
            this.memory.addMessage({ role: 'user', content: input });
        }

        return this.provider.getCompletionStream(messages, options);
    }
}

module.exports = {
    Message,
    ConversationMemory,
    Tool,
    Agent,
    ReActAgent,
    PlanningAgent,
    AgentTeam,
    Robota,
    z
}; 