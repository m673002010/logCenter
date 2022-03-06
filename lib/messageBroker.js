const amqp = require('amqplib')
const elasticService = require('../elasticService/elastic')

let instance

/**
 * Broker for async messaging
 */
class MessageBroker {
  constructor(options) {
    this.vhost = options.vhost || ''
    this.connection = null
    this.channel = null
    this.exchange = options.exchange || 'exchange'
    this.exType = options.exType || 'direct'
    this.durable = options.durable || true
    this.routeKey = options.routeKey || ''
    this.autoDelete = options.autoDelete || false
    this.queue = options.queue || ''
  }

  /**
   * Initialize connection to rabbitMQ
   */
  async init() {
    try {
      this.connection = await amqp.connect(`${config.mqUrl}/${this.vhost}`)
      this.channel = await this.connection.createChannel()

      return this
    } catch (err) {
      logger.log('rabbitmq init fail:' + err.message)
      throw err
    }
  }

  /**
   * @param {Function} handler Handler that will be invoked with given message
   */
  async receive(handler) {
    try {
      if (!this.connection) {
        await this.init()
      }
  
      const q = await this.channel.assertQueue(this.queue, {durable: true, autoDelete: false})
  
      await this.channel.bindQueue(q.queue, this.exchange, this.routeKey)
  
      this.channel.consume(
        this.queue,
        async (msg) => {
          const message = JSON.parse(msg.content.toString())

          await elasticService.send(message)
          
          this.channel.ack(msg)
        },
        { noAck: false }
      )
    } catch (err) {
      logger.log(err)
    }
  }
}

/**
 * @return {Promise<MessageBroker>}
 */
async function getInstance(options) {
  if (!instance) {
    const broker = new MessageBroker(options)
    instance = await broker.init()
  }

  return instance
}

module.exports = {
  getInstance
}
