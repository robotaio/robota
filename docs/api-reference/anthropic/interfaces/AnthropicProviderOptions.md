[Anthropic API - v0.1.0](../README.md) / AnthropicProviderOptions

# Interface: AnthropicProviderOptions

Anthropic 제공업체 옵션

## Hierarchy

- `ProviderOptions`

  ↳ **`AnthropicProviderOptions`**

## Table of contents

### Properties

- [apiKey](AnthropicProviderOptions.md#apikey)
- [model](AnthropicProviderOptions.md#model)
- [temperature](AnthropicProviderOptions.md#temperature)
- [maxTokens](AnthropicProviderOptions.md#maxtokens)
- [stopSequences](AnthropicProviderOptions.md#stopsequences)
- [streamMode](AnthropicProviderOptions.md#streammode)

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
