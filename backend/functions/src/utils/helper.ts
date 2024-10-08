export function sortBy(key: any, array: any) {
  return array.slice().sort((a: any, b: any) => {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  });
}

export function extractNumber(input: string) {
  const match = input.match(/(\d+)%/); // Find digits before the '%' sign
  return match ? Number(match[1]) : null; // Convert the matched digits to a number
}

export function ensureHttps(url: string) {
  if (!/^https?:\/\//i.test(url)) {
    // If not, prepend 'https://'
    url = `https://${url}`;
  }
  return url;
}