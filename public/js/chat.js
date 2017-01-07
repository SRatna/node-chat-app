var socket = io();

function scrollToBottom() {
  var msgs = jQuery('#msgs');
  var newMsg = msgs.children('li:last-child');

  var clientHeight = msgs.prop('clientHeight');
  var scrollTop = msgs.prop('scrollTop');
  var scrollHeight = msgs.prop('scrollHeight');
  var newMsgHeight = newMsg.innerHeight();
  var lastMsgHeight = newMsg.prev().innerHeight();

  if(clientHeight+scrollTop+newMsgHeight+lastMsgHeight>=scrollHeight){
    msgs.scrollTop(scrollHeight);
  }
}
var activeUser;
socket.on('connect',function () {
  //console.log('connected to server');
  var params = jQuery.deparam(window.location.search);
  //console.log(params);
  var name=params.name;
  activeUser=name;
  var room=params.room;
  var selectedRoom=params.selectedRoom;
  if(selectedRoom==='No Rooms Available'||selectedRoom==='Available Rooms'){
    name=name.toLowerCase();
    room=room.toLowerCase();
  }else {
    name=name.toLowerCase();
    room=selectedRoom.toLowerCase();
  }
  params={name,room};

  socket.emit('join',params,function (err) {
    if(err){
      alert(err);
      window.location.href='/';
    }else {
      console.log('no err');
    }
  });

});

socket.on('disconnect',function () {
  console.log('disconnected from server');
});

socket.on('updateUserList',function (users) {
  //console.log('users are', users);
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    if(user===activeUser){
      ol.append(jQuery('<li style="background:indianred;color:white;"></li>').
      text(user.replace(/\b\w/g, function(l){ return l.toUpperCase() })));
    }else {
      ol.append(jQuery('<li></li>').text(user.replace(/\b\w/g, function(l){ return l.toUpperCase() })));
    }
  });
  jQuery('#users').html(ol);
});

socket.on('newMsg',function (msg) {
  var fmtTime = moment(msg.createdAt).format('h:mm a');
  var msgTmp = jQuery('#msgTem').html();
  var style;
  if(msg.from===activeUser){
    style='flex-end';
  }else {
    style='flex-start';
  }
  var html = Mustache.render(msgTmp,{
    from:msg.from.replace(/\b\w/g, function(l){ return l.toUpperCase() }),
    text:msg.text,
    createdAt:fmtTime,
    active:style
  });
  jQuery('#msgs').append(html);
  scrollToBottom();
  // var li = jQuery('<li></li>');
  // li.text(`${msg.from} ${fmtTime}: ${msg.text}`);
  // jQuery('#msgs').append(li);

});

socket.on('newLocMsg',function (msg) {
  var fmtTime = moment(msg.createdAt).format('h:mm a');
  var locMsgTmp = jQuery('#locMsgTem').html();
  var style;
  if(msg.from===activeUser){
    style='flex-end';
  }else {
    style='flex-start';
  }
  var html = Mustache.render(locMsgTmp,{
    from:msg.from.replace(/\b\w/g, function(l){ return l.toUpperCase() }),
    createdAt:fmtTime,
    url:msg.url,
    active:style
  });
  jQuery('#msgs').append(html);
  scrollToBottom();
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">View User Location</a>');
  // li.text(`${msg.from} ${fmtTime}: `);
  // a.attr('href',msg.url);
  // li.append(a);
  // jQuery('#msgs').append(li);
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
