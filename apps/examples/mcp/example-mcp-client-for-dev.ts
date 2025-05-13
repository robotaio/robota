import { McpClient } from "@modelcontextprotocol/sdk/client/mcp.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// MCP 서버 실행 명령어 설정
const transport = new StdioClientTransport({
    command: "node",
    args: ["../mcp-server/dist/index.js"], // 서버 실행 파일 경로에 맞게 수정
});

// MCP 클라이언트 인스턴스 생성
const client = new McpClient({
    name: "Demo Client",
    version: "1.0.0",
});

// 서버와 연결
await client.connect(transport);

// 서버의 도구 목록 가져오기
const tools = await client.listTools();
console.log("사용 가능한 도구 목록:", tools.map((tool) => tool.name));

// 'add' 도구 실행
const addResult = await client.callTool("add", { a: 5, b: 3 });
console.log("add 도구 결과:", addResult);

// 'greeting' 리소스 가져오기
const resource = await client.getResource("greeting://Alice");
console.log("greeting 리소스 내용:", resource.contents[0].text);

// 연결 종료
await client.close();