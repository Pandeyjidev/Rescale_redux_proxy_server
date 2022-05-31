import { expect } from 'chai'
import HttpServer from '../../src/modules/HttpServer'


describe('Http Server tests', () => {
  let server = new HttpServer()

  const stop = async () =>{
    if ((server as any).server != null) {
      await server.stop()
      server = new HttpServer()
    }
  }

  afterEach(async () => {
    await stop()
  })

  beforeEach(async () => {
    await stop()
  })

  it(('Should start server'), async () => {
    await server.init()
    await server.init() // No errors
  })

  it(('Should stop server'), async () => {
    await server.init()
    await server.stop()
  })

  it('Should throw exception when we try stopping a server which is already stopped', async () => {
    await server.init()
    await server.stop()
    let error = ''
    try {
      await server.stop()
    } catch (e) {
      error = e.message
    }

    expect(error).to.be.eq('No server initiated')
  })

  it('Should throw exception when address is already in use', async () => {
    await server.init()
    let error = ''
    try {
      const newServer = new HttpServer()
      await newServer.init()
    } catch (e) {
      error = e.message
    }

    expect(error).not.to.be.eq('')
  })


  it('Should throw exception if we init on invalid port', async () => {
    let error = ''
    try {
      (server as any).appPort = 65536
      await server.init()
    } catch (e) {
      error = e
    }

    expect(error).not.to.be.eq('')
  })
})
