import { NextFunction, Request, Response } from 'express'
import * as config from 'config'
import { Server } from 'http'
import * as BodyParser  from 'body-parser'

import LRUCache  from './LRUCache/LRUCacheImpl'
import { RequestQueueManager } from './MessageQueue/requestQueueManager'
import redisClient from './RedisClient/redisClientImpl'

class HttpServer {
    private server: Server | undefined
    private requestQueueManager: RequestQueueManager
    private cache: LRUCache<string>
    private readonly appPort: number

    constructor() {
        this.appPort = config.get('appPort')

        this.requestQueueManager = new RequestQueueManager(
            config.get('maxParallelRequests'),
            config.get('maxConnections')
        )
        
        this.cache = new LRUCache(
            config.get('cache.capacity'),
            config.get('cache.ttl'),
          )
          console.log('In constructor')
    }

    async init(): Promise<Server> {
        if (this.server != null) {
            return this.server
        }
          
        var express = require('express')
        var app = express()

        //parse application/json and look for raw text                                        
        app.use(BodyParser.json());                                     
        app.use(BodyParser.urlencoded({extended: true}));               
        app.use(BodyParser.text());                                    
        app.use(BodyParser.json({ type: 'application/json'}));  

        app.get("/", (_req: any, res: { json: (arg0: { message: string }) => any }) => res.json({message: "Proxy http server is running!"}));
          
        app.use('/:key', async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.requestQueueManager.executeRequest(async () => {
            try {
                const key = req.params.key
                // check if present in cache
                let value = this.cache.get(key)
                if (value == null) {
                    value = await redisClient.get(key)
                    if (value != null) {
                        this.cache.set(key, value)
                    }
                }

                if (value === null) {
                    return res.sendStatus(404)
                }

                res.send(value)

                } catch(error){
                    console.error(`Error while process request with key ${req.params.key}`, error)
                    return res.sendStatus(500)
                }
            })
        } catch (e) {
            if (e.message === 'MAX_CONNECTIONS_EXCEEDED') {
                return res.sendStatus(503)
            } else {
                console.error(`Error while process request with key ${req.params.key}`, e)
                return res.sendStatus(500)
            }
            }
        })    

        app.use((req: Request, res: Response) => {
            res.sendStatus(404)
        })
        
        
        return new Promise((resolve, reject) => {
            try {
                this.server = app.listen(this.appPort, () => {
                console.info(`Server created on port ${this.appPort}`)
                if( this.server !== undefined ) { 
                    resolve(this.server) 
                }
            }).on('error', (error: any) => {
                console.error(`Unable to create a Server on port ${this.appPort}`, error)
                delete this.server
                reject(error)
            })
            } catch (error: any) {
                console.error(`Error while server initialization, server was unable to connect to port ${this.appPort}`, error)
                delete this.server
                reject(error)
            }
        })   
    }  
    async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
        if (!this.server) {
            reject(new Error('No server initiated'))
            return
        }
        this.server.close(() => {
            resolve()
        })
        delete this.server
        })
    }
}
    
export default HttpServer
    