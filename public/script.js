const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3000',
  path:'/peer'
})
const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};

myPeer.on("call", call => {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    console.log("call")
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
  console.log("calling")
})

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  // myPeer.on('call', call => {
  //   console.log("call")
  //   call.answer(stream)
  //   const video = document.createElement('video')
  //   call.on('stream', userVideoStream => {
  //     addVideoStream(video, userVideoStream)
  //   })
  // })

  socket.on('user-connected', userId => {
    console.log("user connected")
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  // if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
  console.log("open")
})

function connectToNewUser(userId, stream) {
  console.log("try to send stream", userId, stream)
  const call = myPeer.call(userId, stream)
  console.log(call)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    console.log("New user stream", call, myPeer)
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}