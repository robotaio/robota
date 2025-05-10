Tools API

# Tools API - v0.1.0

## Table of contents

### Classes

- [ToolRegistry](/api-reference/tools/classes/ToolRegistry.md)

### Interfaces

- [ToolResult](/api-reference/tools/interfaces/ToolResult.md)
- [ToolParameter](/api-reference/tools/interfaces/ToolParameter.md)
- [Tool](/api-reference/tools/interfaces/Tool.md)
- [CreateToolOptions](/api-reference/tools/interfaces/CreateToolOptions.md)

### Functions

- [createTool](#createtool)

## Functions

### <a id="createtool" name="createtool"></a> createTool

▸ **createTool**\<`TInput`, `TOutput`\>(`options`): [`Tool`](/api-reference/tools/interfaces/Tool.md)\<`TInput`, `TOutput`\>

도구 생성 함수

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TInput` | `any` |
| `TOutput` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`CreateToolOptions`](/api-reference/tools/interfaces/CreateToolOptions.md)\<`TInput`, `TOutput`\> | 도구 생성 옵션 |

#### Returns

[`Tool`](/api-reference/tools/interfaces/Tool.md)\<`TInput`, `TOutput`\>

생성된 도구

**`Example`**

```ts
const weatherTool = createTool({
  name: 'getWeather',
  description: '특정 위치의 날씨 정보를 가져옵니다',
  parameters: [
    { name: 'location', type: 'string', description: '위치 (도시명)', required: true }
  ],
  execute: async ({ location }) => {
    // 날씨 API 호출 로직
    return { temperature: 25, humidity: 60, conditions: '맑음' };
  }
});
```

#### Defined in

[index.ts:117](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L117)
