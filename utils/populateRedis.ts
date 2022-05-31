import redisInstance from '../src/modules/RedisClient/redisClientImpl'

const populateRedis = async () => {
  await redisInstance.connect()
  await new Promise<void>((resolve)  => (redisInstance as any).connection.flushall(() => resolve()));
  await Promise
    .all((new Array(50).fill(1)
      .map(((value, index) => {
        console.log(value, " , ", index)
          return new Promise<void>(resolve =>
            (redisInstance as any)
              .connection
              .set(`key_${index}`, `value_${value}`, () => resolve()));
        })
      )))
}

populateRedis()
  .then(() =>  process.exit(0))
  .catch((error) => {
  console.error('Unable to populate redis', error);
  (redisInstance as any).connection
    .quit(() => 
      process.exit(1)
    )
})

