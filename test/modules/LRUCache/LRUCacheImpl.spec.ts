import { expect } from 'chai'
import LRUCache from '../../../src/modules/LRUCache/LRUCacheImpl'
import { v4 as uuidv4 } from 'uuid'
// import {DLLMapImpl, LruCacheImpl} from '../../../src/modules/LRUCache'

describe('LRU Cache implementation test', () => {
    const testData: any[] = []
    for(let i = 0; i<=3 ; i++){
        testData.push({ "key" : uuidv4(),
        "value": (i+1)
    })
    }
    it('Create an instance with default capacity & ttl', () => {
        const cache = new LRUCache()
        expect(cache.capacity).to.be.equal(10)
        expect(cache.ttl).to.be.equal(1000)
    })
    it('Create an instance with capacity & ttl', () => {
        const cache = new LRUCache(50,2000)
        expect(cache.capacity).to.be.equal(50)
        expect(cache.ttl).to.be.equal(2000)
    })
    it ('Should add existent element', () => {
        const cache = new LRUCache()
        cache.set(testData[0].key, testData[0].value)
        expect(cache.get(testData[0].key)).to.be.equal(testData[0].value)
        cache.set(testData[0].key, testData[0].value)
        expect(cache.get(testData[0].key)).to.be.equal(testData[0].value)
    })

    it ('Should get an element', () => {

        const cache = new LRUCache()
        cache.set(testData[0].key, testData[0].value)
        cache.set(testData[1].key, testData[1].value)

        expect(cache.get(testData[1].key)).to.be.equal(testData[1].value)
        expect(cache.get(testData[0].key)).to.be.equal(testData[0].value)
    })

    it ('Should return null if empty', () => {

        const cache = new LRUCache()

        expect(cache.get(testData[0].key)).to.be.equal(null)
    })

    it ('Should setLRUNode element after get', async () => {
        const cache = new LRUCache(2);
        cache.set(testData[0].key, testData[0].value);
        cache.set(testData[1].key, testData[1].value);

        cache.get(testData[0].key);

        cache.set(testData[2].key, testData[2].value);

        expect(cache.get(testData[0].key)).to.be.eq(testData[0].value);
        expect(cache.get(testData[1].key)).to.be.an('null');
    })

    it ('Should not set element if zero capacity', async () => {
        const cache = new LRUCache(0);
        cache.set(testData[0].key, testData[0].value);
        expect(cache.get(testData[0].key)).to.be.an('null');
    })
})