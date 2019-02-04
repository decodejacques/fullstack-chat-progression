let express = require("express")
let cors = require("cors")
let bodyParser = require("body-parser")
let app = express()
app.use(cors())
app.use(bodyParser.raw({ type: "*/*" }))

let generateId = function() {
  return "" + Math.floor(Math.random() * 100000000)
}
let passwords = {}

//    * sessions
//       * Refers to an object
//       * Associates session ids with usernames
let sessions = {}

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
    let responseBody = JSON.stringify({ success: true, sid: sessionId })
    console.log("response body", responseBody)
    res.send(responseBody)
    return
  }
  res.send(JSON.stringify({ success: false }))
})
app.listen(4000)
