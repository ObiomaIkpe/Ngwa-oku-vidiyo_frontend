

const createConsumer = (consumerTransport, pid, device, socket, kind, slot) => {
    return new Promise(async(resolve, reject) => {

        const consumerParams = await socket.emitWithAck('consumeMedia', {       rtpCapabilities: device.rtpCapabilities,
        pid,
        kind
        })
    })
}

export default createConsumer;