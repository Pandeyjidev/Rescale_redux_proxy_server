class DLLNode<T extends any> {
    public key: string
    public value: T
    public next: DLLNode<T> | undefined
    public prev: DLLNode<T> | undefined

    constructor(key: string, value: T){
        this.key = key
        this.value = value
    }

}

export default DLLNode