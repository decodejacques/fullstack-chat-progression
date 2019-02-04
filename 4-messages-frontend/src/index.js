import ReactDOM from "react-dom"
import "./main.css"
import { connect, Provider } from "react-redux"
import { createStore } from "redux"
import React, { Component } from "react"

//    * Put a setInterval in the componentDidMount of the component. The callback will send a fetch request to the /messages endpoint of step 6. in the Backend section.
//       * The response will cause a dispatch to the store
//          * This action only needs a type. Let's say 'login-success'
// * You'll need to modify the reducer
//    * Remove the code that handles the set-session-id action
//    * Add code to handle the login-success action
class UnconnectedChat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: ""
    }
    this.handleMessageChange = this.handleMessageChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    let updater = () => {
      fetch("http://localhost:4000/messages")
        .then(function(x) {
          return x.text()
        })
        .then(responseBody => {
          console.log("response from messages", responseBody)
          let parsed = JSON.parse(responseBody)
          console.log("parsed", parsed)
          this.props.dispatch({ type: "set-messages", messages: parsed })
        })
    }
    setInterval(updater, 500)
  }
  handleMessageChange(event) {
    console.log("new message", event.target.value)
    this.setState({ message: event.target.value })
  }
  handleSubmit(event) {
    event.preventDefault()
    console.log("form submitted")
    let b = JSON.stringify({
      msg: this.state.message,
      sessionId: this.props.sid
    })
    console.log("request body", b)
    fetch("http://localhost:4000/newmessage", { method: "POST", body: b })
  }
  render() {
    let msgToElement = function(e) {
      return (
        <li>
          {e.username}:{e.message}
        </li>
      )
    }
    let msgs = this.props.messages
    if (msgs === undefined) {
      msgs = []
    }
    return (
      <div>
        <ul>{msgs.map(msgToElement)}</ul>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.handleMessageChange} type="text" />
          <input type="submit" />
        </form>
      </div>
    )
  }
}

let Chat = connect(function(state) {
  return {
    sid: state.sessionId,
    messages: state.msgs
  }
})(UnconnectedChat)

// * Create a component for signing up
//    * Use fetch to send an HTTP request to the signup endpoint of the backend
//    * Test your component and read the output from the backend
class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: ""
    }
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleUsernameChange(event) {
    console.log("new username", event.target.value)
    this.setState({ username: event.target.value })
  }
  handlePasswordChange(event) {
    console.log("new password", event.target.value)
    this.setState({ password: event.target.value })
  }
  handleSubmit(evt) {
    evt.preventDefault()
    console.log("signup form submitted")
    let b = JSON.stringify({
      username: this.state.username,
      password: this.state.password
    })
    console.log("what im sending to the server", b)
    fetch("http://localhost:4000/signup", { method: "POST", body: b })
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        Username
        <input type="text" onChange={this.handleUsernameChange} />
        Password
        <input type="text" onChange={this.handlePasswordChange} />
        <input type="submit" />
      </form>
    )
  }
}

// * Create a component for login
//    * In case you need it
//       * Form reference
//    * Connect it to the store so that it can dispatch to the reducer
//    * Upon successful login, update the store with the session id
//       * You'll need to modify the reducer
//    * Check in react developer tools that the session id is actually placed in the store
//    * Test your component and read the output from the backend

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: ""
    }
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleUsernameChange(event) {
    console.log("new username", event.target.value)
    this.setState({ username: event.target.value })
  }
  handlePasswordChange(event) {
    console.log("new password", event.target.value)
    this.setState({ password: event.target.value })
  }
  handleSubmit(evt) {
    evt.preventDefault()
    console.log("login form submitted")
    let b = JSON.stringify({
      username: this.state.username,
      password: this.state.password
    })
    console.log("what im sending to the server", b)
    fetch("http://localhost:4000/login", { method: "POST", body: b })
      .then(function(x) {
        return x.text()
      })
      .then(responseBody => {
        console.log("responseBody from login", responseBody)
        let body = JSON.parse(responseBody)
        console.log("parsed body", body)
        this.props.dispatch({
          type: "set-session-id",
          sessionId: body.sid
        })
      })
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        Username
        <input type="text" onChange={this.handleUsernameChange} />
        Password
        <input type="text" onChange={this.handlePasswordChange} />
        <input type="submit" />
      </form>
    )
  }
}

let Login = connect()(UnconnectedLogin)

// * Create a top level component. Let's assume you called it App
class UnconnectedApp extends Component {
  render() {
    if (this.props.sid) {
      return <Chat />
    }
    return (
      <div>
        <h1> signup</h1>
        <Signup />
        <h1> login</h1>
        <Login />
      </div>
    )
  }
}

let App = connect(function(state) {
  return { sid: state.sessionId }
})(UnconnectedApp)

let reducer = function(state, action) {
  if (action.type === "set-session-id") {
    return { ...state, sessionId: action.sessionId }
  }
  if (action.type === "set-messages") {
    return { ...state, msgs: action.messages }
  }
  return state // Needed because react-redux calls your reducer with an @@init action
}

const store = createStore(
  reducer,
  {}, // initial state
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
)
