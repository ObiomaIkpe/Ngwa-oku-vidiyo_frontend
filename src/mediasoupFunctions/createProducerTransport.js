
const createProducerTransport = (socket, device) => new Promise(async (resolve, reject) => {
    //ask the server to create a transport and send params back
    const producerTransportParams = await socket.emitWithAck('requestTransport', { type: 'producer' })
    // console.log(producerTransportParams)

    const producerTransport = device.createSendTransport(producerTransportParams)
    // console.log(producerTransport)

    producerTransport.on('connect', ({dtlsParameters}, useCallback, errback) => {
        console.log("connect running on produce")
    })

    producerTransport.on('produce', async(parameters, callback, errback) => {

    })
    resolve(producerTransport)


})

export default createProducerTransport;