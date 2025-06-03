
const createProducerTransport = (socket, device) => new Promise(async (resolve, reject) => {
    //ask the server to create a transport and send params back
    const producerTransportParams = await socket.emitWithAck('requestTransport', { type: 'producer' })
    // console.log(producerTransportParams)

    const producerTransport = device.createSendTransport(producerTransportParams)
    // console.log(producerTransport)

    producerTransport.on('connect', async({dtlsParameters}, callback, errback) => {
        console.log("connect running on produce")
        const connectResp = await socket.emitWithAck('connectTransport', {dtlsParameters, type : "producer"})
        console.log(connectResp, "connect response is back")

        if(connectResp === "success"){
            //we are connected, move forward
            callback()
        } else if (connectResp === "error"){
            errback()
        }
    })

    producerTransport.on('produce', async(parameters, callback, errback) => {
        console.log("produce is now running")
        const {kind, rtpParameters} = parameters
        const produceResp = await socket.emitWithAck('startProducing',{kind, rtpParameters})

        console.log(produceResp, "connectResp is back")

        if(produceResp === "error"){
            errback()
        } else {
            callback({id: produceResp})
        }
    })

    // setInterval(async () => {
    //     const stats = await producerTransport.getStats()
    //     for (const report of stats.values()){
    //         if(report.type === "outbound-rtp"){
    //             console.log(report.bytesSent, `-`, report.packetsSent)
    //         }
    //     }
    // }, 1000)


    resolve(producerTransport)
})

export default createProducerTransport;