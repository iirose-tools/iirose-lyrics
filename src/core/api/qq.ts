import { qs } from '../utils/qs';

function decodeBase64(s: string): string {
  const text = s
    .replace(/[-_]/g, m0 => (m0 === '-' ? '+' : '/'))
    .replace(/[^A-Za-z0-9+\/]/g, '');

  const textDecoder = new TextDecoder();
  return textDecoder.decode(Uint8Array.from(atob(text), c => c.charCodeAt(0)));
}

export function getLyric(
  XHR: typeof XMLHttpRequest,
  songId: string
): Promise<any> {
  const xhr = new XHR();
  const query = qs({
    songmid: songId,
    pcachetime: new Date().getTime(),
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  });

  xhr.open(
    'GET',
    `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?${query}`
  );

  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('Referer', 'https://y.qq.com');
  xhr.withCredentials = true;

  xhr.send();

  return new Promise(resolve => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const response = xhr.responseText;
          const jsonText = response.replace(
            /callback\(|MusicJsonCallback\(|jsonCallback\(|\)$/g,
            ''
          );

          const json = JSON.parse(jsonText);
          const decoded = decodeBase64(json.lyric);

          resolve(decoded);
        } else {
          resolve(null);
        }
      }
    };
  });
}
