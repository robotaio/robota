[OpenAI API](../../) / [Exports](../modules) / OpenAIProvider

# Class: OpenAIProvider

OpenAI 제공업체 구현

## Implements

- `ModelContextProtocol`

## Table of contents

### Constructors

- [constructor](OpenAIProvider#constructor)

### Properties

- [options](OpenAIProvider#options)

### Methods

- [chat](OpenAIProvider#chat)
- [chatStream](OpenAIProvider#chatstream)
- [formatFunctions](OpenAIProvider#formatfunctions)
- [formatMessages](OpenAIProvider#formatmessages)
- [parseResponse](OpenAIProvider#parseresponse)
- [parseStreamingChunk](OpenAIProvider#parsestreamingchunk)

## Constructors

### constructor

• **new OpenAIProvider**(`options`): [`OpenAIProvider`](OpenAIProvider)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`OpenAIProviderOptions`](../interfaces/OpenAIProviderOptions) |

#### Returns

[`OpenAIProvider`](OpenAIProvider)

#### Defined in

[openai/src/provider.ts:27](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/openai/src/provider.ts#L27)

## Properties

### options

• **options**: [`OpenAIProviderOptions`](../interfaces/OpenAIProviderOptions)

제공업체 옵션

#### Implementation of

ModelContextProtocol.options

#### Defined in

[openai/src/provider.ts:25](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/openai/src/provider.ts#L25)

## Methods

### chat

▸ **chat**(`context`, `options?`): `Promise`\<`ModelResponse`\>

모델 채팅 요청

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `Context` |
| `options?` | `any` |

#### Returns

`Promise`\<`ModelResponse`\>

#### Implementation of

ModelContextProtocol.chat

#### Defined in

[openai/src/provider.ts:168](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/openai/src/provider.ts#L168)

___

### chatStream

▸ **chatStream**(`context`, `options?`): `AsyncGenerator`\<`StreamingResponseChunk`, `void`, `unknown`\>

모델 채팅 스트리밍 요청

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `Context` |
| `options?` | `any` |

#### Returns

`AsyncGenerator`\<`StreamingResponseChunk`, `void`, `unknown`\>

#### Implementation of

ModelContextProtocol.chatStream

#### Defined in

[openai/src/provider.ts:228](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/openai/src/provider.ts#L228)

___

### formatFunctions

▸ **formatFunctions**(`functions`): `ChatCompletionTool`[]

함수 정의를 OpenAI 형식으로 변환

#### Parameters

| Name | Type |
| :------ | :------ |
| `functions` | `FunctionDefinition`[] |

#### Returns

`ChatCompletionTool`[]

#### Implementation of

ModelContextProtocol.formatFunctions

#### Defined in

[openai/src/provider.ts:102](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/openai/src/provider.ts#L102)

___

### formatMessages

▸ **formatMessages**(`messages`): `ChatCompletionMessageParam`[]

메시지를 OpenAI 형식으로 변환

#### Parameters

| Name | Type |
| :------ | :------ |
| `messages` | `Message`[] |

#### Returns

`ChatCompletionMessageParam`[]

#### Implementation of

ModelContextProtocol.formatMessages

#### Defined in

[openai/src/provider.ts:45](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/openai/src/provider.ts#L45)

___

### parseResponse

▸ **parseResponse**(`response`): `ModelResponse`

OpenAI API 응답을 표준 형식으로 변환

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `ChatCompletion` |

#### Returns

`ModelResponse`

#### Implementation of

ModelContextProtocol.parseResponse

#### Defined in

[openai/src/provider.ts:116](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/openai/src/provider.ts#L116)

___

### parseStreamingChunk

▸ **parseStreamingChunk**(`chunk`): `StreamingResponseChunk`

스트리밍 응답 청크를 표준 형식으로 변환

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `ChatCompletionChunk` |

#### Returns

`StreamingResponseChunk`

#### Implementation of

ModelContextProtocol.parseStreamingChunk

#### Defined in

[openai/src/provider.ts:146](https://github.com/robotaio/robota/blob/c397724a2d06d66ad71d874519312f9bbb9b1d70/packages/openai/src/provider.ts#L146)
