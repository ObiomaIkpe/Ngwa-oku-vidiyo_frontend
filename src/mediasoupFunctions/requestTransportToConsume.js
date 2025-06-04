import createConsumer from "./createConsumer";
import createConsumerTransport from "./createConsumerTransport";


const requestTransportToConsume = (consumeData, socket, device, consumers) => {

    consumeData.audioPidsToCreate.forEach(async (audioPid, i) => {
        const videoPid = consumeData.videoPidsToCreate[i];

        //this eventListener is expecting back transport parameters for this AudioPid. Maybe 5 times, maybe 0
        const consumerTransportParams = await socket.emitWithAck('requestTransport', { type: 'consumer', audioPid });
        console.log(consumerTransportParams)

        const consumerTransport = createConsumerTransport(consumerTransportParams, device, socket, audioPid)

    const [audioConsumer, videoConsumer] = await Promise.all([
    createConsumer(consumerTransport, audioPid, device, socket, 'audio', i),
    createConsumer(consumerTransport, videoPid, device, socket, 'video', i)])

    console.log(audioConsumer)
    console.log(videoConsumer)

    //create a new mediaStream on the client, with both audio and video tracks
    const combinedStream = new MediaStream([audioConsumer?.track, videoConsumer?.track])
    //TODO: write javascript code that will automatically create new video boxes for each element in the foreach loop/consumeData.audioPidsToCreate
    const remoteVideo = document.getElementById(`remote-video-${i}`)
    remoteVideo.srcObject = combinedStream
    console.log("should work...")
    })

    consumers[audioPid] = {
        combinedStream,
        userName: consumeData.associatedUserNames[i],
        consumerTransport,
        audioConsumer,
        videoConsumer
    }    

}

export default requestTransportToConsume;