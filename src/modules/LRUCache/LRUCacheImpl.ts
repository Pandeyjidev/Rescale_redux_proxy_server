// https://medium.com/dsinjs/implementing-lru-cache-in-javascript-94ba6755cda9

import DLLMap from './DLLMapImpl'
import LRUInfo from './LRUInfo'
class LRUCache<T extends any> {
    capacity: number = 0
    ttl: number = 0
    list: DLLMap<LRUInfo<T>>

    constructor(capacity: number = 10, ttl: number = 1000) {
        this.capacity = capacity
        this.ttl = ttl
        this.list = new DLLMap<LRUInfo<T>>()
    }

    get(key: string): T | null {
        const value = this.list.get(key)
        if (value == null) {
            return null
        }
        if (value.expiredTime <= Date.now()) {
            this.list.delete(key)
            return null
        }

        this.list.setLRUNode(key)
        return value.value
    }

    set(key: string, value: T) {
        if (this.capacity === 0) {
            return
        }

        this.list.delete(key)
        if (this.list.getSize() === this.capacity) {
            this.list.deleteTailNode()
        }
        this.list.add(key, {
            value,
            expiredTime: Date.now() + this.ttl,
        })
    }
}

export default LRUCache