import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from './config'
import ToDoList from './TodoList'

class App extends Component {

  constructor(props) {
    super(props)
    this.createTask = this.createTask.bind(this)
    this.toggleCompleted = this.toggleCompleted.bind(this)
    this.state = {
      account: '',
      todoList: {},
      taskCount: 0,
      tasks: [],
      loading: true,
      connected: false
    }
  }

  componentDidMount() {
    this.loadBlockchainData()
  }
  
  async connectWeb3() {
    this.setState({ loading: true })
    if (window.ethereum){
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      this.loadBlockchainData()
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
    this.setState({ connected: true })
    this.setState({ loading: false })
  }

  async loadBlockchainData() {
    const web3 = new Web3(window.ethereum)
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS)
    this.setState({ todoList })
    const taskCount = await todoList.methods.taskCount().call()
    this.setState({ taskCount })
    for (var i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call()
      this.setState({
        tasks: [...this.state.tasks, task]
      })
    }
  }

  createTask(content) {
    this.setState({ loading: true })
    this.state.todoList.methods.createTask(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  toggleCompleted(taskId) {
    this.setState({ loading: true })
    this.state.todoList.methods.toggleCompleted(taskId).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    let content
    if(this.state.loading) {
      if(this.state.connected) {
        content = <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
      } else {
        content = <button type="button" className="btn btn-primary" onClick={() => this.connectWeb3()}>Connect</button>
      }
    } else {
      content = <ToDoList 
        tasks={this.state.tasks} 
        createTask={this.createTask} 
        toggleCompleted={this.toggleCompleted} 
      />
    }
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href=" " target="_blank">Andrew's | Todo List</a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <a className="nav-link" href=" "><span id="account">{this.state.connected && this.state.account}</span></a>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              { content }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;