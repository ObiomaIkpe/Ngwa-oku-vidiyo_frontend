

const createProducer = (localStream, producerTransport) => {
    return new Promise(async(resolve, reject) => {
        //get the audio and video, so we can produce
        const videoTrack = localStream.getVideoTracks()[0]
        const audioTrack = localStream.getAudioTracks()[0]
    
    try {
        console.log("produce running on video")
    const videoProducer = await producerTransport.produce({track: videoTrack
        })
        console.log("produce running on audio")
    const audioProducer = await producerTransport.produce({track: audioTrack})
    console.log("produce finished")
    resolve({audioProducer, videoProducer})


    } catch (error) {
        console.log(error, "error producing")
    }
})
}

export default createProducer