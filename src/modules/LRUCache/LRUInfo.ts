interface LRUInfo<T> {
    value: T,
    expiredTime: number
}

export default LRUInfo