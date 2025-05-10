[Core API - v0.1.0](../README.md) / Memory

# Interface: Memory

메모리 인터페이스

메모리는 대화 이력을 저장하고 관리하는 역할을 합니다.

## Implemented by

- [`PersistentSystemMemory`](../classes/PersistentSystemMemory.md)
- [`SimpleMemory`](../classes/SimpleMemory.md)

## Table of contents

### Methods

- [addMessage](Memory.md#addmessage)
- [getMessages](Memory.md#getmessages)
- [clear](Memory.md#clear)

## Methods

### <a id="addmessage" name="addmessage"></a> addMessage

▸ **addMessage**(`message`): `void`

메모리에 메시지를 추가합니다.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`Message`](Message.md) |

#### Returns

`void`

#### Defined in

[packages/core/src/memory.ts:12](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L12)

___

### <a id="getmessages" name="getmessages"></a> getMessages

▸ **getMessages**(): [`Message`](Message.md)[]

저장된 모든 메시지를 가져옵니다.

#### Returns

[`Message`](Message.md)[]

#### Defined in

[packages/core/src/memory.ts:17](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L17)

___

### <a id="clear" name="clear"></a> clear

▸ **clear**(): `void`

저장된 메시지를 지웁니다.

#### Returns

`void`

#### Defined in

[packages/core/src/memory.ts:22](https://github.com/robotaio/robota/blob/main/packages/core/src/memory.ts#L22)
