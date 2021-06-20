/* global chrome */

function extensionIcon(enabled: boolean): chrome.browserAction.TabIconDetails {
  const postfix = enabled ? '' : '_disabled';
  return {
    path: {
      '16': `icons/icon16${postfix}.png`,
      '24': `icons/icon24${postfix}.png`,
      '32': `icons/icon32${postfix}.png`,
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

chrome.contextMenus.create({
  title: 'Show webcam',
  contexts: ['browser_action'],
  onclick: () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      tabs.forEach((tab) => chrome.tabs.sendMessage(tab.id ?? 0, 'show_webcam'));
    });
  },
});
