(function () {
  var enabled = false;

  chrome.storage.sync.get({enabled: true}, function (items) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
    }
    enabled = items.enabled;
    update();
  })

  function executeScript(script) {
    chrome.tabs.query({windowType: 'normal'}, function(tabs) {
      for (tab of tabs) {
        if (tab.url.indexOf("chrome://") != 0) {
          chrome.tabs.executeScript(tab.id, { code: script });
        }
      }
    });
  }

  function update() {
    if (enabled) {
      var details = {
        path: {
          '19': 'icons/icon19.png',
          '38': 'icons/icon38.png'
        }
      };

      chrome.storage.sync.set({enabled: true});
      chrome.browserAction.setIcon(details);
      executeScript('if (typeof speenya !== "undefined") speenya.connect();');
    } else {
      var details = {
        path: {
          '19': 'icons/icon19_disabled.png',
          '38': 'icons/icon38_disabled.png'
        }
      };

      chrome.storage.sync.set({enabled: false});
      chrome.browserAction.setIcon(details);
      executeScript('if (typeof speenya !== "undefined") speenya.disconnect();');
    }
  }

  chrome.browserAction.onClicked.addListener(function (tab) {
    enabled = !enabled;
    update();
  });

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'checkEnabled') {
      sendResponse({enabled: enabled});
      return true;
    }
  });
})();
