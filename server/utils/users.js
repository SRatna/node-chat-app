const _ = require('lodash');
class Users {
  constructor() {
    this.users=[]
  }

  addUser(id,name,room){
    var user = {id,name,room};
    this.users.push(user);
    return user;
  }
  getUserByName(name){
    return this.users.filter((user)=>user.name===name)[0];
  }
  getUser(id){
    return this.users.filter((user)=>user.id===id)[0];
  }
  removeUser(id){
    var user = this.getUser(id);
    if(user){
      this.users=this.users.filter((user)=>user.id!==id);
    }
    return user;
  }
  getUserList(room){
    var users = this.users.filter((user)=>user.room===room);
    var usersList = users.map((user)=>user.name);
    return usersList;
  }
  getActiveRooms(){
    return _.uniq(this.users.map((user)=>user.room));
  }
}

// var aUser = new Users();
// aUser.addUser(32,'sdf','df');
// aUser.addUser(332,'sdddf','df');
// aUser.addUser(312,'sdwwf','df');
// console.log(aUser.getActiveRooms());
// var rm = aUser.removeUser(32);
// console.log(rm);
// console.log(aUser.getUserList('df'));
module.exports={Users};
