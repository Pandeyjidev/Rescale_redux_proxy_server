// Import Http Server
import 'reflect-metadata'
import HttpServer from './modules/HttpServer'

const start = async () => {
    // Start an instance of the HTTP server
    console.log('Run HTTP Server')
    const server = new HttpServer()
    console.log('INIT')
    await server.init()
}

start().catch((error) => {
    console.error("There is some issue with running your server : ", error)
})
