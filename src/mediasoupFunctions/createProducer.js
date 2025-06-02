

const createProducer = (localStream, producerTransport) => {
    return new Promise(async(resolve, reject) => {
        //get the audio and video, so we can produce
        const videoTrack = localStream.getVideoTracks()[0]
        const audioTrack = localStream.getAudioTracks()[0]
    
    try {
    const videoProducer = await producerTransport.produce({track: videoTrack
        })
    const audioProducer = await producerTransport.produce({track: audioTrack})
    } catch (error) {
        console.log(error, "error producing")
    }
    resolve({audioProducer, videoProducer})
})
}

export default createProducer