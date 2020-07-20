import { getLyric } from '../../core/get-lyric';
import { HTTP_HEADER_PREFIX } from '../shared/http';
import { XHR } from './xhr';
import RequestFilter = chrome.webRequest.RequestFilter;

const extensionBaseUrl = chrome.extension.getURL('').slice(0, -1);

chrome.runtime.onMessage.addListener(
  (shareMediaData, _sender, sendResponse) => {
    getLyric(XHR, shareMediaData).then(lyric => {
      if (lyric) {
        sendResponse(lyric);
      }
    });

    return true;
  }
);

const requestFilter: RequestFilter = {
  urls: ['*://music.163.com/*', '*://acs.m.xiami.com/*'],
  types: ['xmlhttprequest']
};

chrome.webRequest.onHeadersReceived.addListener(
  details => {
    if (details.responseHeaders) {
      const setCookieHeader = details.responseHeaders.find(
        header => header.name.toLowerCase() === 'set-cookie'
      );

      if (setCookieHeader) {
        return {
          responseHeaders: [
            ...details.responseHeaders,
            { ...setCookieHeader, name: `${HTTP_HEADER_PREFIX}set-cookie` }
          ]
        };
      }
    }

    return {};
  },
  requestFilter,
  ['blocking', 'responseHeaders', 'extraHeaders']
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    if (
      details.initiator?.startsWith(extensionBaseUrl) &&
      details.requestHeaders
    ) {
      const requestHeaders = [];
      for (const header of details.requestHeaders) {
        if (header.name.startsWith(HTTP_HEADER_PREFIX)) {
          requestHeaders.push({
            ...header,
            name: header.name.substr(HTTP_HEADER_PREFIX.length)
          });
        } else if (header.name.toLowerCase() === 'cookie') {
          requestHeaders.push(header);
        }
      }

      return { requestHeaders };
    } else {
      return {};
    }
  },
  requestFilter,
  ['blocking', 'requestHeaders', 'extraHeaders']
);
