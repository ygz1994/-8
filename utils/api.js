export const queryString = params =>
    '?' + Object.keys(params).map(i => `${i}=${encodeURIComponent(params[i])}`).join('&');

export const get = (url, queryData) =>
    new Promise((success, fail) => wx.request({
        url, data: queryData, success, fail
    }));

export const post = (url, body = {}, queryData) => 
    new Promise((success, fail) => wx.request({
        method: 'POST',
        url: url + (queryData ? queryString(queryData) : ''),
        data: body, success, fail
    }));