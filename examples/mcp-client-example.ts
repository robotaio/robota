import { Robota } from './src'; // 상대 경로는 실제 프로젝트 구조에 맞게 조정해야 합니다
import { Client, StdioClientTransport } from '@modelcontextprotocol/sdk';

// 1. MCP Transport 생성
// 여기서는 StdioClientTransport를 사용하지만 실제 환경에 맞는 transport를 선택해야 합니다
const transport = new StdioClientTransport({
    command: 'path/to/your/mcp/server', // MCP 서버 경로 설정
    args: ['--param1', '--param2'], // 필요한 매개변수 설정
    env: {
        MCP_API_KEY: process.env.MCP_API_KEY || '', // 환경 변수 설정
    },
});

// 2. MCP Client 생성
const mcpClient = new Client(transport);

// 3. MCP 제공자 초기화 (MCPProvider 클래스가 있다고 가정)
// MCPProvider가 프로젝트에 없다면 먼저 개발해야 합니다
import { MCPProvider } from './src/providers/mcp-provider'; // 실제 경로로 조정

const provider = new MCPProvider({
    type: 'client',
    client: mcpClient,
    model: 'model-name', // 사용할 모델 이름
    temperature: 0.7,
});

// 4. Robota 에이전트 인스턴스 생성
const agent = new Robota({
    name: 'MCP 에이전트',
    description: 'Model Context Protocol을 사용하는 에이전트',
    provider: provider,
    systemPrompt: '당신은 Model Context Protocol을 통해 연결된 AI 모델을 사용하는 도우미입니다.',
});

// 5. 에이전트 실행 예제
async function runExample() {
    try {
        const result = await agent.run('안녕하세요! MCP를 통해 연결된 AI 모델과 대화 중입니다.');
        console.log('에이전트 응답:', result);
    } catch (error) {
        console.error('에이전트 실행 오류:', error);
    }
}

runExample(); 