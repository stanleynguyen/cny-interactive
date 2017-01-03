var counter; //global counter to detect if there's new wish
var cachedWishes; //global object to cache wishes
var prevOffsetLeft;
var isChineseAndShort;
var isChineseAndLong;

var lanternCounter = 0;
var $wishContainer = $('#wish-container');

$(document).ready(function() {
  fetchWishes(generateLantern);
  setInterval(fetchWishes.bind(null, generateLantern), 5000);
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

  if (wishes.length === 0) return;

  if (wishes.length > counter) {
    counter++;
    wish = wishes[counter-1];
  } else {
    randomIndex = Math.round(Math.random() * ( counter - 1 ));
    wish = wishes[randomIndex];
  }

  isChineseAndShort = wish.content.match(/[\u3400-\u9FBF]/) && wish.content.length < 40;
  isChineseAndLong = wish.content.match(/[\u3400-\u9FBF]/) && wish.content.length > 40;
  $wishContainer.append($(lantern(lanternCounter, wish)))
    .promise()
    .done(animateLaterns.bind(null, lanternCounter, isChineseAndShort, isChineseAndLong));
}

function animateLaterns(id, isChineseAndShort, isChineseAndLong) {
  var thisLantern = $('#lantern-' + id);
  var newOffsetLeft = Math.random() * (window.innerWidth - 350);
  while (prevOffsetLeft && Math.abs(newOffsetLeft - prevOffsetLeft) < 350) newOffsetLeft = Math.random() * (window.innerWidth - 350);
  prevOffsetLeft = newOffsetLeft;
  thisLantern[0].style.left = newOffsetLeft + 'px';
  var zIndex = Math.round(Math.random() * 0.8) + 1;
  thisLantern[0].style.zIndex = zIndex;
  if (zIndex === 1) {
    thisLantern[0].style.width = '250px';
    thisLantern[0].style.minHeight = '350px';
    thisLantern[0].style.fontSize = '22px';
  }
  if (isChineseAndShort) thisLantern[0].style.fontSize = '26px';
  else if (isChineseAndLong && zIndex === 1) thisLantern[0].style.fontSize = '20px';
  else if (isChineseAndLong && zIndex === 2) thisLantern[0].style.fontSize = '22px';
  var duration = 30000 + (Math.random() * 5000);
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
