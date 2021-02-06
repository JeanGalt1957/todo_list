pragma solidity ^0.5.0;

contract TodoList { //contract must be lower case!
    uint public taskCount = 0; // state variables are written to the blockchain
    // public allows taskCount can be read from contract

    struct Task { //
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(
            uint id,
            string content,
            bool completed
    );

    event TaskCompleted(
        uint id,
        bool completed
    );

    constructor() public { //herein is a default taks for testing
        createTask("Check out this task");
    }

    function createTask(string memory _content) public { //puts the task inside of the Task struct mapping
            taskCount ++;
            tasks[taskCount] = Task(taskCount, _content, false); //1, 2, 3 correspend with struct data
            emit TaskCreated(taskCount, _content, false);

    }

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }








}

// on compile will create a JSON representation of the smarth contract (abstract binary interface, etc)