/**
 * @author: Sofish Lin
 * @site: http://sofish.de
 * @license: MIT
 */


var App, $preview, $toolbar, editor, $code, writedown;

$code = $('#editor');
$preview = $('#preview');
$toolbar = $('#toolbar');
$tips = $('#tips');

// embed settings
~function() {

  var fontsize, lineheight, settings;

  fontsize= localStorage.getItem('wdfont-size') || 16;
  lineheight = localStorage.getItem('wdline-height') &&
    (localStorage.getItem('wdline-height')/100 || 1.8) ;

  settings = '<style>.CodeMirror, #preview {' +
    'font-size:' + fontsize + 'px;' +
    'line-height:' + lineheight + ';' +
    '}</style>';

  $('head').append(settings);

}();

// highlight markdown
editor = CodeMirror(document.querySelector('#editor'), {
  mode: 'gfm',
  //lineNumbers: true,
  value: localStorage.getItem('writedown') || '',
  theme: "default"
});


App = function(){
  this.init();
};

// translate md to html
App.prototype.html = function() {
  return marked(this.md());
};

// get the md source
App.prototype.md = function() {
  return editor.getValue();
}

App.prototype.origin = function() {
  $preview.hide();
  $code.show('fast');
}

// save as a md document
App.prototype.save = function() {
  var fs = require('fs');
};

// preview markdown
App.prototype.preview = function() {
  $code.hide();
  $preview.html(this.html()).show('fast');
};

// export to html
App.prototype.viewHTML = function() {
  $code.hide();
  $preview.hide().html('');
  $('<pre class="prettyprint lang-html" />').appendTo($preview).text(this.html());
  $preview.show('fast');
};

App.prototype.copy = function() {
  Clipboard.set(this.html(), 'text');
  $tips.html('<span>HTML is copied!</span>').show('fast');
  setTimeout(function(){
    $tips.fadeOut();
  }, 1000);
};

App.prototype.init = function() {
  var quit, that;

  that = this;

  // save data to local disk before close
  quit = function() {
    localStorage.setItem('writedown', that.md());
  };

  // keep focus
  $(document).on('click', function() {
    editor.focus();
  })

  $(window).on('beforeunload', quit);

  //TODO: keep on focus

}

writedown = new App();

$toolbar.on('click', '.btn', function() {

  // button status
  $('.btn').removeClass('on');
  if(/origin|preview|viewHTML/.test($(this).data('action'))) $(this).addClass('on');
  var action = $(this).data('action');

  // action
  writedown[action]();

  // highlight code
  if(/preview|viewHTML/.test(action)) prettyPrint();
});

Mousetrap.bind('command+shift+p', function() {
  $('#covert').click();
});

Mousetrap.bind('command+shift+c', function() {
  $('#copy').click();
});

Mousetrap.bind('command+shift+h', function() {
  $('#viewHTML').click();
});

Mousetrap.bind(['command+shift+b', 'esc'], function() {
  $('#markdown').click();
});

Mousetrap.bind(['command+,'], function() {
  window.location.href = './settings.html';
});

