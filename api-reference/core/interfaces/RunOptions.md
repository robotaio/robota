[Core API - v0.1.0](/api-reference/core/) / RunOptions

# Interface: RunOptions

실행 옵션 인터페이스

## Table of contents

### Properties

- [systemPrompt](/api-reference/core/interfaces/RunOptions#systemprompt)
- [functionCallMode](/api-reference/core/interfaces/RunOptions#functioncallmode)
- [forcedFunction](/api-reference/core/interfaces/RunOptions#forcedfunction)
- [forcedArguments](/api-reference/core/interfaces/RunOptions#forcedarguments)
- [temperature](/api-reference/core/interfaces/RunOptions#temperature)
- [maxTokens](/api-reference/core/interfaces/RunOptions#maxtokens)

## Properties

### <a id="systemprompt" name="systemprompt"></a> systemPrompt

• `Optional` **systemPrompt**: `string`

#### Defined in

[packages/core/src/types.ts:113](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L113)

___

### <a id="functioncallmode" name="functioncallmode"></a> functionCallMode

• `Optional` **functionCallMode**: [`FunctionCallMode`](/api-reference/core/#functioncallmode)

#### Defined in

[packages/core/src/types.ts:114](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L114)

___

### <a id="forcedfunction" name="forcedfunction"></a> forcedFunction

• `Optional` **forcedFunction**: `string`

#### Defined in

[packages/core/src/types.ts:115](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L115)

___

### <a id="forcedarguments" name="forcedarguments"></a> forcedArguments

• `Optional` **forcedArguments**: `Record`\<`string`, `any`\>

#### Defined in

[packages/core/src/types.ts:116](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L116)

___

### <a id="temperature" name="temperature"></a> temperature

• `Optional` **temperature**: `number`

#### Defined in

[packages/core/src/types.ts:117](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L117)

___

### <a id="maxtokens" name="maxtokens"></a> maxTokens

• `Optional` **maxTokens**: `number`

#### Defined in

[packages/core/src/types.ts:118](https://github.com/robotaio/robota/blob/main/packages/core/src/types.ts#L118)
