

const createConsumer = (consumerTransport, pid, device, socket, kind, slot) => {
    return new Promise(async(resolve, reject) => {
        const consumerParams = await socket.emitWithAck('consumeMedia', {       rtpCapabilities: device.rtpCapabilities,
        pid,
        kind
        })
        console.log(consumerParams)

        if(consumerParams === "cannotConsume"){
            console.log("cannot consume")
            resolve()
        }
        else if(consumerParams === "consumeFailed"){
            console.log("consume failed")
            resolve()
        }else{
            const consumer = await consumerTransport.consume(consumerParams)
            console.log("consume has finished!")

            const {track} = consumer

            await socket.emitWithAck('unpauseConsumer', {pid, kind})
            resolve(consumer)
        }
    })
}

export default createConsumer;