const socket = io("ring-special-fighter.glitch.me", {
  transports: ["websocket"] 
});
const body = document.querySelector("body")
const main = document.querySelector("main")
const input = document.querySelector("input")
let form = document.querySelector("form")

form.addEventListener("submit", (e)=>{
    e.preventDefault()
    let name = input.value
    socket.emit("Login", name)
    body.removeChild(form)
    let alert = document.createElement("h2")
    alert.innerText = "Direcionando você para uma sala..."
    main.append(alert)
})
socket.on("Create", (users)=>{
    form = ""
    main.innerHTML = ""
    let name = document.createElement("h2")
    if(users.id1 != socket.id){
        name.innerText = "Conversando com "+users.user1
    }
    else{
        name.innerText = "Conversando com "+users.user2
    }
    let messageForm = document.createElement("form")
    let messageInput = document.createElement("input")
    messageInput.type = "text"
    messageInput.required = true
    let messageButton = document.createElement("button")
    messageButton.type = "submit"
    messageButton.innerText = "Enviar"
    messageForm.addEventListener("submit", (e)=>{
        e.preventDefault()
        let msg = document.querySelector("input")
        socket.emit("SendMessage", msg.value)
        msg.value = ""
    })
    messageForm.classList.add("form")
    let messageBox = document.createElement("div")
    messageBox.classList.add("box")
    messageForm.append(messageInput)
    messageForm.append(messageButton)
    main.append(name)
    main.append(messageBox)
    main.append(messageForm)
})

socket.on("ReceiveMessage", (msg)=>{
    let div = document.querySelector("div")
    let messageText = document.createElement("p")
    messageText.innerHTML = msg.text
    if(msg.id == socket.id){
        messageText.classList.add("myUser")
    }
    else{
        messageText.classList.add("otherUser")
    }
    div.append(messageText)
    div.append(document.createElement("br"))
})

socket.on("Leave", ()=>{
    main.innerHTML = ""
    let alert = document.createElement("h2")
    alert.innerText = "Preparando tudo..."
    main.append(alert)
})