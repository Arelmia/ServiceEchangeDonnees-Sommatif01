const getUserDocument = require("./movies");
const Pdfmake = require("pdfmake");
const path = require("path");

const fontDescriptors = {
    Roboto: {
        normal: path.join(__dirname, 'fonts','Roboto-Regular.ttf'),
        bold: path.join(__dirname,'fonts/Roboto-Medium.ttf'),
        italics: path.join(__dirname,'fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname,'fonts/Roboto-MediumItalic.ttf')
    }
};

module.exports = (movies, stream)=>{
    const printer = new Pdfmake(fontDescriptors);

    const dd = getUserDocument();

    dd.content[0].text = dd.content[0].text
        .replace('${numMovies}', movies.length);

    let content = movies.map(movie => [
        movie.id,
        movie.movie_title,
        movie.movie_genres,
        movie.release_date
    ]);

    dd.content[1].table.body = dd.content[1].table.body.concat(content);
    const pdfDoc = printer.createPdfKitDocument(dd);
    pdfDoc.pipe(stream);
    pdfDoc.end();
};