var counter; //global counter to detect if there's new wish
var $textObj = $("#wish-text");
var $wishContainer = $("#wish-container");

$(document).ready(function() {
  fetchWishes(displayText);
	setInterval(fetchWishes.bind(event, displayText), 5000);
});

function fetchWishes(callback) {
  $.ajax({
    url: '/api/wishes/filtered',
    method: 'GET'
  }).done(function(response) {
    callback(false, response);
  }).fail(function(err) {
    callback(err);
  });
}

function displayText(err, wishes) {
  counter = counter || wishes.length;
  if (wishes.length > counter) {
    counter++;
    wish = wishes[counter-1].content;
  } else {
    randomIndex = Math.round(Math.random() * ( counter - 1 ));
    wish = wishes[randomIndex].content;
  }
	$textObj.text(wish);
	$wishContainer.fadeIn(1000).delay(3000).fadeOut(1000);
}
