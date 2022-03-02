start()

async function start () {
    try {
        global.config = require('./config')

        // 日志
        global.logger = require('./lib/logger')

        // 连接rabbitmq
        global.broker = await require('./lib/messageBroker').getInstance({
            vhost: 'bookStore',
            exchange: 'log_exchange',
            exType: 'topic',
            routeKey: '*.log'
        })

        await broker.receive()

        logger.log('logCenter start success...')
    } catch (err) {
        // 导致进程退出的错误
        logger.log('process exit err:' + err.message)
        process.exit(1)
    }
}
