/* global chrome, io */
(function () {
  // change to your server url
  const SERVER_URL = 'http://localhost:2525'
  const APP_ID = chrome.runtime.id
  const APP_VERSION = chrome.runtime.getManifest().version

  let socket = null

  function connect () {
    if (socket) return

    socket = io.connect(SERVER_URL, { 'forceNew': true })
    socket.on('comment', handleComment)
    socket.on('like', handleLike)

    console.log(`niconico speenya v${APP_VERSION}: connect to ${SERVER_URL}`)
  }

  function disconnect () {
    if (!socket) return

    socket.disconnect()
    socket = null

    console.log(`niconico speenya v${APP_VERSION}: disconnect from ${SERVER_URL}`)
  }

  function rand (value) {
    return Math.floor(value * Math.random())
  }

  function checkEnabled () {
    return new Promise(function (resolve, reject) {
      chrome.runtime.sendMessage({
        message: 'checkEnabled'
      }, function (response) {
        resolve(response.enabled)
      })
    })
  }

  function handleComment (msg) {
    const color = msg.color || '#000000'
    const shadow = msg.shadow || '#ffffff'
    const size = msg.size || 56

    const t = document.createElement('div')

    t.style.position = 'fixed'
    t.style.left = window.innerWidth + 'px'
    t.style.top = rand(window.innerHeight - 40) + 'px'
    t.style.fontSize = size + 'pt'
    t.style.fontWeight = 'bold'
    t.style.color = color
    t.style.textShadow = `-2px -2px 0px ${shadow}, -2px 2px 0px ${shadow}, 2px -2px 0px ${shadow}, 2px 2px 0px ${shadow}`
    t.style.whiteSpace = 'pre'
    t.style.zIndex = 2147483647

    t.innerText = msg.body

    document.body.appendChild(t)

    const effect = [{
      left: window.innerWidth + 'px'
    }, {
      left: -t.offsetWidth + 'px'
    }]

    const timing = {}
    timing.duration = (msg.duration || 2000) * (window.innerWidth + t.offsetWidth) / window.innerWidth
    timing.iterations = 1
    timing.easing = msg.easing || 'linear'

    t.style.top = rand(window.innerHeight - t.offsetHeight) + 'px'

    t.animate(effect, timing).onfinish = function () {
      document.body.removeChild(t)
    }
  }

  function handleLike (msg) {
    const image = msg.image || 'thumb'
    const url = msg.url || `chrome-extension://${APP_ID}/images/${image}.png`

    const t = document.createElement('img')

    t.addEventListener('load', function (e) {
      t.style.position = 'fixed'
      t.style.left = rand(window.innerWidth) - t.width / 2 + 'px'
      t.style.top = rand(window.innerHeight) - t.height / 2 + 'px'
      t.style.zIndex = 2147483647
      t.style.opacity = 0.0

      document.body.appendChild(t)

      const effect = [{
        opacity: 0.0,
        transform: 'scale(0.2, 0.2) translate(0, 20px)'
      }, {
        opacity: 1.0,
        transform: 'scale(0.5, 0.5) translate(0, 0px)'
      }, {
        opacity: 0.0,
        transform: 'scale(1.0, 1.0) translate(0, -50px)'
      }]

      const timing = {}
      timing.duration = msg.duration || 1000
      timing.iterations = 1
      timing.easing = msg.easing || 'ease'

      t.animate(effect, timing).onfinish = function () {
        document.body.removeChild(t)
      }
    })

    t.src = url
  }

  checkEnabled()
    .then(function (enabled) {
      if (enabled) {
        connect()
      } else {
        disconnect()
      }
    })

  return {
    connect: connect,
    disconnect: disconnect
  }
})()
