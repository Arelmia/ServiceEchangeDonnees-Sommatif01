const { Pool } = require("pg");
const options = {
    ssl: {
        rejectUnauthorized: false
    }
};
const pool = new Pool(options);

const utils = require("./lib.utils");

async function connection() {
    return pool.connect();
}

async function endConnection(client) {
    client.release();
}

async function queryForAll(limit, offset, orderBy = utils.DEFAULT_ORDER_BY) {
    const client = await connection();

    return client.query(`SELECT * FROM movies ORDER BY ${orderBy} LIMIT $1 OFFSET $2`, [limit, offset])
        .finally(endConnection(client));
}

async function queryForCount() {
    const client = await connection();

    let data = await client.query("SELECT COUNT(1) as count FROM movies")
        .finally(endConnection(client));
    return data.rows[0].count;
}

async function queryWithId(id) {
    const client = await connection();

    return client.query('SELECT * FROM movies WHERE id = $1', [id])
        .finally(endConnection(client));
}

async function updateWithId(id, movieData) {
    const client = await connection();

    let query = 'UPDATE movies SET movie_title = $1, movie_genres = $2, release_date = $3, original_voice_acting = $4 WHERE id = $5'
    let data = await client.query(query,
        [movieData.movie_title, movieData.movie_genres, movieData.release_date, movieData.original_voice_acting, id])
        .finally(endConnection(client));

    return data.rowCount;
}

async function deleteWithId(id) {
    const client = await connection();

    let data = await client.query('DELETE FROM movies WHERE id = $1', [id])
        .finally(endConnection(client));

    return data.rowCount;
}

async function insert(movieData) {
    const client = await connection();

    let query = "INSERT INTO movies (movie_title, movie_genres, release_date, original_voice_acting) VALUES($1, $2, $3, $4)";
    let data = await client.query(query,
        [movieData.movie_title, movieData.movie_genres, movieData.release_date, movieData.original_voice_acting])
        .finally(endConnection(client));

    return data.rowCount;
}

module.exports = {
    queryForAll,
    queryWithId,
    queryForCount,
    updateWithId,
    deleteWithId,
    insert
}