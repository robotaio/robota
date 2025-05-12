[Core API](../../) / [Exports](../modules) / Context

# Interface: Context

대화 컨텍스트 인터페이스

## Table of contents

### Properties

- [functions](Context#functions)
- [messages](Context#messages)
- [metadata](Context#metadata)
- [systemMessages](Context#systemmessages)
- [systemPrompt](Context#systemprompt)

## Properties

### functions

• `Optional` **functions**: [`FunctionSchema`](FunctionSchema)[]

#### Defined in

[packages/core/src/types.ts:148](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/types.ts#L148)

___

### messages

• **messages**: [`Message`](Message)[]

#### Defined in

[packages/core/src/types.ts:147](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/types.ts#L147)

___

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

#### Defined in

[packages/core/src/types.ts:151](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/types.ts#L151)

___

### systemMessages

• `Optional` **systemMessages**: [`Message`](Message)[]

#### Defined in

[packages/core/src/types.ts:150](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/types.ts#L150)

___

### systemPrompt

• `Optional` **systemPrompt**: `string`

#### Defined in

[packages/core/src/types.ts:149](https://github.com/robotaio/robota/blob/9579105c51358f78d543b68192b3502c0ddd981f/packages/core/src/types.ts#L149)
