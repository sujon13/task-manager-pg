export const getUrl = (path, paramMap) => {
    let url = path;
    if (paramMap) {
        url += '?' + Object.entries(paramMap).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    }
    return url;
}