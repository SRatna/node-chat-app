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

socket.on('newLocMsg',function (msg) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">View User Location</a>');

  li.text(`${msg.from}: `);
  a.attr('href',msg.url);
  li.append(a);
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

var locBtn = jQuery('#send-loc');
locBtn.on('click',function () {
  if(!navigator.geolocation) return alert('No support for geolocation');

  navigator.geolocation.getCurrentPosition(function (pos) {
    // console.log(pos);
    socket.emit('createLocMsg',{
      lt:pos.coords.latitude,
      lg:pos.coords.longitude
    });
  },function () {
    alert('Unable to fetch ur location');
  });
});
