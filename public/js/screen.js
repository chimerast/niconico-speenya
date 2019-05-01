const $menu = $('#menu');
const $dialog = $('#dialog');

$(function() {
  $menu.click(function() {
    $dialog.modal('show');
  });

  $('#color-picker').change(function() {
    $('#rgb').val($(this).val());
    $('body').css('backgroundColor', $(this).val());
  });

  $('#rgb').change(function() {
    $('#color-picker').val($(this).val());
    $('body').css('backgroundColor', $(this).val());
  });

  // init
  $dialog.modal('hide');
});
