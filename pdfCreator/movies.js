module.exports = function() {
    const dd = {
        pageOrientation: 'landscape',
        content: [
            {text: 'Movies (${numMovies})', style: 'header'},
            {
                style: 'tableMovies',
                table: {
                    headerRows: 1,
                    body: [
                        [
                            {text: '#', style: 'tableHeader'},
                            {text: 'Movie title', style: 'tableHeader'},
                            {text: 'Movie genres', style: 'tableHeader'},
                            {text: 'Release date', style: 'tableHeader'},
                        ]
                    ]
                }
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            tableMovies: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black',
                alignment: 'center'
            }
        },
        defaultStyle: {
        }
    };
    return dd;
};
