import { expect } from 'chai'
import DLLNode  from '../../../src/modules/LRUCache/DLLNodeImpl'
import { v4 as uuidv4 } from 'uuid'


describe('Double Linked List Node test', () => {
    describe('create an instance with key value', () => {
        const uuid = uuidv4()
        const node = new DLLNode(uuid, "1" )
        expect(node.key).to.be.equal(uuid)
        expect(node.value).to.be.equal("1")
    })
})