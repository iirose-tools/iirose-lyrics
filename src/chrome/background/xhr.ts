import { HTTP_HEADER_PREFIX } from '../shared/http';

function setRequestHeader(
  this: XMLHttpRequest,
  name: string,
  value: string
): void {
  XMLHttpRequest.prototype.setRequestHeader.apply(this, [
    `${HTTP_HEADER_PREFIX}${name}`,
    value
  ]);
}

function getResponseHeader(this: XMLHttpRequest, name: string): string | null {
  const headerName =
    name.toLowerCase() === 'set-cookie'
      ? `${HTTP_HEADER_PREFIX}set-cookie`
      : name;

  return XMLHttpRequest.prototype.getResponseHeader.apply(this, [headerName]);
}

function CustomXHR(): XMLHttpRequest {
  const xhr = new XMLHttpRequest();

  xhr.setRequestHeader = setRequestHeader;
  xhr.getResponseHeader = getResponseHeader;

  return xhr;
}

export const XHR = (CustomXHR as any) as typeof XMLHttpRequest;
