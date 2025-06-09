import './style.css'
import buttons from './uiStuff/uiButtons'
import { io } from 'socket.io-client'
import { Device } from 'mediasoup-client';


import createProducerTransport from './mediasoupFunctions/createProducerTransport';
import createProducer from './mediasoupFunctions/createProducer';
import requestTransportToConsume from './mediasoupFunctions/requestTransportToConsume';

let device = null
let localStream = null
let producerTransport = null
let videoProducer = null
let audioProducer = null 
let consumers = {} //key off the audioPids

// const socket = io.connect('https://mediasoup-videocall-app-backend.onrender.com')
const socket = io.connect('http://localhost:3031')

socket.on('connect', () => {
  console.log("frontend connected to backend succesfully")
})


socket.on('updateActiveSpeakers', async newListOfActives => {
  console.log("updateActiveSpeakers", newListOfActives)

  console.log(newListOfActives)
  let slot = 0
  //remove all videos from video elements
  const remoteEls = document.getElementsByClassName('remote-video')
  for(let el of remoteEls){
    //removes all the remote video boxes
    el.srcObject = null
  }
  newListOfActives.forEach(aid => {
    if(aid !== audioProducer?.id){
      //put this video in the next available slot
      const remoteVideo = document.getElementById(`remote-video-${slot}`)
      const remoteVideoUsername = document.getElementById(`username-${slot}`)
      const consumerForThisSlot = consumers[aid]
      remoteVideo.srcObject = consumerForThisSlot?.combinedStream
      remoteVideoUsername.innerHTML = consumerForThisSlot?.userName
      slot++
    }
  })

})

socket.on('newProducersToConsume', consumeData => {
  console.log("newProducersToConsume", consumeData)

  requestTransportToConsume(consumeData, socket, device, consumers)
})

const joinRoom = async () => {
    console.log('Joining room...')
    const userName = document.getElementById('username').value
    const roomName = document.getElementById('room-input').value

    const joinRoomResp = await socket.emitWithAck('joinRoom', {userName, roomName})
    // console.log(joinRoomResp)

    device = new Device()

    await device.load({routerRtpCapabilities: joinRoomResp.routerRtpCapablities})
    console.log(device)

    console.log(joinRoomResp)

    requestTransportToConsume(joinRoomResp, socket, device, consumers)

    buttons.control.classList.remove('d-none')    
}

const enableFeed = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  })

  buttons.localMediaLeft.srcObject = localStream
  buttons.enableFeed.disabled = true
  buttons.sendFeed.disabled = false
  buttons.muteBtn.disabled = false
}

const sendFeed = async () => {
  // create a transport for this client's upstream
  //it will handle both audio and video producers
  producerTransport = await createProducerTransport(socket, device)
  console.log("have producer transport, time to produce", producerTransport)

  //create our producers
  const producers = await createProducer(localStream, producerTransport)
  audioProducer = producers.audioProducer
  videoProducer = producers.videoProducer
  console.log(producers)

  buttons.hangUp.disabled = false
}

const muteAudio = () => {

  if(audioProducer.paused){
    audioProducer.resume()
    buttons.muteBtn.innerHTML = "Unmute"
    buttons.muteBtn.classList.add('btn-success')
    buttons.muteBtn.classList.remove('btn-danger')

    //unpause on the server
    socket.emit('audioChange', "unmute")
  } else {
    audioProducer.pause()
    buttons.muteBtn.innerHTML = "Mute"
    buttons.muteBtn.classList.remove('btn-success')
    buttons.muteBtn.classList.add('btn-danger')

    //pause on the server
    socket.emit('audioChange', "mute")
  }
}

buttons.joinRoom.addEventListener('click', joinRoom)
buttons.enableFeed.addEventListener('click', enableFeed)
buttons.sendFeed.addEventListener('click', sendFeed)
buttons.muteBtn.addEventListener('click', muteAudio)


