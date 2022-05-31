import * as chai from 'chai'
import * as chaiSpies  from 'chai-spies'
import { RequestQueueManager } from '../../../src/modules/MessageQueue/requestQueueManager'

chai.use(chaiSpies)
const logger = console

describe('Requests queue manager tests', () => {
    it ('Should process sync task', (done) => {
      const queueManager = new RequestQueueManager(1, 10)
      queueManager.executeRequest(() => {
        done()
      })
    })
  
    it ('Should process async task', (done) => {
      const queueManager = new RequestQueueManager(1, 10)
      queueManager.executeRequest(async () => {
        await new Promise(resolve => setTimeout((resolve), 10))
        done()
      })
    })
  
    describe ('Tests catch errors', () => {
      let call: (...args: any[]) => any = () => {}
      const loggerError = logger.error
      before('Mock logger', () => {
        logger.error = (...args: any[]) => call(...args)
      })
  
  
      it ('Should catch sync error', async () => {
        const spy = chai.spy()
        call = spy
        const queueManager = new RequestQueueManager(1, 10)
        queueManager.executeRequest(() => {
          throw new Error()
        })
        await new Promise(resolve => setTimeout((resolve), 50))
        chai.expect(spy).have.been.called.exactly(1)
      })
  
      it ('Should catch async error', async () => {
        const spy = chai.spy()
        call = spy
        const queueManager = new RequestQueueManager(1, 10)
        queueManager.executeRequest(async () => {
          await new Promise((resolve, reject) => setTimeout(() => reject('Some error'), 10))
        })
        await new Promise(resolve => setTimeout((resolve), 50))
        chai.expect(spy).have.been.called.exactly(1)
      })
  
      after('Restore logger', () => {
        logger.error = loggerError
      })
    })
  
  
    it ('Should queue tasks', async () => {
      const queueManager = new RequestQueueManager(2, 10)
      const results: any[] = []
  
      const tasksResolvers: (() => any)[] = []
      queueManager.executeRequest(async () => {
        await new Promise((resolve : any) => tasksResolvers.push(resolve))
        results.push(1)
      })
  
      queueManager.executeRequest(async () => {
        await new Promise((resolve : any) => tasksResolvers.push(resolve))
        results.push(2)
      })
  
      queueManager.executeRequest(async () => {
        await new Promise((resolve : any) => tasksResolvers.push(resolve))
        results.push(3)
      })
  
      await new Promise(resolve => setTimeout((resolve), 5))
  
      chai.expect(results.length).to.be.eq(0)
  
      chai.expect(queueManager.getQueueSize()).to.be.eq(1)
      chai.expect(queueManager.getAllRunningRequest()).to.be.eq(2)
  
      tasksResolvers.shift()!()
      await new Promise(resolve => setTimeout((resolve), 5))
      chai.expect(results[0]).to.be.eq(1)
  
      chai.expect(queueManager.getQueueSize()).to.be.eq(0)
      chai.expect(queueManager.getAllRunningRequest()).to.be.eq(2)
  
      tasksResolvers.shift()!()
      await new Promise(resolve => setTimeout((resolve), 5))
      chai.expect(results[1]).to.be.eq(2)
      chai.expect(queueManager.getQueueSize()).to.be.eq(0)
      chai.expect(queueManager.getAllRunningRequest()).to.be.eq(1)
  
      tasksResolvers.shift()!()
      await new Promise(resolve => setTimeout((resolve), 5))
      chai.expect(results[2]).to.be.eq(3)
      chai.expect(queueManager.getQueueSize()).to.be.eq(0)
      chai.expect(queueManager.getAllRunningRequest()).to.be.eq(0)
    })
  
    it ('Should throw error when exceeded max requests', async () => {
      const queueManager = new RequestQueueManager(1, 1)
      let resolver: () => void = () => {}
      queueManager.executeRequest(async () => {
        await new Promise((resolve : any) => {
          resolver = resolve
        })})
  
      chai.expect(() => queueManager.executeRequest(() => {})).to.throw("Maximum Connections exceeded")
      resolver()
    })
  })
  