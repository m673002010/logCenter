'use strict'

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://192.168.43.144:9200' })

async function send (message) {
  await client.index({
    index: 'log',
    type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
    body: message //{ character: 'Tyrion Lannister', quote: 'A mind needs books' }
  })

  // here we are forcing an index refresh, otherwise we will not get any result in the consequent search
  await client.indices.refresh({ index: 'log' })
}

async function search (match) {
  const { body } = await client.search({
    index: 'log',
    type: '_doc',
    body: {
      query: {
        match // { quote: 'coming' }
      }
    }
  })

  // console.log(body.hits.hits)
}

module.exports = {
  send,
  search
}
