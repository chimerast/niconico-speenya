// prevent user scroll on mobile phone
document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

function handleSubmit(form) {
  var action = $(form).attr('action');
  var params = $(form).serialize();
  var url = action + '?' + params;
  $.get(url).fail(function() { alert('failed to send message.') });
}

function like(type) {
  var action = '/like';
  var params = 'image=' + type;
  var url = action + '?' + params;
  $.get(url).fail(function() { alert('failed to send stamp.') });
}

$(function() {
  FastClick.attach(document.body);
  $('button.send1').click(function() { var type = $(this).attr('data-type'); like(type); });
  $('button.send2').click(function() { var type = $(this).attr('data-type'); like(type); });
  $('select.send1 + span > button').click(function() { var type = $('select.send1').val(); like(type); });
  $('select.send2 + span > button').click(function() { var type = $('select.send2').val(); like(type); });
  $('div.smarium > button').click(function() {
    var color = $(this).attr('data-color');
    var $screen = $('body').prepend('<div class="screen">画面タップで閉じる<br>※画面を見つめないでください。</div>');
    $('div.screen').addClass(color);
  });
  $(document).on('click', 'div.screen', function() {
    $(this).remove();
  });
});
