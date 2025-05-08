import { Client } from "@modelcontextprotocol/sdk/dist/esm/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/dist/esm/client/stdio.js";

// MCP 서버 실행 명령어 설정
const transport = new StdioClientTransport({
    command: "bun",
    args: ["./mcp/mcp-demo.ts"], // 서버 실행 파일 경로에 맞게 수정
});

// MCP 클라이언트 인스턴스 생성
const client = new Client({
    name: "Demo Client",
    version: "1.0.0",
});

// 서버와 연결
await client.connect(transport);
// await client.

// 서버의 도구 목록 가져오기
const res = await client.listTools();
const tools = res.tools;
console.log("사용 가능한 도구 목록:", tools.map((tool) => tool));

// 'add' 도구 실행
const addResult = await client.callTool({
    name: "add",
    arguments: { a: 5, b: 3 },
});
console.log("add 도구 결과:", addResult);

// 연결 종료
await client.close();