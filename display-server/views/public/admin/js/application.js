$(document).ready(function() {
  // initial load of wishes
  loadUnfilteredWishes();
  //check for new wishes every 30 seconds
  setInterval(checkNewWishes, 30000);
  // request notification permission and example one
  var exampleNoti = notify('Example Notification', {
    body: 'There will be ding sound together with this notification. Click on it to go back to admin page and reload for new wishes',
    icon: '/img/rooster.jpg'
  }, true);
  if (exampleNoti) {
    exampleNoti.onclick = function() { window.focus(); this.close();};
    exampleNoti.onclose = function() { window.focus(); };
  }
  // approve wish
  $(document).on('click', '.wish .btn-success', function(event) {
    var $target = $(event.currentTarget);
    $target.prop('disabled', 'true');
    var wishId = $target.parent().attr('id');
    $target.text('Approving...');
    $target.prop('disabled', 'true');
    filterWish(true, wishId);
  });
  // reject wish
  $(document).on('click', '.wish .btn-danger', function(event) {
    var $target = $(event.currentTarget);
    var wishId = $target.parent().attr('id');
    $target.text('Rejecting...');
    $target.prop('disabled', 'true');
    filterWish(false, wishId);
  });
  // reload wishes list on unfiltered wish
  $(document).on('click', '#reload', loadUnfilteredWishes);
});

//application core functions
function loadUnfilteredWishes() {
  $.ajax({
    url: '/api/wishes/unfiltered',
    method: 'GET'
  }).done(function(res) {
    var wishContainer = $('#unfiltered-wishes');
    wishContainer.html('');
    res.forEach(function(currentWish) {
      wishContainer.append(wish(currentWish._id, currentWish.content, currentWish.author));
    });
    $('.alert-danger').hide();
  }).fail(function(e) {
    alert(e.status);
  });
}

function checkNewWishes() {
  $.ajax({
    url: '/api/wishes/unfiltered',
    method: 'GET'
  }).done(function(res) {
    if (res.length > 0) {
      $('.alert-danger').show();
      var noti = notify('New Wishes', {body: 'New Wished waiting to be filtered', icon: '/img/rooster.jpg'});
      if (noti) {
        noti.onclick = function() { window.focus(); this.close(); loadUnfilteredWishes();};
        noti.onclose = function() { window.focus(); };
      }
    }
  }).fail(function(e) {});
}

function filterWish(accept, wishId) {
  $.ajax({
    url: '/api/wishes',
    method: accept ? 'POST' : 'DELETE',
    data: { id: wishId }
  }).done(function() {
    $('#' + wishId).parent().remove();
  }).fail(function(e) {
    alert(e.status);
    accept ? resetAllBtnSuccess() : resetAllBtnDanger();
  });
}

//helper functions
function resetAllBtnSuccess() {
  $('.btn-success').text('Approve');
  $('.btn-success').prop('disabled', 'false');
}

function resetAllBtnDanger() {
  $('.btn-danger').text('Reject');
  $('.btn-danger').prop('disabled', 'false');
}

function notify(title, options, request) {
  if (!("Notification" in window)) {
    alert("Your browser doesn't support notification. Please check back this page very often");
  } else if (Notification.permission === "granted") {
    var notification = new Notification(title, options);
    $('#ding')[0].play();
    return notification;
  } else if (Notification.permission !== 'denied') {
    $('.alert-warning').show();
    if (request) Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        var notification = new Notification(title, options);
        $('#ding')[0].play();
        $('.alert-warning').hide();
        return notification;
      }
    });
  } else {
    $('.alert-warning').show();
  }
}

//element rendering functions
var wish = function(wishId, wishContent, wishAuthor) {
  return `
  <div class="jumbotron wish">
    <form id="${wishId}">
      <blockquote>
        <p>${wishContent}</p>
        <footer>${wishAuthor}</footer>
      </blockquote>
      <button class="btn btn-success" type="button">Approve</button>
      <button class="btn btn-danger pull-right" type="button">Reject</button>
    </form>
  </div>
  `;
};
