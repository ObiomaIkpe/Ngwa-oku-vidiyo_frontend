import './style.css'
import buttons from './uiStuff/uiButtons'
import { io } from 'socket.io-client'
import { Device } from 'mediasoup-client';


import createProducerTransport from './mediasoupFunctions/createProducerTransport';
import createProducer from './mediasoupFunctions/createProducer';

let device = null
let localStream = null
let producerTransport = null
let videoProducer = null
let audioProducer = null 

const socket = io.connect('http://localhost:3031')

socket.on('connect', () => {
  console.log("frontend connected to backend succesfully")
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

buttons.joinRoom.addEventListener('click', joinRoom)
buttons.enableFeed.addEventListener('click', enableFeed)
buttons.sendFeed.addEventListener('click', sendFeed)

