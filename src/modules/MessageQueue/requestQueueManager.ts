import DLLMap from "../LRUCache/DLLMapImpl"
import messageQueueFn from "./messageQueueFn"
import { v4 as uuidv4 } from 'uuid'

export class RequestQueueManager {
    maxRequests: number
    maxParallelRequests: number
    private currentRunningRequests: number = 0
    private list: DLLMap<messageQueueFn>

    constructor(maxParallelRequests: number, maxRequests: number) {
        this.maxParallelRequests = maxParallelRequests
        this.maxRequests = maxRequests
        this.list = new DLLMap<messageQueueFn>()
      }

      executeRequest(fn: messageQueueFn) {
          if(this.getAllRunningRequest() + this.getQueueSize() >= this.maxRequests) {
              throw new Error("Maximum Connections exceeded")     
          }

          const uuid = uuidv4()
          this.list.add(uuid,async () => {
              try {
                  const res = fn()
                  if(res !=null && res.then != null ) {
                      return res.then(() => this
                            .end())
                            .catch((error: any) => console.error('Error while processing the message Queue function', error) )
                  }
              } catch(error) {
                  console.error('Error while processing the message Queue function', error)
              }
              this.end()
          })

          setImmediate(() => this.callNext())
      }
      private callNext() {
        let callback = this.list.getTail()
        while (callback && callback !== null  && this.currentRunningRequests < this.maxParallelRequests) {
          this.list.deleteTailNode()
          this.currentRunningRequests += 1
          callback.value()
          callback = this.list.getTail()
        }
      }
      private end() {
        this.currentRunningRequests -= 1
        this.callNext()
      }
      getQueueSize() {
        return this.list.getSize()
      }
    
      getAllRunningRequest() {
        return this.currentRunningRequests
      }
    }