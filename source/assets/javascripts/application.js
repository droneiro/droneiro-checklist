import 'application.css.sass'

const FastClick = require('fastclick');

if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}

setTimeout(function(){
  document.body.classList.add('checklist-select')
},100)

$(document).ready(function(){
  $('.js-checklist-option').click(function(){
    setChecklist($(this));
  })

  $('.js-toggle-check').click(function(){
    toggleChecklistItem($(this));
  })
})

var currentChecklist = '';

function setChecklist(checklist) {
  var currentChecklist = checklist.attr('data-checklist');
  $('.js-main-instruction').text('Pronto! Carregando checklist...');
  $('body').removeClass('checklist-select');
  $('body').addClass('checklist-selected');
  checklist.addClass('selected');
  setTimeout(function(){
    $('body').attr('current-checklist', currentChecklist);
    updateProgress();
  }, 2000)
}

function toggleChecklistItem(item) {
  item.toggleClass('checked');
  if (item.is('.js-group')) {
    updateGroupProgress(item.attr('data-group'))
  }
  if (item.is('.js-group-master')) {
    toggleChecklistGroup(item.attr('data-group'))
  }
  updateProgress();
}

function toggleChecklistGroup(group) {
  $('.js-group[data-group='+group+']').toggleClass('checked', $('.js-group-master[data-group='+group+']').is('.checked'))
}

function updateGroupProgress(group) {
  var currentGroup = $('.js-group[data-group='+group+']'),
    total = currentGroup.length,
    checked = $(currentGroup).filter('.checked').length;
  $('.js-group-master[data-group='+group+']').toggleClass('checked', checked == total);
}

function updateProgress() {
  var currentChecklist = $('body').attr('current-checklist'),
    total = $('.'+currentChecklist).find('.js-toggle-check').length,
    checked = $('.'+currentChecklist).find('.js-toggle-check.checked').length,
    percentage = parseInt(checked / total * 100)+'%'
  $('.js-status-percentage').width(percentage)
  $('.js-status-text').text(percentage)
  setActiveItem($('.'+currentChecklist))
  if (percentage >= 100) {
    finishChecklist();
  }
}

function setActiveItem(container) {
  var active = container.find('.js-toggle-check').not('.checked').not('.js-group-master')
  container.find('.js-toggle-check').removeClass('active')
  if (active.length) {
    $(active[0]).addClass('active')
    scrollToElement($(active[0]))
  }
}

function finishChecklist() {
  // alert('Checklist finished!');
}

function scrollToElement(element) {
  var $window = $(window),
    $element = $(element),
    elementTop = $element.offset().top,
    elementHeight = $element.height(),
    viewportHeight = $window.height(),
    scrollIt = elementTop - ((viewportHeight - elementHeight) / 2);

  $("html, body").animate({scrollTop: scrollIt}, 200);
}
