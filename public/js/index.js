var socket = io();

socket.on('showActiveRooms',function (rooms) {
  var myDiv = jQuery('#selectRooms');
  var selectRooms = jQuery('<select name="selectedRoom"></select>');

  if(jQuery.isEmptyObject(rooms)){
    selectRooms.append($('<option selected>No Rooms Available</option>'));
  }else {
    selectRooms.append($('<option selected>Available Rooms</option>'));
  }
  rooms.forEach(function (room) {
    selectRooms.append($('<option>', {value:room, text:room}));
    //$('select').append($('<option>', {value:1, text:'One'}));
  });
  myDiv.html(selectRooms);
});
