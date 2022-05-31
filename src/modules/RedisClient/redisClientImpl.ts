import * as config from 'config'

import RedisConnectionOptions from './redisClient'

const RedisClient = require('redis')

function connectToRedisBeforeCall(
    target: Redis,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
): TypedPropertyDescriptor<any> {
    const originalMethod = descriptor.value
    descriptor.value = async function (
        this: Redis,
    ) {
        await this.connect()
        return await originalMethod.apply(this, arguments)
    }
    return descriptor
}

class Redis {
    private connection: typeof RedisClient
    connectData: RedisConnectionOptions
    constructor() {
        const opts = config.get<Omit<RedisConnectionOptions, 'port'> & { port: number }>('connections.redis')
        this.connectData = {
            database: opts.database,
            host: opts.host,
            port: opts.port,
        }
    }

    async connect(): Promise<typeof RedisClient> {
        if (this.connection) {
            return this.connection
        }
        const connection = RedisClient.createClient(this.connectData)
        this.connection = connection

        return new Promise((resolve, reject) => {
            connection.on('error', (error: any) => {
                return reject(error)
            })

            connection.on('connect', () => {
                console.log(`Trying to connect to Redis: http://${this.connectData.host}:${this.connectData.port
            }, database: ${this.connectData.database}`)
                console.info(`Connected to Redis: http://${this.connectData.host}:${this.connectData.port
                    }, database: ${this.connectData.database}`)
                resolve(connection)
            })
            connection.on('end', () => {
                console.info(`Disconnected from Redis: http://${this.connectData.host}:${this.connectData.port
                }, database: ${this.connectData.database}`)
            })
        })
    }

    @connectToRedisBeforeCall
    async get(key: string): Promise<string> {
        return new Promise((resolve, reject) => this.connection.get(key, (error : any, response : any) => {
            if (error != null) {
                return reject(error)
            }
            resolve(response)
        }))
    }
}

const redisInstance = new Redis()

export default redisInstance
