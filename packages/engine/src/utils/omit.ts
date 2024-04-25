export function omit(obj: any, keys: Set<string>) {
  return Object.keys(obj).reduce((o, k) => {
    if (!keys.has(k)) o[k] = obj[k];
    return o;
  }, {} as { [key: string]: any });
}
