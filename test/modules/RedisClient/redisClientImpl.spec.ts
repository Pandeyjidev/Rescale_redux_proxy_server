import {assert, expect} from 'chai'
import redisClient from '../../../src/modules/RedisClient/redisClientImpl'



describe('Api tests', () => {
  afterEach(async () => {
    if ((redisClient as any).connection == null) {
      return
    }
    await new Promise((resolve : any ) => (redisClient as any).connection.quit(() => resolve()));
    (redisClient as any).connection = undefined
  })

  describe ('Should be able to connect to redis', async () => {
    await redisClient.connect()
  })

  describe ('Should Catch redis errors', async () => {
    const oldData = redisClient.connectData
    afterEach('Save options', () => {
      redisClient.connectData = oldData
    })
    it('Should catch connection error', async () => {
      redisClient.connectData = {
        database: 0,
        host: '78965',
        port: 6379,
      }
      let error: Error | undefined
      try {
        await redisClient.connect()
      } catch (e) {
        error = e
      }

      expect(error).is.not.equal('undefined')
    })

    it('Should catch get error', async () => {
      const errMessage = 'Test error'
      await redisClient.connect();
      (redisClient as any).connection.get = (key: string, cb: (err: any, response: string) => void) => {
        cb(new Error(errMessage), '')
      }

      let error: any
      try {
        await redisClient.get('key')
      } catch (e) {
        error = e
      }

      if (error == null) {
        assert(false, 'Should throw error')
        return
      }

      expect(error.message).to.be.eq(errMessage)
    })
  })

  describe ('Close connection', async () => {
    let call: (...args: any[]) => any = () => {}
    before('Mock logger', () => {
      console.info = (...args: any[]) => call(...args)
    })

    before('Connect to redis', async () => {
      await redisClient.connect()
    })

    it ('Should emit event after disconnect from redis', async () => {
      let message: string = ''
      call = (loggerMessage: string) => message = loggerMessage

      await new Promise((resolve : any) => (redisClient as any).connection.quit(() => resolve()))

      // Emitting event will catch on next event loop interation
      await new Promise(resolve => setTimeout((resolve), 50))
      expect(message).to.contains('Disconnect from Redis')
    })
  })
})
