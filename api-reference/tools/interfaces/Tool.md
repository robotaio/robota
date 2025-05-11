[Tools API - v0.1.0](/robota/api-reference/tools/) / Tool

# Interface: Tool\<TInput, TOutput\>

도구 인터페이스

## Type parameters

| Name | Type |
| :------ | :------ |
| `TInput` | `any` |
| `TOutput` | `any` |

## Table of contents

### Properties

- [name](/robota/api-reference/tools/interfaces/Tool#name)
- [description](/robota/api-reference/tools/interfaces/Tool#description)
- [parameters](/robota/api-reference/tools/interfaces/Tool#parameters)
- [execute](/robota/api-reference/tools/interfaces/Tool#execute)

## Properties

### <a id="name" name="name"></a> name

• **name**: `string`

도구 이름

#### Defined in

[index.ts:50](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L50)

___

### <a id="description" name="description"></a> description

• `Optional` **description**: `string`

도구 설명

#### Defined in

[index.ts:55](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L55)

___

### <a id="parameters" name="parameters"></a> parameters

• `Optional` **parameters**: [`ToolParameter`](/robota/api-reference/tools/interfaces/ToolParameter)[]

도구 파라미터 정의

#### Defined in

[index.ts:60](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L60)

___

### <a id="execute" name="execute"></a> execute

• **execute**: (`input`: `TInput`) => `Promise`\<[`ToolResult`](/robota/api-reference/tools/interfaces/ToolResult)\<`TOutput`\>\>

도구 실행 함수

#### Type declaration

▸ (`input`): `Promise`\<[`ToolResult`](/robota/api-reference/tools/interfaces/ToolResult)\<`TOutput`\>\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `TInput` | 도구 입력 파라미터 |

##### Returns

`Promise`\<[`ToolResult`](/robota/api-reference/tools/interfaces/ToolResult)\<`TOutput`\>\>

#### Defined in

[index.ts:68](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L68)
