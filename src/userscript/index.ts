import gmxhr from 'gmxhr';
import { getLyric } from '../core/get-lyric';
import { wrapFunction } from '../core/utils/wrap-function';
import { LyricView } from '../core/view';

const view = new LyricView();

shareMedia = wrapFunction(shareMedia, async e => {
  const lyric = await getLyric(gmxhr, e);
  if (lyric) {
    view.loadLyric(lyric);
  }
});

view.init();
