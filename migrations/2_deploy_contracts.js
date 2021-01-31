var TodoList = artifacts.require("./TodoList.sol"); //truffle pulls the abstracted file from the JSON created on compile

module.exports = function(deployer) {
  deployer.deploy(TodoList);
};
