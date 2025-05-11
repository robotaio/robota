[Core API - v0.1.0](/robota/api-reference/core/) / ToolOptions

# Interface: ToolOptions

도구 생성 옵션

## Table of contents

### Properties

- [name](/robota/api-reference/core/interfaces/ToolOptions#name)
- [description](/robota/api-reference/core/interfaces/ToolOptions#description)
- [schema](/robota/api-reference/core/interfaces/ToolOptions#schema)
- [execute](/robota/api-reference/core/interfaces/ToolOptions#execute)

## Properties

### <a id="name" name="name"></a> name

• **name**: `string`

#### Defined in

[packages/core/src/tools.ts:38](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L38)

___

### <a id="description" name="description"></a> description

• `Optional` **description**: `string`

#### Defined in

[packages/core/src/tools.ts:39](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L39)

___

### <a id="schema" name="schema"></a> schema

• **schema**: `ZodObject`\<`any`, `UnknownKeysParam`, `ZodTypeAny`, {}, {}\>

#### Defined in

[packages/core/src/tools.ts:40](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L40)

___

### <a id="execute" name="execute"></a> execute

• **execute**: (`args`: `any`) => `Promise`\<`any`\>

#### Type declaration

▸ (`args`): `Promise`\<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `any` |

##### Returns

`Promise`\<`any`\>

#### Defined in

[packages/core/src/tools.ts:41](https://github.com/robotaio/robota/blob/main/packages/core/src/tools.ts#L41)
