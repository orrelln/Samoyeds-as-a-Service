const { Pool } = require('pg');
const pgPool = new Pool();

// Updates processing_status row
async function updateStatus(result) {
    const client = await pgPool.connect();
    const query = {
        text: 'UPDATE processing_status SET status = $1 WHERE id = $2',
        values: [result.reject ? 'rejected' : 'approved', result.id]
    };
    try {
        const res = await client.query(query);
    }
    catch(err) {
        console.log(err.stack);
    } 
    finally {
        client.release();
    }
}

// Inserts a new status
async function insertStatus(id) {
    let now = new Date();
    now.setTime(now.getTime() + (7 * 24 * 60 * 60 * 1000));

    const client = await pgPool.connect();
    const query = {
        text: 'INSERT INTO processing_status(id, status, time_til_finish) VALUES($1, $2, $3)',
        values: [id, 'processing', now]
    };
    try {
        const res = await client.query(query)
    }
    catch(err) {
        console.log(err.stack)
    }
    finally {
        client.release()
    }
}

// Inserts results about image into image_data table
async function insertRecord(result) {
    const client = await pgPool.connect();
    const query = {
        text: 'INSERT INTO image_data(id, path, breed1, percentage1, breed2, percentage2, ' +
        'breed3, percentage3, breed4, percentage4, breed5, percentage5) VALUES($1, $2, ' +
        '$3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        values: [result.id, result.path, result.breed1, result.percentage1, result.breed2,
            result.percentage2, result.breed3, result.percentage3, result.breed4,
            result.percentage4, result.breed5, result.percentage5]
    };
    try {
        const res = await client.query(query);
    }
    catch(err) {
        console.log(err.stack);
    }
    finally {
        client.release();
    }
}

// Selects random paths from image_data table
async function selectRandom(count = 1) {
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
        return paths;
    }
    catch(err) {
        console.log(err.stack);
        throw new Error(err)
    }
    finally {
        client.release();
    }
}

// Selects image path by id from image_data table
async function selectId(id) {
    const client = await pgPool.connect();
    const query = {
        text: 'SELECT path FROM image_data WHERE id = $1',
        values: [id]
    };
    try {
        const res = await client.query(query);
        console.log(JSON.stringify(res));
        return res.rows[0].path;
    }
    catch(err) {
        console.log(err.stack);
        throw new Error(err.stack);
    }
    finally {
        client.release();
    }
}

// Selects random image path by breed from image_data table
async function selectBreed(breed) {
    const client = await pgPool.connect();
    const query = {
        text: `SELECT path FROM image_data WHERE breed1 = '$1' ORDER BY random() LIMIT 1`,
        values: [breed]
    };
    try {
        const res = await client.query(query);
        console.log(JSON.stringify(res));
        return res.rows[0].path;
    }
    catch(err) {
        console.log(err.stack);
        throw new Error(err.stack);
    }
    finally {
        client.release();
    }
}

module.exports = {
    pgPool,
    updateStatus,
    insertStatus,
    insertRecord,
    selectRandom,
    selectId,
    selectBreed
};