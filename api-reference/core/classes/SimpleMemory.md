[Core API - v0.1.0](../README.md) / SimpleMemory

# Class: SimpleMemory

기본 인메모리 구현

## Implements

- [`Memory`](../interfaces/Memory.md)

## Table of contents

### Constructors

- [constructor](SimpleMemory.md#constructor)

### Methods

- [addMessage](SimpleMemory.md#addmessage)
- [getMessages](SimpleMemory.md#getmessages)
- [clear](SimpleMemory.md#clear)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new SimpleMemory**(`options?`): [`SimpleMemory`](SimpleMemory.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.maxMessages?` | `number` |

#### Returns

[`SimpleMemory`](SimpleMemory.md)

#### Defined in

[packages/core/src/memory.ts:36](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L36)

## Methods

### <a id="addmessage" name="addmessage"></a> addMessage

▸ **addMessage**(`message`): `void`

메모리에 메시지를 추가합니다.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`Message`](../interfaces/Message.md) |

#### Returns

`void`

#### Implementation of

[Memory](../interfaces/Memory.md).[addMessage](../interfaces/Memory.md#addmessage)

#### Defined in

[packages/core/src/memory.ts:40](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L40)

___

### <a id="getmessages" name="getmessages"></a> getMessages

▸ **getMessages**(): [`Message`](../interfaces/Message.md)[]

저장된 모든 메시지를 가져옵니다.

#### Returns

[`Message`](../interfaces/Message.md)[]

#### Implementation of

[Memory](../interfaces/Memory.md).[getMessages](../interfaces/Memory.md#getmessages)

#### Defined in

[packages/core/src/memory.ts:58](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L58)

___

### <a id="clear" name="clear"></a> clear

▸ **clear**(): `void`

저장된 메시지를 지웁니다.

#### Returns

`void`

#### Implementation of

[Memory](../interfaces/Memory.md).[clear](../interfaces/Memory.md#clear)

#### Defined in

[packages/core/src/memory.ts:62](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L62)
