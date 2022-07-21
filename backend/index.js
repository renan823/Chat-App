
const app = require('express')()
const server = require("http").Server(app)
const socket = require("socket.io")
const io = socket(server, {origin: '*'})

const cors = require('cors');

app.use(cors({origin: '*'}))

let userList = []
let roomList = []


class room{
    constructor(user1, user2){
        this.user1 = user1 
        this.user2 = user2
        this.name = ""
    }
    createName(){
        for(let i = 0; i < 10; i++){
            let value = String(Math.random() * 100)
            this.name = this.name + value
        }
    }
}

var joinUsers = function(){
    try{
        let r = new room(userList[0], userList[1])
        r.createName()
        r.user1.socket.join(r.name)
        r.user2.socket.join(r.name)
        roomList.push(r)
        userList.splice(0, 2)
        return r
    }
    catch(e){
        return false
    }
}

io.on("connection", (socket)=>{
    socket.on("Login", (name)=>{
        let user = {name: name, socket: socket}
        userList.push(user)
        let response = joinUsers()
        if(response != false){
            io.to(response.name).emit("Create", {user1: response.user1.name, user2: response.user2.name, id1: response.user1.socket.id, id2: response.user2.socket.id})
        }
    })
    socket.on("SendMessage", (msg)=>{
        for(let i = 0; i < roomList.length; i++){
            if(roomList[i].user1.socket == socket || roomList[i].user2.socket == socket){
                io.to(roomList[i].name).emit("ReceiveMessage", {text: msg, id: socket.id})
                break
            }
        }
    })
    socket.on("disconnect", ()=>{
        let anotherUser = ""
        for(let i = 0; i < roomList.length; i++){
            if(roomList[i].user1.socket == socket){
                anotherUser = roomList[i].user2
                roomList.splice(i, 1)
                userList.push(anotherUser)
                io.to(anotherUser.socket.id).emit("Leave")
                break
            }
            else if(roomList[i].user2.socket == socket){
                anotherUser = roomList[i].user1
                roomList.splice(i, 1)
                userList.push(anotherUser)
                io.to(anotherUser.socket.id).emit("Leave")
                break
            }
        }
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, 'localhost', ()=>{
    console.log("Server ready!")
})
