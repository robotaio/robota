/**
 * Robota 도구 모듈
 */

export interface Tool {
    name: string;
    description?: string;
    execute: (...args: any[]) => Promise<any>;
}

export class ToolRegistry {
    private tools: Map<string, Tool> = new Map();

    register(tool: Tool): void {
        this.tools.set(tool.name, tool);
    }

    getTool(name: string): Tool | undefined {
        return this.tools.get(name);
    }

    getAllTools(): Tool[] {
        return Array.from(this.tools.values());
    }
} 