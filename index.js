const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require('uuid');

app.set("view engine", 'ejs');
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get("/:room", (req, res) => {
    res.render("home", { roomId: req.params.room });
})

io.on("connection", socket => {
    socket.emit("Connected", "Connected To Server");

    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        console.log(userId);
        socket.to(roomId).broadcast.emit("new-user-connected", userId);
    })
})

server.listen(process.env.PORT||3005, () => {
    console.log("Connected");
});