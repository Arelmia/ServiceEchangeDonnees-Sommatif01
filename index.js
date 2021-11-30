const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const db = require('./database');
const middlewares = require("./middlewares");
const utils = require("./lib.utils");
const createPdf = require('./pdfCreator/create-pdf');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(middlewares.logger);
app.use(middlewares.cors);

app.get('/movies.pdf', middlewares.acceptsMime(utils.MIME_PDF), middlewares.parsePage, async (req, res) => {
    const {
        per_page,
        order_by,
        offset
    } = req.pageInfo;

    let rawMovies = (await db.queryForAll(offset === 0 ? per_page - 1 : per_page, offset, order_by)).rows;

    res.setHeader('Content-Type', utils.MIME_PDF);

    // Header content-disposition is to download the PDF
    res.setHeader('Content-Disposition', `attachment; filename=${utils.PDF_NAME}.pdf`);
    createPdf(rawMovies,res);
});

app.get('/movies', middlewares.acceptsMime(utils.MIME_JSON), middlewares.parsePage, middlewares.buildUrls, async (req, res) => {
    console.log("Ligne 35");
    const {
        per_page,
        page,
        order_by,
        offset,
        page_count,
        totalOfAllMovies
    } = req.pageInfo;
    console.log("Ligne 44");
    let {
        next_page,
        prev_page,
        cur_page,
        pdf_page,
        first_page
    } = req.urlInfo;
    console.log("Ligne 52");
    let queryResult     = await db.queryForAll(per_page, offset, order_by);
    console.log("Ligne 54");
    let rawMovies       = queryResult.rows;
    console.log("Ligne 56");
    let movies = rawMovies.map(elem => (
        {
            id:             elem.id,
            movie_title:    elem.movie_title,
            movie_genres:   elem.movie_genres,
            details:        `${req.protocol}://${req.get('host')}/movies/${elem.id}`
        }));
    console.log("Ligne 64");
    prev_page = page - 1 < utils.DEFAULT_PAGE ? undefined : prev_page;
    next_page = page + 1 > page_count ? undefined : next_page;
    console.log("Ligne 67");
    let last_page = utils.buildAnUrl(req, req.path, per_page, page_count, order_by);
    console.log("Ligne 69");
    let answer = [{
        page,
        per_page,
        order_by,
        next_page,
        prev_page,
        cur_page,
        pdf_page,
        first_page,
        last_page,
        totalOfAllMovies,
        page_count,
        movies
    }];
    console.log("Ligne 84");
    res.json(answer);
});

app.get('/movies/:id', middlewares.acceptsMime(utils.MIME_JSON), middlewares.idParser, async (req, res) => {
    let queryResult = await db.queryWithId(req.id);

    if (queryResult.rowCount === 0) {
        res.status(404).end();
    }
    else {
        res.json(queryResult.rows[0]);
    }
});

app.post('/movies/:id', middlewares.isMime(utils.MIME_JSON, utils.MIME_URL_ENCODED), middlewares.idParser, middlewares.movieParser, async (req, res) => {
    let affectedCount = await db.updateWithId(req.id, req.movie);

    if (affectedCount === 0) {
        res.status(404).end();
    }
    else {
        res.status(204).end();
    }
});

app.post('/movies', middlewares.isMime(utils.MIME_JSON, utils.MIME_URL_ENCODED) , middlewares.movieParser, async (req, res) => {
    let affectedCount = await db.insert(req.movie);

    if (affectedCount === 0) {
        res.status(400).end();
    }
    else {
        res.status(204).end();
    }
});

app.delete('/movies/:id', middlewares.idParser, async (req, res) => {
    let affectedCount = await db.deleteWithId(req.id);

    if (affectedCount === 0) {
        res.status(404).end();
    }
    else {
        res.status(204).end();
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});



