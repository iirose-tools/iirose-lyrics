import md5 from 'blueimp-md5';
import { qs } from '../utils/qs';

const APP_KEY = 12574478;

let cachedToken: string | null = null;

function setHeaders(xhr: XMLHttpRequest): void {
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Accept-Language', 'zh-CN');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) XIAMI-MUSIC/3.1.1 Chrome/56.0.2924.87 Electron/1.6.11 Safari/537.36'
  );
}

function getToken(XHR: typeof XMLHttpRequest): Promise<string> {
  if (cachedToken) {
    return Promise.resolve(cachedToken);
  } else {
    const xhr = new XHR();
    xhr.open(
      'GET',
      'https://acs.m.xiami.com/h5/mtop.alimusic.music.lyricservice.getsonglyrics/1.0/'
    );

    setHeaders(xhr);
    xhr.send();

    return new Promise(resolve => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const cookie = xhr.getResponseHeader('set-cookie');
          const token = /_m_h5_tk=([^_]+)/.exec(cookie!)![1];

          cachedToken = token;
          resolve(token);
        }
      };
    });
  }
}

async function getQuery(XHR: typeof XMLHttpRequest, model: any): Promise<any> {
  const time = new Date().getTime();
  const query = JSON.stringify({
    requestStr: JSON.stringify({
      header: {
        platformId: 'mac'
      },
      model
    })
  });

  const token = await getToken(XHR);
  const sign = md5(`${token}&${time}&${APP_KEY}&${query}`);
  const data = {
    api: 'mtop.alimusic.music.lyricservice.getsonglyrics',
    appKey: APP_KEY,
    dataType: 'json',
    data: query,
    t: time,
    sign,
    v: '1.0',
    type: 'originaljson'
  };

  return qs(data);
}

export async function getLyric(
  XHR: typeof XMLHttpRequest,
  songId: string
): Promise<string | null> {
  const xhr = new XHR();
  const query = await getQuery(XHR, { songId });

  xhr.open(
    'GET',
    `https://acs.m.xiami.com/h5/mtop.alimusic.music.lyricservice.getsonglyrics/1.0/?${query}`
  );

  setHeaders(xhr);
  xhr.send();

  return new Promise(resolve => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const lyrics = response?.data?.data?.lyrics;

          if (Array.isArray(lyrics)) {
            for (const lyric of lyrics) {
              if (lyric?.type === 2) {
                resolve(lyrics ? lyric?.content : null);
              }
            }
          }

          resolve(null);
        } else {
          resolve(null);
        }
      }
    };
  });
}
