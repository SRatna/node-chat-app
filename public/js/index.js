var socket = io();

socket.on('connect',function () {
  console.log('connected to server');

});

socket.on('disconnect',function () {
  console.log('disconnected from server');
});

socket.on('newMsg',function (msg) {
  //console.log('got msg: ',msg);
  var fmtTime = moment(msg.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(`${msg.from} ${fmtTime}: ${msg.text}`);
  jQuery('#msgs').append(li);
});

socket.on('newLocMsg',function (msg) {
  var fmtTime = moment(msg.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">View User Location</a>');

  li.text(`${msg.from} ${fmtTime}: `);
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
  jQuery('#msg').val(''); //clearing the textbox
});

var locBtn = jQuery('#send-loc');
locBtn.on('click',function () {
  if(!navigator.geolocation) return alert('No support for geolocation');
  locBtn.attr('disabled','disabled').text('Sending Location...');
  navigator.geolocation.getCurrentPosition(function (pos) {
    // console.log(pos);
    locBtn.removeAttr('disabled').text('Send Location');
    socket.emit('createLocMsg',{
      lt:pos.coords.latitude,
      lg:pos.coords.longitude
    });
  },function () {
    locBtn.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch ur location');
  });
});
