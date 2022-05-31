// Import Http Server
import 'reflect-metadata'
import HttpServer from './modules/HttpServer'

const start = async () => {
    // Start an instance of the HTTP server
    const server = new HttpServer()
    await server.init()
}

start().catch((error) => {
    console.error("There is some issue with running your server : ", error)
})
