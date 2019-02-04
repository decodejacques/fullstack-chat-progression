let express = require("express")
let cors = require("cors")
let bodyParser = require("body-parser")
let app = express()
app.use(cors({ credentials: true, origin: "http://localhost:8080" }))
app.use(bodyParser.raw({ type: "*/*" }))

let generateId = function() {
  return "" + Math.floor(Math.random() * 100000000)
}
let passwords = {}

//    * sessions
//       * Refers to an object
//       * Associates session ids with usernames
let sessions = {}

// 1. Add the following global variable for server state
//    1. messages
//       1. Refers to an array
//       2. Contains the chat messages
let messages = []
// 1. Create your endpoints
//    1. /newmessage
//       1. The request body will contain the session id and the message
//       2. Updates the array referred to by the messages variable
//       3. Method is POST
//       4. Console log everywhere and test with postman

app.post("/newmessage", function(req, res) {
  console.log("*** inside new message")
  console.log("not yet parsed body", req.body.toString())
  let body = JSON.parse(req.body)
  console.log("parsed body", body)
  let sessionId = req.headers.cookie
  let msg = body.msg
  let username = sessions[sessionId]
  console.log("username", username)
  let newMsg = { username: username, message: msg }
  console.log("new message", newMsg)
  messages = messages.concat(newMsg)
  console.log("updated messages", messages)
  res.send(JSON.stringify({ success: true }))
})

//    1. /messages
//       1. No request body needed
//       2. Method is GET
//       3. Reads the messages variable
//       4. Console log everywhere and test with postman

app.get("/messages", function(req, res) {
  res.send(JSON.stringify(messages))
})

app.post("/signup", function(req, res) {
  console.log("**** I'm in the signup endpoint")
  console.log("initial input", req.body.toString())
  let body = JSON.parse(req.body)
  console.log("this is the parsed body", body)
  let username = body.username
  let enteredPassword = body.password
  passwords[username] = enteredPassword
  console.log("passwords object", passwords)
  let responseBody = JSON.stringify({ success: true })
  res.send(responseBody)
})

app.post("/login", function(req, res) {
  console.log("**** I'm in the login endpoint")
  console.log("initial input", req.body.toString())
  let body = JSON.parse(req.body)
  console.log("this is the parsed body", body)
  let username = body.username
  let enteredPassword = body.password
  let expectedPassword = passwords[username]
  console.log("expected password", expectedPassword)
  if (enteredPassword === expectedPassword) {
    console.log("password matches")
    let sessionId = generateId()
    console.log("generated id", sessionId)
    sessions[sessionId] = username
    res.set("Set-Cookie", "" + sessionId)
    let responseBody = JSON.stringify({ success: true })
    console.log("response body", responseBody)
    res.send(responseBody)
    return
  }
  res.send(JSON.stringify({ success: false }))
})
app.listen(4000)
