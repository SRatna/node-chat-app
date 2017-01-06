class Users {
  constructor() {
    this.users=[]
  }

  addUser(id,name,room){
    var user = {id,name,room};
    this.users.push(user);
    return user;
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
}

// var aUser = new Users();
// var newOne = aUser.addUser(32,'sdf','df');
// var rm = aUser.removeUser(32);
// console.log(rm);
// console.log(aUser.getUserList('df'));
module.exports={Users};
