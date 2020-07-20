import { wrapFunction } from '../../core/utils/wrap-function';
import { SHARE_MEDIA_EVENT } from '../shared/event';

if ('shareMedia' in window) {
  shareMedia = wrapFunction(shareMedia, shareMediaData => {
    window.dispatchEvent(
      new CustomEvent(SHARE_MEDIA_EVENT, { detail: shareMediaData })
    );
  });
}
