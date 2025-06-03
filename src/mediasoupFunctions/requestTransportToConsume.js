

const requestTransportToConsume = (consumeData, socket, device) => {

    consumeData.audioPidsToCreate.forEach(async (audioPid, i) => {
        const videoPid = consumeData.videoPidsToCreate[i];

        //this eventListener is expecting back transport parameters for this AudioPid. Maybe 5 times, maybe 0
        const consumerTransportParams = await socket.emitWithAck('requestTransport', { type: 'consumer', audioPid });
        console.log(consumerTransportParams)
    })

}

export default requestTransportToConsume;