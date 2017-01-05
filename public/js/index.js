var socket = io();

socket.on('connect',function () {
  console.log('connected to server');

});

socket.on('disconnect',function () {
  console.log('disconnected from server');
});

socket.on('newMsg',function (msg) {
  //console.log('got msg: ',msg);
  var li = jQuery('<li></li>');
  li.text(`${msg.from}: ${msg.text}`);
  jQuery('#msgs').append(li);
});

jQuery('#msg-form').on('submit', function (e) {
  e.preventDefault();
  socket.emit('createMsg',{
    from:'osho',
    text:jQuery('[name=msg]').val()
  },function (data){
    console.log(data);
  });
  jQuery('#msg').val('');
});
