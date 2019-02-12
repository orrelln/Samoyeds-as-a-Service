const { Pool } = require('pg');
const pgPool = new Pool();

// Updates processing_status row
async function _updateStatus(result) {
    const client = await pgPool.connect();
    const query = {
        text: 'UPDATE processing_status SET status = $1 WHERE id = $2',
        values: [result.error ? 'rejected' : 'approved', result.id]
    };
    try {
        const res = await client.query(query);
    } catch(err) {
        console.log(err.stack);
    }
    finally {
        client.release();
    }
}

// Inserts results about image into image_data table
async function _insertRecord(result) {
    const client = await pgPool.connect();
    const query = {
        text: 'INSERT INTO image_data(id, path, breed1, percentage1, breed2, percentage2, ' +
        'breed3, percentage3, breed4, percentage4, breed5, percentage5) VALUES($1, $2, ' +
        '$3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        values: [result.id, result.path.split("api/i")[1], result.breed1, result.percentage1, result.breed2,
            result.percentage2, result.breed3, result.percentage3, result.breed4,
            result.percentage4, result.breed5, result.percentage5]
    };
    try {
        const res = await client.query(query);
    } catch(err) {
        console.log(err.stack);
    }
    finally {
        client.release();
    }
}

// Selects random paths from image_data table
async function _selectRandom(count = 1) {
    const client = await pgPool.connect();
    let paths = [];
    const query = {
        text: 'SELECT path FROM image_data ORDER BY random() LIMIT $1',
        values: [count]
    };
    try {
        const res = await client.query(query);
        res.rows.forEach((obj) => {
            paths.push(obj.path);
        });
        console.log(JSON.stringify(paths));
    } catch(err) {
        console.log(err.stack);
        paths = err.stack;
    }
    finally {
        client.release();
    }
    return paths;
}

module.exports = {
    pgPool,
    _updateStatus,
    _insertRecord,
    _selectRandom
};