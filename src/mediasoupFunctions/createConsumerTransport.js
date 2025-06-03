import { useCallback } from "react"


const createConsumerTransport = (transportParams, device, socket, audioPid) => {
    //make a downstream transport for one producer/peer with audio and video producer
    const consumerTransport = device.createRecvTransport(transportParams)

    consumerTransport.on("connectionstatechange", state => {
        console.log("===connectionstatechange===")
        console.log(state)
    })

    consumerTransport.on("icegatheringstatechange", state => {
        console.log("===icegatheringstatechange===")
        console.log(state)
    })

    consumerTransport.on("connect", async({dtlsParameters}, callback, errback) => {
        console.log("transport connect event has fired")
    })
    return consumerTransport
}

export default createConsumerTransport;