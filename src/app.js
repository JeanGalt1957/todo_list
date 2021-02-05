App = {
    loading: false,
    contracts: {},
    load: async () => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

      // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
      App.account = web3.eth.accounts[0]
      // console.log(App.account)
  },

  loadContract: async () => {
    // create a JavaScript version of the smart contract
    const todoList = await $.getJSON('TodoList.json')
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.web3Provider)

    // Hyrdate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed()
  },

render: async () => {
  // prevent double rendering
  if (App.loading) {
    return
  }

  //Update app loading state
  App.setLoading(true)
  
  // Render Account
  $('#account').html(App.account) // communicates with account in HTML line 49

  // render tasks
  await App.renderTasks()

  //Update loading state
  App.setLoading(false)
},

renderTasks: async () => {
  //load tasks from blockchain

  const taskCount = await App.todoList.taskCount()
  const $taskTemplate = $('.taskTemplate')

  // render out each task with the task template

  for (var i =1; i <= taskCount; i++) {
      // fetch the task data from the blockchain
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber() //numbered 0-2 within for array
      const taskContent = task[1] // Id content and completed tie with sol contract
      const taskCompleted = task[2]

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)
      // Put the task in the correct list
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      //show the task
      $newTaskTemplate.show()
  }

  // show the task on the page
},

setLoading: (boolean) => {
  App.loading = boolean
  const loader = $('#loader') // is 'loader' from HTML file
  const content = $('#content')
  if (boolean) {
    loader.show()
    content.hide()
  } else {
    loader.hide()
    content.show()
  }
}

}

$(() => {
    $(window).load(() => {
        App.load()
    })
})