[Tools API - v0.1.0](/api-reference/tools/) / ToolResult

# Interface: ToolResult\<T\>

도구 실행 결과 타입

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Table of contents

### Properties

- [success](/api-reference/tools/interfaces/ToolResult#success)
- [data](/api-reference/tools/interfaces/ToolResult#data)
- [error](/api-reference/tools/interfaces/ToolResult#error)
- [metadata](/api-reference/tools/interfaces/ToolResult#metadata)

## Properties

### <a id="success" name="success"></a> success

• **success**: `boolean`

도구 실행 성공 여부

#### Defined in

[index.ts:14](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L14)

___

### <a id="data" name="data"></a> data

• `Optional` **data**: `T`

도구 실행 결과 데이터

#### Defined in

[index.ts:19](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L19)

___

### <a id="error" name="error"></a> error

• `Optional` **error**: `string`

도구 실행 중 발생한 오류

#### Defined in

[index.ts:24](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L24)

___

### <a id="metadata" name="metadata"></a> metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

추가 메타데이터

#### Defined in

[index.ts:29](https://github.com/robotaio/robota/blob/main/packages/tools/src/index.ts#L29)
