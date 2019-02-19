const { Pool } = require('pg');
const pgFormat = require('pg-format');
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
        throw new Error(err)
    } 
    finally {
        client.release();
    }
}

// Inserts a new status
async function insertStatus(id, approxTime) {
    let now = new Date();
    now.setTime(now.getTime() + (approxTime * 1000));

    const client = await pgPool.connect();
    const query = {
        text: 'INSERT INTO processing_status(id, status, time_til_finish) VALUES($1, $2, $3)',
        values: [id, 'processing', now]
    };
    try {
        const res = await client.query(query)
    }
    catch(err) {
        console.log(err.stack);
        throw new Error(err)
    }
    finally {
        client.release()
    }
}

function create_query_array(result){
    let new_arr = [];
    result.predictions.forEach((prediction) => {
        new_arr.push([result.id, prediction[0], prediction[1]])
    });
    return new_arr;
}

// Inserts results about image into image_data table
async function insertRecord(result) {
    const client = await pgPool.connect();
    const images_query = {
        text: 'INSERT INTO images(id, ts) VALUES($1, $2)',
        values: [result.id, new Date()]
    };
    const predictions_query = pgFormat('INSERT INTO predictions (id, breed, percentage) VALUES %L',
        create_query_array(result));

    try {
        await client.query('BEGIN');
        await client.query(images_query);
        await client.query(predictions_query);
        await client.query('COMMIT');
    }
    catch(err) {
        await client.query('ROLLBACK');
        throw err
    }
    finally {
        client.release();
    }
}

// Selects random paths from image_data table
async function selectRandom(count = 1, safe_mode) {
    const client = await pgPool.connect();
    let ids = [];
    const query = {
        text: 'SELECT id\n' +
            'FROM images\n' +
            (safe_mode ? 'WHERE safe_mode is true\n' : '') +
            'ORDER by random()\n' +
            'LIMIT $1\n' +
            '\n',
        values: [count]
    };
    try {
        const res = await client.query(query);
        res.rows.forEach((obj) => {
            ids.push(obj.id);
        });
        return ids;
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
        text: 'SELECT id, breed, percentage ' +
            'FROM predictions ' +
            'WHERE id = $1 ' +
            'ORDER BY percentage DESC ' +
            'LIMIT 1',
        values: [id]
    };
    try {
        const res = await client.query(query);
        return res.rows[0];
    }
    catch(err) {
        console.log(err.stack);
        throw new Error(err.stack);
    }
    finally {
        client.release();
    }
}

// Selects image path by id from image_data table
async function selectIdProcessing(id) {
    const client = await pgPool.connect();
    const query = {
        text: 'SELECT id, status, time_til_finish FROM processing_status WHERE id = $1',
        values: [id]
    };
    try {
        const res = await client.query(query);
        return res.rows[0];
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
async function selectBreed(breed, count = 1, safe_mode) {
    const client = await pgPool.connect();
    let ids = [];
    const query = {
        text: 'SELECT images.id, breed\n' +
            'FROM images INNER JOIN predictions on images.id=predictions.id\n' +
            'WHERE '  + (safe_mode ? 'safe_mode is true and ' : '') + 'breed = $1\n' +
            'ORDER BY RANDOM()\n' +
            'LIMIT $2\n',
        values: [breed, count]
    };
    try {
        const res = await client.query(query);
        res.rows.forEach((obj) => {
            ids.push(obj.id);
        });
        return ids;
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
    selectIdProcessing,
    selectBreed
};