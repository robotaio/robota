[Tools API - v0.1.0](/api-reference/tools/) / CreateToolOptions

# Interface: CreateToolOptions\<TInput, TOutput\>

도구 생성 옵션

## Type parameters

| Name | Type |
| :------ | :------ |
| `TInput` | `any` |
| `TOutput` | `any` |

## Table of contents

### Properties

- [name](#name)
- [description](#description)
- [parameters](#parameters)
- [execute](#execute)

## Properties

### <a id="name" name="name"></a> name

• **name**: `string`

도구 이름

#### Defined in

[index.ts:78](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L78)

___

### <a id="description" name="description"></a> description

• `Optional` **description**: `string`

도구 설명

#### Defined in

[index.ts:83](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L83)

___

### <a id="parameters" name="parameters"></a> parameters

• `Optional` **parameters**: [`ToolParameter`](ToolParameter.md)[]

도구 파라미터 정의

#### Defined in

[index.ts:88](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L88)

___

### <a id="execute" name="execute"></a> execute

• **execute**: (`input`: `TInput`) => `Promise`\<`TOutput` \| [`ToolResult`](ToolResult.md)\<`TOutput`\>\>

도구 실행 함수

#### Type declaration

▸ (`input`): `Promise`\<`TOutput` \| [`ToolResult`](ToolResult.md)\<`TOutput`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TInput` |

##### Returns

`Promise`\<`TOutput` \| [`ToolResult`](ToolResult.md)\<`TOutput`\>\>

#### Defined in

[index.ts:93](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L93)
