//cache all neccessary DOM elements
var $greetingInput = document.getElementById('greeting');
var $nameInput = document.getElementById('name');
var $greetingCounter = document.getElementById('greetingCounter');
var $nameCounter = document.getElementById('nameCounter');
var $form = document.getElementById('wish-form');
var $submitButton = document.getElementById('submit-button');

$greetingInput.addEventListener('keyup', textCounter.bind(event, $greetingInput, $greetingCounter, 140));
$nameInput.addEventListener('keyup', textCounter.bind(event, $nameInput, $nameCounter, 30));
$form.addEventListener('submit', submitWish.bind(event, $greetingInput, $nameInput));

function textCounter(input, output, charLimit) {
  output.innerHTML = '<p class="counter">' + input.value.length + '/' + charLimit + '</p>';
}

function submitWish(contentInput, authorInput) {
  event.preventDefault();
  $submitButton.disabled = true;
  $submitButton.value = '正在提交 / SUBMITTING...';
  var data = 'content=' + encodeURIComponent(contentInput.value) + '&author=' + encodeURIComponent(authorInput.value);
  var request = new XMLHttpRequest();
  request.open('POST', '/', true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        $form.innerHTML = '<p class="text-center">Thanks for your wish!<br>Have a great year ahead!</p>';
      } else if (request.status === 500) {
        alert('Server Error! Try again!');
      }
    }
  };
  request.send(data);
}
