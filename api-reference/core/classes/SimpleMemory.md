[Core API - v0.1.0](/robota/api-reference/core/) / SimpleMemory

# Class: SimpleMemory

기본 인메모리 구현

## Implements

- [`Memory`](/robota/api-reference/core/interfaces/Memory)

## Table of contents

### Constructors

- [constructor](/robota/api-reference/core/classes/SimpleMemory#constructor)

### Methods

- [addMessage](/robota/api-reference/core/classes/SimpleMemory#addmessage)
- [getMessages](/robota/api-reference/core/classes/SimpleMemory#getmessages)
- [clear](/robota/api-reference/core/classes/SimpleMemory#clear)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new SimpleMemory**(`options?`): [`SimpleMemory`](/robota/api-reference/core/classes/SimpleMemory)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.maxMessages?` | `number` |

#### Returns

[`SimpleMemory`](/robota/api-reference/core/classes/SimpleMemory)

#### Defined in

[packages/core/src/memory.ts:36](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L36)

## Methods

### <a id="addmessage" name="addmessage"></a> addMessage

▸ **addMessage**(`message`): `void`

메모리에 메시지를 추가합니다.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`Message`](/robota/api-reference/core/interfaces/Message) |

#### Returns

`void`

#### Implementation of

[Memory](/robota/api-reference/core/interfaces/Memory).[addMessage](/robota/api-reference/core/interfaces/Memory#addmessage)

#### Defined in

[packages/core/src/memory.ts:40](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L40)

___

### <a id="getmessages" name="getmessages"></a> getMessages

▸ **getMessages**(): [`Message`](/robota/api-reference/core/interfaces/Message)[]

저장된 모든 메시지를 가져옵니다.

#### Returns

[`Message`](/robota/api-reference/core/interfaces/Message)[]

#### Implementation of

[Memory](/robota/api-reference/core/interfaces/Memory).[getMessages](/robota/api-reference/core/interfaces/Memory#getmessages)

#### Defined in

[packages/core/src/memory.ts:58](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L58)

___

### <a id="clear" name="clear"></a> clear

▸ **clear**(): `void`

저장된 메시지를 지웁니다.

#### Returns

`void`

#### Implementation of

[Memory](/robota/api-reference/core/interfaces/Memory).[clear](/robota/api-reference/core/interfaces/Memory#clear)

#### Defined in

[packages/core/src/memory.ts:62](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L62)
