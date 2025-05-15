[MCP API](../../) / [Exports](../modules) / MCPClient

# Interface: MCPClient

MCP 클라이언트 인터페이스
@modelcontextprotocol/sdk의 Client와 호환됩니다

## Table of contents

### Properties

- [chat](MCPClient#chat)
- [stream](MCPClient#stream)

## Properties

### chat

• **chat**: (`options`: `any`) => `Promise`\<`any`\>

#### Type declaration

▸ (`options`): `Promise`\<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |

##### Returns

`Promise`\<`any`\>

#### Defined in

[mcp/src/types.ts:9](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/mcp/src/types.ts#L9)

___

### stream

• **stream**: (`options`: `any`) => `AsyncIterable`\<`any`, `any`, `any`\>

#### Type declaration

▸ (`options`): `AsyncIterable`\<`any`, `any`, `any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |

##### Returns

`AsyncIterable`\<`any`, `any`, `any`\>

#### Defined in

[mcp/src/types.ts:10](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/mcp/src/types.ts#L10)
