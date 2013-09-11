var socket;

$(function() {

  // Hide everything
  $('form').hide();
  $('p.text-info').hide();
  $('#playersPanel').hide();

  socket = io.connect();

  socket.on('info', function(data) {
    if(data.hasOwnProperty('info')) {
      if(data.info == 'waiting player') {
        handlePlayerLogin();
      } else if(data.info == 'game full') {
        showInfo('Sorry bro, the game is full. Come back later!');
      }
    }
  });

});

function handlePlayerLogin() {
  showForm();

  // "Join the game" button behaviour
  $('#joinGame').on('click', function() {
    // Check if the name is written
    if($('#name').val().length > 2) {
      socket.emit(
        'newPlayer', 
        {name: $('#name').val()}
      );
    } else {
      showInfo('Dude, your player name is incorrect!');
    }
    return false;
  });

  // Response from the Node.js server
  socket.on('confirmPlayer', function(data) {
    if(data.hasOwnProperty('name')) {
      showInfo('The server says: Hi ' + data.name);
      hideForm();

      // Wait for the game to be full
      socket.on('info', function(data) {
        if(data.hasOwnProperty('info')    &&
           data.info == 'ready to play'  &&
           data.hasOwnProperty('players')) {
           showPlayersPanel(data.players);
        }
      });
    }
  });
}

function showForm() {
  $('form').show(400);
}

function hideForm() {
  $('form').hide(400);
}

function showInfo(text) {
  $('p.text-info').text(text);
  $('p.text-info').show(400);
}

function hideInfo() {
  $('p.text-info').hide(400);
}

function showPlayersPanel(players) {
  $.each(players, function(index, value) {
    $('ul').append('<li>' + value + '</li>');
  });
  $('#playersPanel').show(400);
}

function hidePlayersPanel() {
  $('#playersPanel').hide(400);
}