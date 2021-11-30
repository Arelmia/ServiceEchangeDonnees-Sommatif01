const MIME_JSON = 'application/json';
const MIME_PDF  = 'application/pdf';
const MIME_URL_ENCODED = 'application/x-www-form-urlencoded';

const joi = require("joi");

// region Default Values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT_PER_PAGE = 50;
const DEFAULT_ORDER_BY = 'id';
const PDF_NAME = 'List of movies';
//endregion

const MIN_PER_PAGE = 10;
const MAX_PER_PAGE = 100;

const MOVIE_SCHEMA = joi.object({
    movie_title : joi.string().required(),
    movie_genres : joi.string().required(),
    release_date : joi.string().required(),
    original_voice_acting : joi.string().optional()
});


function isInt(n) {
    // noinspection EqualityComparisonWithCoercionJS
    return Number.parseInt(n) == n;
}

function buildAnUrl(req, path, per_page = DEFAULT_LIMIT_PER_PAGE, page = DEFAULT_PAGE, order_by = DEFAULT_ORDER_BY) {
    let base_url = `${req.protocol}://${req.get('host')}${path}`
    return `${base_url}?per_page=${per_page}&page=${page}&order_by=${order_by}`
}

module.exports = {
    isInt,
    buildAnUrl,
    MIME_JSON,
    MIME_PDF,
    MIME_URL_ENCODED,
    DEFAULT_PAGE,
    DEFAULT_LIMIT_PER_PAGE,
    MIN_PER_PAGE,
    MAX_PER_PAGE,
    DEFAULT_ORDER_BY,
    PDF_NAME,
    MOVIE_SCHEMA
};