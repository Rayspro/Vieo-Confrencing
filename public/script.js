const socket=io("/");
var videoGrid=document.getElementById("videoGrid");
var videoPanel=document.createElement("video");
var peer = new Peer(undefined,{
    host:"/",
    port:"3006"
});

socket.on("connected",str=>{
    console.log(str);
})

peer.on("open",id=>{
    socket.emit("join-room",ROOMID,id);
    socket.on("newUser",userId=>{
        console.log("New user on room",userId);
    });
})

socket.on("new-user-connected",(userId)=>{
    console.log("hi",userId);
})

videoPanel.muted=true;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    peer.on("call",call=>{
        call.answer(stream);
        var videoNew=document.createElement("video");
        call.on("stream",streamNew=>{
            addStream(streamNew,videoNew);
        })
    })
    addStream(stream,videoPanel);
    socket.on("new-user-connected",(userId)=>{
        sendStream(userId,stream);
    })
})

function sendStream(userId,stream){
    var call=peer.call(userId,stream);
    var newUserVideo=document.createElement("video");
    call.on("stream",streamReply=>{
        addStream(stream,newUserVideo);
    });
    // call.on("close",()=>{
    //     newUserVideo.remove();
    // })
}

function addStream(stream,videoSlot){
    videoSlot.srcObject=stream;
    videoSlot.addEventListener("loadedmetadata",()=>{
        videoSlot.play();
    })
    videoGrid.append(videoSlot);
}