[Anthropic API - v0.1.0](/robota/api-reference/anthropic/) / AnthropicProviderOptions

# Interface: AnthropicProviderOptions

Anthropic 제공업체 옵션

## Hierarchy

- `ProviderOptions`

  ↳ **`AnthropicProviderOptions`**

## Table of contents

### Properties

- [apiKey](/robota/api-reference/anthropic/interfaces/AnthropicProviderOptions#apikey)
- [model](/robota/api-reference/anthropic/interfaces/AnthropicProviderOptions#model)
- [temperature](/robota/api-reference/anthropic/interfaces/AnthropicProviderOptions#temperature)
- [maxTokens](/robota/api-reference/anthropic/interfaces/AnthropicProviderOptions#maxtokens)
- [stopSequences](/robota/api-reference/anthropic/interfaces/AnthropicProviderOptions#stopsequences)
- [streamMode](/robota/api-reference/anthropic/interfaces/AnthropicProviderOptions#streammode)

## Properties

### <a id="apikey" name="apikey"></a> apiKey

• **apiKey**: `string`

#### Defined in

[anthropic/src/index.ts:7](https://github.com/robotaio/robota/blob/main/packages/anthropic/src/index.ts#L7)

___

### <a id="model" name="model"></a> model

• **model**: `string`

#### Inherited from

ProviderOptions.model

#### Defined in

core/dist/index.d.ts:91

___

### <a id="temperature" name="temperature"></a> temperature

• `Optional` **temperature**: `number`

#### Inherited from

ProviderOptions.temperature

#### Defined in

core/dist/index.d.ts:92

___

### <a id="maxtokens" name="maxtokens"></a> maxTokens

• `Optional` **maxTokens**: `number`

#### Inherited from

ProviderOptions.maxTokens

#### Defined in

core/dist/index.d.ts:93

___

### <a id="stopsequences" name="stopsequences"></a> stopSequences

• `Optional` **stopSequences**: `string`[]

#### Inherited from

ProviderOptions.stopSequences

#### Defined in

core/dist/index.d.ts:94

___

### <a id="streammode" name="streammode"></a> streamMode

• `Optional` **streamMode**: `boolean`

#### Inherited from

ProviderOptions.streamMode

#### Defined in

core/dist/index.d.ts:95
