export function qs(
  obj: Record<string, number | string | Array<number | string>>
): string {
  return Object.entries(obj || {})
    .reduce<string[]>((res, [key, value]) => {
      const values = Array.isArray(value) ? value : [value];
      return [
        ...res,
        ...values.map(
          v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
        )
      ];
    }, [])
    .join('&');
}
