start()

async function start () {
    try {
        global.config = require('./config')

        // 日志
        global.logger = require('./lib/logger')

        // 请求组件
        global.rq = require('./lib/req')

        // 连接rabbitmq
        global.broker = await require('./lib/messageBroker').getInstance({
            vhost: 'bookStore',
            exchange: 'log_exchange',
            queue: 'requestLog',
            exType: 'topic',
            routeKey: '*.log'
        })

        await broker.receive()

        // 连接elasticsearch
        // global.elasticClient = await require('./elasticService/elastic').connectElastic()

        logger.log('logCenter start success...')
    } catch (err) {
        // 导致进程退出的错误
        logger.log('process exit err:' + err.message, 'error')
        process.exit(1)
    }
}
