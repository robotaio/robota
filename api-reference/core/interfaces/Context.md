[Core API - v0.1.0](../README.md) / Context

# Interface: Context

대화 컨텍스트 인터페이스

## Table of contents

### Properties

- [messages](Context.md#messages)
- [functions](Context.md#functions)
- [systemPrompt](Context.md#systemprompt)
- [systemMessages](Context.md#systemmessages)
- [metadata](Context.md#metadata)

## Properties

### <a id="messages" name="messages"></a> messages

• **messages**: [`Message`](Message.md)[]

#### Defined in

[packages/core/src/types.ts:147](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L147)

___

### <a id="functions" name="functions"></a> functions

• `Optional` **functions**: [`FunctionSchema`](FunctionSchema.md)[]

#### Defined in

[packages/core/src/types.ts:148](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L148)

___

### <a id="systemprompt" name="systemprompt"></a> systemPrompt

• `Optional` **systemPrompt**: `string`

#### Defined in

[packages/core/src/types.ts:149](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L149)

___

### <a id="systemmessages" name="systemmessages"></a> systemMessages

• `Optional` **systemMessages**: [`Message`](Message.md)[]

#### Defined in

[packages/core/src/types.ts:150](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L150)

___

### <a id="metadata" name="metadata"></a> metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

#### Defined in

[packages/core/src/types.ts:151](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L151)
