// YOUR CODE HERE:
$(document).ready(function(){
  $("form").submit(function(evt){
    evt.preventDefault();
    app.handleSubmit();
    app.clearMessages();
    app.fetch();
  });
});

var roomList = ["General", "Random", "HRR8", "4chan"];
var currentRoom = "General";
var app = {

  send: function(message){

    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(room){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: {order: '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        for(var i = 0; i < data.results.length; i++) {
          if (_.contains(roomList, data.results[i].room && data.results[i].room === currentRoom)) {
            app.addMessage(data.results[i], false);
          }
          else if (data.results[i].room === currentRoom) {
            app.addMessage(data.results[i], true);
          }
        }
      },
      error: function (data) {
        alert('No messages!');
      }
    });
  },

  clearMessages: function(){
    $('#chats').empty();
  },

  addMessage: function(data, other){
    var message = JSON.stringify(data.text);
    var username = data.username;
    var room = data.room || "General";
    if (other){
      $('#chats').append('<div class="chat '+room+'"><div class="username" data-name="'+username+'">'+username+'</div><div class="text">'+ message + '</div><div class=room "'+room+'">'+room+'</div></div>');
    } else {
      $('#chats').append('<div class="chat Other"><div class="username" data-name="'+username+'">'+username+'</div><div class="text">'+ message + '</div><div class=room "'+room+'">'+room+'</div></div>');
    }
    $( ".username" ).click(function() {
      var target = $(this).data("name");
      $("div").find("[data-name='" + target + "']").next().css("font-weight", "bold");
    });
  },

  handleSubmit: function(){
    var e = document.getElementById("roomSelect");
    var value = e.options[e.selectedIndex].text;
    var name = $(".name").val();
    if (name === "") {
      name = "Anonymous";
    }
    var message = {
      username: _.escape(name),
      text: _.escape($(".message").val()),
      room: value
    };
    app.send(message);
  }
};

app.fetch(currentRoom);

//invoked when rooms change
function changeFunc() {
  var selectBox = document.getElementById("roomSelect");
  var selectedValue = selectBox.options[selectBox.selectedIndex].text;
  $('div.chat').hide();
  $('.' + selectedValue).show();
  currentRoom = selectedValue;
  app.fetch(selectedValue);
}

