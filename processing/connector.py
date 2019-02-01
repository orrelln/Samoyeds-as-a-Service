import aiomysql
import asyncio


async def create_async_sql_connector(loop, config):
    sql = AsyncSqlConnector(loop, config)
    await sql.create_pool()
    return sql


class AsyncSqlConnector:
    def __init__(self, loop: asyncio.BaseEventLoop, _config: dict):
        config = {
            'host': '127.0.0.1',
            'port': 3306,
            'user': 'root',
            'password' : '',
            'db': 'mysql',
            'loop': loop
        }
        self.config = config.update(_config)
        self.loop = loop

    async def create_pool(self):
        self.pool = await aiomysql.create_pool(**self.config)

    async def write(self, query):
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query)
        self.pool.close()
        await self.pool.wait_closed()
