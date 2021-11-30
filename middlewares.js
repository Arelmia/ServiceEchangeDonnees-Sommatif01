let db = require('./database');

const utils = require("./lib.utils");

function isMime() {
    const args = Array.from(arguments);
    return (req, res, next) => {
        if (!req.is(...args)) {
            res.status(415).end();
        } else {
            next();
        }
    }
}

function acceptsMime() {
    const args = Array.from(arguments);
    return (req, res, next) => {
        if (!req.accepts(...args)) {
            res.status(406).end();
        } else {
            next();
        }
    }
}

const logger = (req, res, next) => {
    console.log(req.method + ' ' + req.path);
    next();
};

const cors = (req, res, next) => {
    res.header('access-control-allow-origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
};

const idParser = (req, res, next) => {
    req.id = Math.trunc(Number(req.params.id));
    if (isNaN(req.id)) {
        res.status(400).end();
    }
    else {
        next();
    }
}

const parsePage = async (req, res, next) => {
    let per_page = Number.parseInt(req.query.per_page ?? utils.DEFAULT_LIMIT_PER_PAGE);

    const page = Number.parseInt(req.query.page ?? utils.DEFAULT_PAGE);

    if(per_page < utils.MIN_PER_PAGE) per_page = utils.MIN_PER_PAGE;
    else if (per_page > utils.MAX_PER_PAGE) per_page = utils.MAX_PER_PAGE;

    // Si on ne peux pas convertir une des deux valeurs ou que l'une d'entre elle est invalide,
    // on retourne 400
    if (!utils.isInt(per_page) || !utils.isInt(page) || page <= 0 || per_page <= 0) {
        res.status(400).end();
        return;
    }

    let order_by = utils.DEFAULT_ORDER_BY;

    if (req.query.order_by) {
        // Si req.order_by est défini, on vérifie si il est l'un des champs valide et on l'affecte
        // si c'est le cas.
        Array.from(utils.MOVIE_SCHEMA._ids._byKey.keys()).forEach((key)=>{
            order_by = req.query.order_by.toLowerCase() === key ? key : order_by;
        });
    }

    let offset = ((page - 1) * per_page) - 1;
    console.log("Middleware ligne 74");
    const totalOfAllMovies = await db.queryForCount();

    // Si on veux obtenir des films qui ont un index plus élevé que le total, on renvoie 422.
    if (offset >= totalOfAllMovies) {
        res.status(422).end();
        return;
    }

    if (offset < 0) offset = 0;

    const page_count = Math.ceil(totalOfAllMovies / per_page);

    req.pageInfo = {
        per_page,
        page,
        order_by,
        page_count,
        totalOfAllMovies,
        offset
    };

    next();
}

const buildUrls = (req, res, next) => {
    let per_page    = req.pageInfo.per_page;
    let page        = req.pageInfo.page;
    let order_by    = req.pageInfo.order_by;
    let path        = req.path;
    let pdfPath     = `${req.path}.pdf`;

    let next_page   = utils.buildAnUrl(req, path, per_page, page + 1, order_by);
    let prev_page   = utils.buildAnUrl(req, path, per_page, page - 1, order_by);
    let cur_page    = utils.buildAnUrl(req, path, per_page, page, order_by);
    let pdf_page    = utils.buildAnUrl(req, pdfPath, per_page, page, order_by);
    let first_page  = utils.buildAnUrl(req, path, per_page, utils.DEFAULT_PAGE, order_by);

    req.urlInfo = {
        next_page,
        prev_page,
        cur_page,
        pdf_page,
        first_page
    }

    next();
};

const movieParser = async (req, res, next) => {
    let movie = await req.body;
    let result;
    try {
         result = await utils.MOVIE_SCHEMA.validateAsync(movie);
    }
    catch (e) {
        res.status(400).end();
        return;
    }
    req.movie = result;
    next();
}

module.exports = {
    isMime,
    acceptsMime,
    logger,
    cors,
    idParser,
    parsePage,
    buildUrls,
    movieParser
}