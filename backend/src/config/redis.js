const { createClient } = require("redis");


const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-14852.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14852
    }
});

module.exports = redisClient;
