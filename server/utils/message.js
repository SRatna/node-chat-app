var genMsg=(from,text)=>{
  return {
    from,
    text,
    createdAt:new Date().getTime()
  }
}
var genLocMsg=(from,lg,lt)=>{
  return{
    from,
    url:`https://www.google.com/maps?q=${lg},${lt}`,
    createdAt:new Date().getTime()
  }
}
module.exports={genMsg,genLocMsg};
