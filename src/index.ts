/**
 * Robota - 에이전틱 AI를 쉽게 만들 수 있는 JavaScript 라이브러리
 */

// 코어 클래스 및 인터페이스
export { RobotaCore } from './core/robota';
export { Robota } from './core/agent';
export { Tool } from './core/tool';
export type { RobotaCoreOptions, RunOptions } from './core/robota';
export type { RobotaOptions } from './core/agent';

// 제공업체
export { BaseToolProvider } from './providers/base-provider';
export { OpenAIProvider } from './providers/openai-provider';

// 함수 호출 및 도구
export { createFunction } from './core/function';

// 유틸리티
export { ConversationMemory } from './utils/conversation-memory';

// 타입
export type {
  ToolProvider,
  ToolProviderOptions,
  ToolProviderResponse,
  ToolProviderResponseStream
} from './types/provider';

export type {
  Message,
  FunctionSchema,
  ModelContext,
  ModelResponse
} from './types/model-context-protocol';

export type {
  Tool as ToolType,
  ToolOptions,
  ToolParameter,
  ToolResult
} from './types/tool';

export type {
  Function,
  FunctionOptions,
  FunctionResult
} from './types/function';

export * from './types/mcp';

// 버전 정보
export const VERSION = '0.1.0';

// 클라이언트 어댑터 관련 함수 export
export {
  createMcpToolProvider,
  createOpenAPIToolProvider,
  createFunctionToolProvider,
  createZodFunctionToolProvider,
} from './core/client-adapter'; 