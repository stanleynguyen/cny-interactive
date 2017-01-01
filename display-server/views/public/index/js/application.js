var counter; //global counter to detect if there's new wish
var cachedWishes; //global object to cache wishes

var numLanterns = 5;
var lanternArray = [$("#lantern1"), $("#lantern2"), $("#lantern3"), $("#lantern4"), $("#lantern5")];
var lanternTextArray = [$("#lantern1-text"), $("#lantern2-text"), $("#lantern3-text"), $("#lantern4-text"), $("#lantern5-text")];

$(document).ready(function() {
  positionLanterns();
  setInterval(fetchWishes.bind(event, displayText), 6000);
});

function positionLanterns() {
  var spacing = 100;
  var offset = 100;
  var lanternWidth = 200;

  for (var i=0; i<numLanterns; i++) lanternArray[i][0].style.left = spacing + ((offset + lanternWidth) * i) + 'px';
}

function fetchWishes(callback) {
  $.ajax({
    url: '/api/wishes/filtered',
    method: 'GET'
  }).done(function(response) {
    callback(null, response);
  }).fail(function(err) {
    callback(err);
  });
}

function displayText(err, wishes) {
  if (err && counter === undefined) {
    return;
  } else if (err && wishes === undefined) {
    wishes = cachedWishes;
  } else if (!err && wishes !== undefined) {
    counter = counter || wishes.length;
    cachedWishes = wishes;
  }

  for (var i=0; i<numLanterns; i++) {
    if (wishes.length > counter) {
      counter++;
      wish = wishes[counter-1].content;
    } else {
      randomIndex = Math.round(Math.random() * ( counter - 1 ));
      wish = wishes[randomIndex].content;
    }

    lanternTextArray[i].text(wish);

    var speed = 5000 + (Math.random()*1000);
    lanternArray[i].animate({top: '-200px'}, speed, function() { this.style.top = '100%'; });
  }
}