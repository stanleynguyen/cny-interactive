var counter; //global counter to detect if there's new wish
var cachedWishes; //global object to cache wishes
var prevOffsetLeft;

var lanternCounter = 0;
var $wishContainer = $('#wish-container');

$(document).ready(function() {
  fetchWishes(generateLantern);
  setInterval(fetchWishes.bind(null, generateLantern), 3000);
});

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

function generateLantern(err, wishes) {
  lanternCounter++;
  lanternCounter %= 20;
  if (err && counter === undefined) {
    return;
  } else if (err && wishes === undefined) {
    wishes = cachedWishes;
  } else if (!err && wishes !== undefined) {
    counter = counter || wishes.length;
    cachedWishes = wishes;
  }

  if (wishes.length > counter) {
    counter++;
    wish = wishes[counter-1];
  } else {
    randomIndex = Math.round(Math.random() * ( counter - 1 ));
    wish = wishes[randomIndex];
  }

  $wishContainer.append($(lantern(lanternCounter, wish)))
    .promise()
    .done(animateLaterns.bind(null, lanternCounter));
}

function animateLaterns(id) {
  var thisLantern = $('#lantern-' + id);
  var newOffsetLeft = Math.random() * (window.innerWidth - 200);
  while (prevOffsetLeft && Math.abs(newOffsetLeft - prevOffsetLeft) < 200) newOffsetLeft = Math.random() * (window.innerWidth - 200);
  prevOffsetLeft = newOffsetLeft;
  thisLantern[0].style.left = newOffsetLeft + 'px';
  var duration = 14000 + (Math.random() * 5000);
  thisLantern.animate(
    {top: - thisLantern.height() + 'px'},
    duration,
    thisLantern.remove.bind(thisLantern)
  );
}

var lantern = function(id, wish) {
  return '<div class="lantern" id="lantern-' + id + '">' +
          '<p class="content">' + wish.content + '</p>' +
          '<p class="author">' + wish.author + '</p>' +
         '</div>';
};
