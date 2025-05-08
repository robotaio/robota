import { z } from 'zod';
import type { FunctionDefinition } from './types';

/**
 * 도구 인터페이스
 */
export interface Tool {
  /**
   * 도구 이름
   */
  name: string;
  
  /**
   * 도구 설명
   */
  description?: string;
  
  /**
   * 도구 매개변수 스키마
   */
  schema: z.ZodObject<any>;
  
  /**
   * 도구 실행 함수
   */
  execute: (args: any) => Promise<any>;
  
  /**
   * 함수 정의로 변환
   */
  toFunctionDefinition(): FunctionDefinition;
}

/**
 * 도구 생성 옵션
 */
export interface ToolOptions {
  name: string;
  description?: string;
  schema: z.ZodObject<any>;
  execute: (args: any) => Promise<any>;
}

/**
 * 도구 클래스
 */
export class SimpleTool implements Tool {
  name: string;
  description?: string;
  schema: z.ZodObject<any>;
  execute: (args: any) => Promise<any>;
  
  constructor(options: ToolOptions) {
    this.name = options.name;
    this.description = options.description;
    this.schema = options.schema;
    this.execute = options.execute;
  }
  
  /**
   * 함수 정의로 변환
   */
  toFunctionDefinition(): FunctionDefinition {
    const shape = this.schema.shape;
    const properties: Record<string, any> = {};
    
    // Zod 스키마를 JSON 스키마 형식으로 변환
    for (const [key, schema] of Object.entries(shape)) {
      properties[key] = {
        type: this.getSchemaType(schema as z.ZodTypeAny),
        description: (schema as any)._def.description || undefined
      };
      
      // 열거형 값이 있는 경우 추가
      if ((schema as any)._def.values) {
        properties[key].enum = (schema as any)._def.values;
      }
    }
    
    return {
      name: this.name,
      description: this.description,
      parameters: {
        type: 'object',
        properties
      }
    };
  }
  
  /**
   * Zod 스키마 타입을 JSON 스키마 타입으로 변환
   */
  private getSchemaType(schema: z.ZodTypeAny): string {
    if (schema instanceof z.ZodString) {
      return 'string';
    } else if (schema instanceof z.ZodNumber) {
      return 'number';
    } else if (schema instanceof z.ZodBoolean) {
      return 'boolean';
    } else if (schema instanceof z.ZodArray) {
      return 'array';
    } else if (schema instanceof z.ZodObject) {
      return 'object';
    } else if (schema instanceof z.ZodEnum) {
      return 'string';
    } else {
      return 'any';
    }
  }
}

/**
 * 도구 레지스트리
 */
export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  
  /**
   * 도구 등록
   */
  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }
  
  /**
   * 도구 이름으로 도구 가져오기
   */
  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }
  
  /**
   * 모든 도구의 함수 정의 가져오기
   */
  getFunctionDefinitions(): FunctionDefinition[] {
    return Array.from(this.tools.values()).map(tool => tool.toFunctionDefinition());
  }
  
  /**
   * 도구 실행
   */
  async execute(name: string, args: Record<string, any>): Promise<any> {
    const tool = this.tools.get(name);
    
    if (!tool) {
      throw new Error(`도구 '${name}'가 등록되지 않았습니다`);
    }
    
    // 스키마 검증
    const validatedArgs = tool.schema.parse(args);
    return await tool.execute(validatedArgs);
  }
} 