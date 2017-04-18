/* global chrome */
(function () {
  let enabled = false

  // get stored settings
  chrome.storage.sync.get({ enabled: true }, function (items) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError)
    }
    enabled = items.enabled
    update()
  })

  // execute script in all tabs
  function executeScriptInAllTabs (script) {
    chrome.tabs.query({ windowType: 'normal' }, function (tabs) {
      for (const tab of tabs) {
        if (tab.url.indexOf('chrome://') !== 0) {
          chrome.tabs.executeScript(tab.id, { code: script })
        }
      }
    })
  }

  // update status and store settings
  function update () {
    if (enabled) {
      const details = {
        path: {
          '19': 'icons/icon19.png',
          '38': 'icons/icon38.png'
        }
      }

      chrome.storage.sync.set({ enabled: true })
      chrome.browserAction.setIcon(details)
      executeScriptInAllTabs('if (typeof speenya !== "undefined") speenya.connect();')
    } else {
      const details = {
        path: {
          '19': 'icons/icon19_disabled.png',
          '38': 'icons/icon38_disabled.png'
        }
      }

      chrome.storage.sync.set({ enabled: false })
      chrome.browserAction.setIcon(details)
      executeScriptInAllTabs('if (typeof speenya !== "undefined") speenya.disconnect();')
    }
  }

  chrome.browserAction.onClicked.addListener(function (tab) {
    enabled = !enabled
    update()
  })

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'checkEnabled') {
      sendResponse({ enabled: enabled })
      return true
    }
  })
})()
