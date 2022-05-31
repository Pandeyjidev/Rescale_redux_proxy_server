import DLLNode from './DLLNodeImpl'

class DLLMap<T extends any> {
    private head: DLLNode<T> | undefined
    private tail: DLLNode<T> | undefined
    private size: number = 0
    private Mapper: { [key: string]: DLLNode<T> } = {}

    getHead() {
        return this.head
    }
    
    getTail() {
        return this.tail
    }
    
    getSize() {
        return this.size
    }

    add(key: string, value: T) {
        const newNode = new DLLNode(key, value)
        newNode.prev = undefined
        newNode.next = this.head
        if (this.head != null) {
            this.head.prev = newNode
        }

        this.head = newNode

        if (this.tail == null) {
            this.tail = newNode
        }

        this.Mapper[key] = newNode

        this.size += 1
    }

    get(key: string) {
        const data = this.Mapper[key]
        if(data && data.value){
            return data.value
        }
        return null
    }
    delete(key: string){
        const data = this.Mapper[key]
        if(data && data.value){
            this.size -= 1

            if (this.head === data) {
                this.head = data.next
            }

            if (this.tail === data) {
                this.tail = data.prev
            }

            if(data.prev) {
                data.prev.next = data.next
            }

            if(data.next) {
                data.next.prev = data.prev
            }

            delete this.Mapper[key]
        }
        return
    }
    setLRUNode(key: string){
        if (!this.tail && !this.head) {
            return
        }

        const data = this.Mapper[key]

        if (data == null || data === this.head) {
            return
        }
        this.delete(key)
        this.add(key, data.value)
    }
    deleteTailNode() {
        if (this.tail != null) {
            this.delete(this.tail.key)
        }
    }
    deleteHeadNode() {
        if (this.head != null) {
            this.delete(this.head.key)
        }
    }

}

export default DLLMap