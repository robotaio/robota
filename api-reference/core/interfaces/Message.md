[Core API - v0.1.0](/robota/api-reference/core/) / Message

# Interface: Message

기본 메시지 인터페이스

## Table of contents

### Properties

- [role](/robota/api-reference/core/interfaces/Message#role)
- [content](/robota/api-reference/core/interfaces/Message#content)
- [name](/robota/api-reference/core/interfaces/Message#name)
- [functionCall](/robota/api-reference/core/interfaces/Message#functioncall)
- [functionResult](/robota/api-reference/core/interfaces/Message#functionresult)

## Properties

### <a id="role" name="role"></a> role

• **role**: [`MessageRole`](/robota/api-reference/core/#messagerole)

#### Defined in

[packages/core/src/types.ts:10](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L10)

___

### <a id="content" name="content"></a> content

• **content**: `string`

#### Defined in

[packages/core/src/types.ts:11](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L11)

___

### <a id="name" name="name"></a> name

• `Optional` **name**: `string`

#### Defined in

[packages/core/src/types.ts:12](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L12)

___

### <a id="functioncall" name="functioncall"></a> functionCall

• `Optional` **functionCall**: [`FunctionCall`](/robota/api-reference/core/interfaces/FunctionCall)

#### Defined in

[packages/core/src/types.ts:13](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L13)

___

### <a id="functionresult" name="functionresult"></a> functionResult

• `Optional` **functionResult**: `any`

#### Defined in

[packages/core/src/types.ts:14](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L14)
