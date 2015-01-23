(function () {
  // change to your server url
  var SERVER_URL = 'http://localhost:2525';

  function initialize() {
    if (typeof io == 'undefined' || typeof io.connect == 'undefined') {
      setTimeout(initialize, 100);
      return;
    }

    var socket = io.connect(SERVER_URL);
    socket.on('comment', handleComment);
    socket.on('like', handleLike);

    console.log('niconico speenya v0.0.1: ' + SERVER_URL);
  }

  function rand(value) {
    return Math.floor(value * Math.random());
  }

  function handleComment(msg) {
    var color = msg.color || '#000000';
    var shadow = msg.shadow || '#ffffff'
    var size = msg.size || 32;

    var t = document.createElement('div');

    t.style.position = 'fixed';
    t.style.left = window.innerWidth + 'px';
    t.style.top = rand(window.innerHeight - 40) + 'px';
    t.style.fontSize = size + 'pt';
    t.style.color = color;
    t.style.textShadow = '-2px -2px 0px ' + shadow + ', -2px 2px 0px ' + shadow + ', 2px -2px 0px ' + shadow + ', 2px 2px 0px ' + shadow;
    t.style.whiteSpace = 'pre';
    t.style.zIndex = 2147483647;

    t.innerText = msg.body;

    document.body.appendChild(t);

    var effect = [{
      left: window.innerWidth + 'px'
    }, {
      left: -t.offsetWidth + 'px'
    }];

    var timing = {};
    timing.duration = msg.duration || 2000;
    timing.iterations = 1;
    timing.easing = msg.easing || 'linear';

    t.animate(effect, timing).onfinish = function () {
      document.body.removeChild(t);
    };
  }

  function handleLike(msg) {
    var image = msg.image || 'thumb';
    var url = msg.url || 'chrome-extension://eopheappniebiogjpdkkehplbpdfalkl/images/' + image + '.png';

    var t = document.createElement('img');

    t.addEventListener('load', function (e) {
      t.style.position = 'fixed';
      t.style.left = rand(window.innerWidth) - t.width/2 + 'px';
      t.style.top = rand(window.innerHeight) - t.height/2 + 'px';
      t.style.zIndex = 2147483647;
      t.style.opacity = 0.0;

      document.body.appendChild(t);

      var effect = [{
        opacity: 0.0,
        transform: 'scale(0.2, 0.2) translate(0, 20px)'
      }, {
        opacity: 1.0,
        transform: 'scale(0.5, 0.5) translate(0, 0px)'
      }, {
        opacity: 0.0,
        transform: 'scale(1.0, 1.0) translate(0, -50px)'
      }];

      var timing = {};
      timing.duration = msg.duration || 1000;
      timing.iterations = 1;
      timing.easing = msg.easing || 'ease';

      t.animate(effect, timing).onfinish = function () {
        document.body.removeChild(t);
      };
    });

    t.src = url;
  }

  initialize();
})();
