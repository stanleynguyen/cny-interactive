$(document).ready(function() {
  loadUnfilteredWishes();
  $(document).on('click', '.wish .btn-success', function(event) {
    var $target = $(event.currentTarget);
    $target.prop('disabled', 'true');
    var wishId = $target.parent().attr('id');
    $target.text('Approving...');
    $target.prop('disabled', 'true');
    filterWish(true, wishId);
  });
  $(document).on('click', '.wish .btn-danger', function(event) {
    var $target = $(event.currentTarget);
    var wishId = $target.parent().attr('id');
    $target.text('Rejecting...');
    $target.prop('disabled', 'true');
    filterWish(false, wishId);
  });
});

//application core functions
function loadUnfilteredWishes() {
  $.ajax({
    url: '/api/wishes/unfiltered',
    method: 'GET'
  }).done(function(res) {
    var wishContainer = $('#unfiltered-wishes');
    res.forEach(function(currentWish) {
      wishContainer.append(wish(currentWish._id, currentWish.content, currentWish.author));
    });
  }).fail(function(e) {
    alert(e.message);
  });
}

function filterWish(accept, wishId) {
  $.ajax({
    url: '/api/wishes',
    method: accept ? 'POST' : 'DELETE',
    data: { id: wishId }
  }).done(function() {
    $('#' + wishId).parent().remove();
  }).fail(function(e) {
    alert(e.message);
    accept ? resetAllBtnSuccess() : resetAllBtnDanger();
  });
}

//helper functions
function resetAllBtnSuccess() {
  $('.btn-success').text('Accept');
  $('.btn-success').prop('disabled', 'false');
}

function resetAllBtnDanger() {
  $('.btn-danger').text('Reject');
  $('.btn-danger').prop('disabled', 'false');
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
