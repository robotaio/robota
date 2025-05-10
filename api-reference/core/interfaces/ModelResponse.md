[Core API - v0.1.0](/api-reference/core/) / ModelResponse

# Interface: ModelResponse

모델 응답 인터페이스

## Table of contents

### Properties

- [content](/api-reference/core/interfaces/ModelResponse#content)
- [functionCall](/api-reference/core/interfaces/ModelResponse#functioncall)
- [usage](/api-reference/core/interfaces/ModelResponse#usage)
- [metadata](/api-reference/core/interfaces/ModelResponse#metadata)

## Properties

### <a id="content" name="content"></a> content

• `Optional` **content**: `string`

#### Defined in

[packages/core/src/types.ts:74](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L74)

___

### <a id="functioncall" name="functioncall"></a> functionCall

• `Optional` **functionCall**: [`FunctionCall`](/api-reference/core/interfaces/FunctionCall)

#### Defined in

[packages/core/src/types.ts:75](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L75)

___

### <a id="usage" name="usage"></a> usage

• `Optional` **usage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `promptTokens` | `number` |
| `completionTokens` | `number` |
| `totalTokens` | `number` |

#### Defined in

[packages/core/src/types.ts:76](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L76)

___

### <a id="metadata" name="metadata"></a> metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

#### Defined in

[packages/core/src/types.ts:81](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L81)
