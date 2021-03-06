const { Pool } = require('pg');
const pgFormat = require('pg-format');
const pgPool = new Pool();


async function sqlQuery(query) {
    const client = await pgPool.connect();
    try {
        return await client.query(query);
    }
    catch (err) {
        console.log(err.stack);
        throw new Error(err);
    }
    finally {
        client.release();
    }
}

async function sqlTransaction(query_array) {
    const client = await pgPool.connect();
    try {
        await client.query('BEGIN');
        query_array.forEach(async (query) => {
            await client.query(query)
        });
        await client.query('COMMIT');
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.log(err.stack);
        throw new Error(err);
    }
    finally {
        client.release();
    }
}

// Inserts a new status
async function insertStatus(id, ip) {
    const query = {
        text: `INSERT INTO statuses(id, status, ts, ip) VALUES($1, $2, $3, $4)`,
        values: [id, 'processing', new Date(), ip]
    };

    await sqlQuery(query);
}

// Updates processing_status row
async function updateStatus(result) {
    const query = {
        text: `UPDATE statuses SET status = $1 WHERE id = $2`,
        values: [result.reject ? 'rejected' : 'approved', result.id]
    };

    await sqlQuery(query);
}

// Selects image path by id from image_data table
async function selectStatus(args) {
    const query = {
        text: `SELECT id, status, queue_number FROM statuses WHERE id = $1`,
        values: [args.id]
    };
    const res = await sqlQuery(query);
    return res.rows[0];
}

async function selectRecentStatus() {
    const query = {
        text:
            `SELECT queue_number 
             FROM statuses 
             WHERE status = 'approved' or status = 'rejected'
             ORDER BY queue_number 
             DESC LIMIT 1`
    };
    const res = await sqlQuery(query);
    return res.rows[0];
}

// Inserts results about image into image_data table
async function insertRecord(result) {
    const images_query = {
        text: `INSERT INTO images(id, ts) VALUES($1, $2)`,
        values: [result.id, new Date()]
    };

    let query_array = [];
    result.predictions.forEach((prediction) => {
        query_array.push([result.id, prediction[0], prediction[1]])
    });

    const predictions_query = pgFormat('INSERT INTO predictions (id, breed, percentage) VALUES %L', query_array);

    await sqlTransaction([images_query, predictions_query]);
}

// Selects random paths from image_data table
async function selectRandom(args) {
    const safeModeQuery = args.safe_mode ? 'safe_mode is true and' : '';
    let queryText =
        `SELECT i.id, breed, percentage FROM (
            SELECT images.id
            FROM images INNER JOIN predictions on images.id = predictions.id
            WHERE ${safeModeQuery} percentage > $1
            ORDER BY random()
            LIMIT $2
         )i
         INNER JOIN predictions ON i.id = predictions.id
         ORDER BY i.id, percentage DESC;`;

    const query = {
        text: queryText,
        values: [args.percentage, args.count]
    };

    const res = await sqlQuery(query);
    return res.rows;
}

// Selects image path by id from image_data table
async function selectId(args) {
    let queryText =
        `SELECT id, breed, percentage
         FROM predictions
         WHERE id = $1
         ORDER BY percentage DESC`;

    const query = {
        text: queryText,
        values: [args.id]
    };

    const res = await sqlQuery(query);
    return res.rows;
}

// Selects random image path by breed from image_data table
async function selectBreed(args) {
    const safeModeQuery = args.safe_mode ? 'safe_mode is true and' : '';
    let queryText =
        `SELECT i.id, breed, percentage FROM (
            SELECT images.id
            FROM images INNER JOIN predictions on images.id = predictions.id
            WHERE ${safeModeQuery} percentage > $1 and breed = $3
            ORDER BY random()
            LIMIT $2
         )i
         INNER JOIN predictions ON i.id = predictions.id
         ORDER BY i.id, percentage DESC;`;

    const query = {
        text: queryText,
        values: [args.percentage, args.count, args.breed]
    };

    const res = await sqlQuery(query);
    return res.rows;
}

async function selectRecent(args) {
    const safeModeQuery = args.safe_mode ? 'WHERE safe_mode is true' : '';
    let queryText =
        `SELECT i.id, breed, percentage FROM (
            SELECT images.id, ts
            FROM images
            ${safeModeQuery}
            ORDER BY ts DESC
            LIMIT $1 OFFSET $2
         )i
         INNER JOIN predictions ON i.id = predictions.id
         ORDER BY ts DESC, percentage DESC;`;

    const query = {
        text: queryText,
        values: [args.count, args.offset]
    };

    const res = await sqlQuery(query);
    return res.rows;
}

async function selectCategory(args) {
    const safeModeQuery = args.safe_mode ? 'and safe_mode is true' : '';
    let queryText =
        `SELECT p2.id, p2.breed, p2.percentage FROM (
            SELECT p1.id
            FROM predictions as p1 
            INNER JOIN categories ON p1.breed = categories.breed
            INNER JOIN images as i1 ON p1.id = i1.id
            WHERE categories.category = $1 and p1.percentage > $2 ${safeModeQuery}
            ORDER BY random()
            LIMIT $3
         )r
         INNER JOIN predictions as p2 ON r.id = p2.id
         ORDER BY r.id, percentage DESC;`;

    const query = {
        text: queryText,
        values: [args.category, args.percentage, args.count]
    };

    const res = await sqlQuery(query);
    return res.rows;
}

module.exports = {
    pgPool,
    updateStatus,
    insertStatus,
    insertRecord,
    selectRandom,
    selectId,
    selectStatus,
    selectBreed,
    selectRecentStatus,
    selectRecent,
    selectCategory
};