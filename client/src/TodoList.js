import React, { Component } from 'react'

export default class TodoList extends Component {

  render() {
    return (
      <div id="content">
        <form onSubmit={(event) => {
          event.preventDefault()
          this.props.createTask(this.task.value)
        }}>
          <input id="newTask" ref={(input) => this.task = input} type="text" className="form-control" placeholder="Add task..." required />
          <input type="submit" hidden={true} />
        </form>
        <ul id="taskList" className="list-unstyled">
          { this.props.tasks.map((task, key) => {
            return(
              <div id="task" className="checkbox" key={key}>
                <label>
                  <input type="checkbox"
                         name={task.id}
                         defaultChecked={task.completed}
                         ref={(input) => {
                           this.checkbox = input
                         }}
                         onClick={(event) => {
                           this.props.toggleCompleted(this.checkbox.name)
                         }}/>
                  <span className="content">{task.content}</span>
                </label>
              </div>
            )
          })}
        </ul>
        <ul id="completedTaskList" className="list-unstyled">
          { this.props.tasks.map((task, key) => {
            return(
              <div id="completedTask" className="crossed" key={key}>
                <span className="content">
                  { task.completed && task.content }</span>
              </div>
            )
          })}
        </ul>
      </div>
    )
  }
}
