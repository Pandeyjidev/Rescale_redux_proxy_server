import { expect } from 'chai'
// import * as sinon from 'sinon'
import DLLNode  from '../../../src/modules/LRUCache/DLLNodeImpl'
import { v4 as uuidv4 } from 'uuid'
import DLLMap from '../../../src/modules/LRUCache/DLLMapImpl'

describe('Double Linked List Map Implementation test', () => {
    const list = new DLLMap<string>()
    const uuid = uuidv4()
    const node = new DLLNode(uuid, "1" )

    it('Check if we can add element to list', () => {


        expect(list.getTail()).to.be.an('undefined');
        expect(list.getHead()).to.be.an('undefined');

        list.add(node.key,node.value)
        const tail = list.getTail()

        expect(list.getSize()).to.equal(1)
        expect(tail).to.be.equal(list.getHead());

        expect(tail?.key).to.be.equal(node.key);
        expect(tail?.value).to.be.equal(node.value);
        list.deleteTailNode()
    })

    it('Check if we can get element from the list', () => {
        list.add(node.key,node.value)
        expect(list.get(node.key)).to.be.equal(node.value)
        expect(list.get("")).to.be.equal(null)
        list.deleteTailNode()

    })

    it('Check if we can delete the only element in the list', () => {
        list.add(node.key,node.value)

        expect(list.get(node.key)).to.be.equal(node.value)
        list.delete(node.key)
        expect(list.getTail()).to.be.an('undefined');
        expect(list.getHead()).to.be.an('undefined');
    })

    it('Check if we can delete an element if there are more than one element in the list', () => {
        list.add(node.key,node.value)
        const anotherNode = new DLLNode(uuid, "2" )
        list.add(anotherNode.key,anotherNode.value)

        // const data = list.get(anotherNode.key)
        list.delete(anotherNode.key)
        list.deleteTailNode()
        list.deleteTailNode()
        // expect(data.prev.next).to.be.equal(data.next)
    })

    it ('Should do nothing for incorrect key', () =>{
        const newList = new DLLMap<string>()
        newList.setLRUNode("")
    })

    it ('Should set LRU with key', () =>{
        const newList = new DLLMap<string>()
        
        // var mySpy = sinon.spy(DLLMap, "delete")

        newList.add(node.key,node.value)
        const anotherNode = new DLLNode(uuid, "2" )
        newList.add(anotherNode.key,anotherNode.value)
        newList.setLRUNode(node.key)

        expect(newList.getHead()?.key).to.be.equal(node.key)
        
        // mySpy.should.have.been.calledWith("delete");
        // expect(mySpy).to.have.been.calledWith("delete");
    })

    it ('Should setLRUNode nonexistent element chain', () => {
        list.add(node.key,node.value)
        const anotherNode = new DLLNode(uuid, "2" )
        list.add(anotherNode.key,anotherNode.value)
        list.setLRUNode(anotherNode.key)

        expect(list.getSize()).to.be.eq(3)
    });

    it ('Should lift element in empty chain', () => {
        list.deleteTailNode()
        list.setLRUNode(node.key);

        expect(list.getSize()).to.be.eq(2)
        expect(node.key).to.be.equal(list.getHead()?.key)
        list.deleteTailNode()
        list.deleteTailNode()
    });

    it ('Should remove tail element', () => {
        const newList = new DLLMap<string>()
        let testKeys = []

        for(let i = 0; i < 3; i++){
            testKeys.push(uuidv4())
            newList.add(testKeys[i], (i+1).toString());
        }

        newList.deleteTailNode()
        expect(newList.getSize()).to.be.eq(2);

        expect(newList.getTail()!.key).to.be.eq(testKeys[1]);
        expect(newList.getHead()!.key).to.be.eq(testKeys[2]);

        expect(newList.getHead()!.next).to.be.eq(newList.getTail());
        expect(newList.getTail()!.prev).to.be.eq(newList.getHead());
    });

    it ('Should remove head element', () => {
        const newList = new DLLMap<string>()
        let testKeys = []

        for(let i = 0; i < 3; i++){
            testKeys.push(uuidv4())
            newList.add(testKeys[i], (i+1).toString());
        }

        newList.deleteHeadNode()
        expect(newList.getSize()).to.be.eq(2)
    });
})