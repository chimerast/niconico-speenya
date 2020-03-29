/* global chrome */

function extensionIcon(enabled: boolean): chrome.browserAction.TabIconDetails {
  const postfix = enabled ? '' : '_disabled';
  return {
    path: {
      '19': `icons/icon19${postfix}.png`,
      '38': `icons/icon38${postfix}.png`,
    },
  };
}

chrome.storage.sync.get({ enabled: true }, (items) => {
  const enabled = items.enabled as boolean;
  chrome.browserAction.setIcon(extensionIcon(enabled));
});

chrome.browserAction.onClicked.addListener((_tab) => {
  chrome.storage.sync.get({ enabled: true }, (items) => {
    const toggled = !(items.enabled as boolean);
    chrome.storage.sync.set({ enabled: toggled });
    chrome.browserAction.setIcon(extensionIcon(toggled));
  });
});
