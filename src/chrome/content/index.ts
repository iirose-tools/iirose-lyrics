import { LyricView } from '../../core/view';
import { SHARE_MEDIA_EVENT } from '../shared/event';

const injected = document.createElement('script');
injected.src = chrome.runtime.getURL('injected.js');
document.body.appendChild(injected);

const view = new LyricView();

window.addEventListener(
  SHARE_MEDIA_EVENT,
  ev => {
    const shareMediaData = (ev as CustomEvent<string>).detail;
    chrome.runtime.sendMessage(shareMediaData, lyric => {
      view.loadLyric(lyric);
    });
  },
  false
);

view.init();
