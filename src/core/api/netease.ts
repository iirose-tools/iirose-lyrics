import aesjs from 'aes-js';
import { qs } from '../utils/qs';

const KEY = 'rFgB&h#%2?^eDg:Q';

function encrypt(object: any): string {
  const text = JSON.stringify(object);

  const keyBytes = aesjs.utils.utf8.toBytes(KEY);
  const textBytes = aesjs.padding.pkcs7.pad(aesjs.utils.utf8.toBytes(text));

  const aesEcb = new aesjs.ModeOfOperation.ecb(keyBytes);
  const encryptedBytes = aesEcb.encrypt(textBytes);

  return aesjs.utils.hex.fromBytes(encryptedBytes).toUpperCase();
}

export function getLyric(
  XHR: typeof XMLHttpRequest,
  songId: string
): Promise<string | null> {
  const method = 'POST';
  const url = 'https://music.163.com/api/song/lyric';
  const params = { id: songId, lv: -1, kv: -1, tv: -1 };
  const encrypted = encrypt({ method, url, params });

  const xhr = new XHR();

  xhr.open('POST', 'https://music.163.com/api/linux/forward');
  xhr.withCredentials = true;

  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,Content-Type'
  );
  xhr.setRequestHeader(
    'Access-Control-Allow-Methods',
    'PUT,POST,GET,DELETE,OPTIONS'
  );
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Referer', 'https://music.163.com');
  xhr.setRequestHeader(
    'User-Agent',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
  );

  xhr.send(qs({ eparams: encrypted }));

  return new Promise(resolve => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const lyric = response?.lrc?.lyric;

          resolve(typeof lyric === 'string' ? lyric : null);
        } else {
          resolve(null);
        }
      }
    };
  });
}
