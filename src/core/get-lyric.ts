import * as NetEase from './api/netease';
import * as QQ from './api/qq';
import * as Xiami from './api/xiami';

export function getLyric(
  XHR: typeof XMLHttpRequest,
  shareMediaData: string
): Promise<string | null> {
  const songData = shareMediaData.split('>');
  const urlData = songData[0].split(' ');

  if (urlData[1]) {
    const url = new URL(`http${urlData[1]}`);
    if (url.hostname === 'music.163.com') {
      const normalizedUrl = url.search
        ? url
        : new URL(
            `${url.protocol}//${url.hostname}${url.pathname}${url.hash.substr(
              1
            )}`
          );

      const songId = normalizedUrl.searchParams.get('id');
      if (songId) {
        return NetEase.getLyric(XHR, songId);
      }
    } else if (url.hostname === 'y.qq.com') {
      const pathSegments = url.pathname.split('/');
      const songId = pathSegments[pathSegments.length - 1].replace(/\..+$/, '');

      return QQ.getLyric(XHR, songId);
    } else if (url.hostname === 'www.xiami.com') {
      const pathSegments = url.pathname.split('/');
      const songId = pathSegments[pathSegments.length - 1];

      return Xiami.getLyric(XHR, songId);
    }
  }

  return Promise.resolve(null);
}
