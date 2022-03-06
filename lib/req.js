const rp = require('request-promise')

async function get ({ url, params = {}, headers = {} }) {
    const options = {
        uri: url,
        qs: params,
        headers,
        json: true
    }
     
    return rp(options)
}

async function post ({ url, params = {}, headers = {} }) {
    const options = {
        method: 'POST',
        uri: url,
        body: params,
        headers,
        json: true
    }
     
    return rp(options)
}

async function put ({ url, params = {}, headers = {} }) {
}

async function del ({ url, params = {}, headers = {} }) {
}

module.exports = {
    get,
    post,
    put,
    del
}
