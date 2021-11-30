// region Default Values
const minPerPage = 10;
const maxPerPage = 100;
const defaultPerPage = 50;
const startingURL = "http://localhost:3000/movies";
// endregion

// region Containers
const movieContainer = document.getElementById("moviesContainer");
const detailsContainer = document.getElementById("detailsContainer");
// endregion

let currentPage;

let select = document.getElementById('selectNumberParPages');

async function fetchPage(page_url) {
    let response = await fetch(page_url);
    let data = await response.json();
    return data[0];
}

async function fetchMovie(movie_url) {
    let response  = await fetch(movie_url);

    return response.json();
}

async function updatePage(page_url, selectedMovie) {
    let page = await fetchPage(page_url);

    currentPage = page.cur_page;
    document.getElementById("labelSelectPages").innerText = `${page.page}/${page.page_count}`;

    updateNavigationButtons(page);
    updatePdfDownloadLink(page);

    updateMovieList(page.movies, selectedMovie);
}

function updateMovieList(movies, selectedMovie) {
    movieContainer.innerHTML = "";

    movies.forEach(movie => {
        let row = generateMovieRow(movie);
        if (selectedMovie && parseInt(selectedMovie.id.split("-")[1]) === movie.id) {
            row.classList.add("selectedMovie");
        }
        movieContainer.appendChild(row);
    });
}

function updatePdfDownloadLink(page) {
    let linkElement = document.getElementById("pdfDownloadLink");
    linkElement.href = page.pdf_page
}

async function updateDetailsView(movie_url) {
    let movie = await fetchMovie(movie_url);
    let deleteButton = document.getElementById("deleteButton");

    detailsContainer.action = movie_url;

    let movie_title = document.getElementById("movie_title");
    let movie_genres = document.getElementById("movie_genres");
    let release_date = document.getElementById("release_date");
    let original_voice_acting = document.getElementById("original_voice_acting");

    document.getElementById("submit").value = "Sauvegarder";
    deleteButton.classList.remove("hiddenButton");
    deleteButton.onclick =()=> deleteMovie(movie_url);

    movie_title.value = movie.movie_title;
    movie_genres.value = movie.movie_genres;
    release_date.value = new Date(movie.release_date.replaceAll("/", "-")).toISOString().substring(0,10);
    original_voice_acting.value = movie.original_voice_acting;
}

function updateNavigationButtons(page_data) {
    let firstPageNav = document.getElementById("firstPageNav");
    let prevPageNav = document.getElementById("prevPageNav");
    let nextPageNav = document.getElementById("nextPageNav");
    let lastPageNav = document.getElementById("lastPageNav");

    firstPageNav.onclick = () => navigationButtonAction(page_data.first_page);
    prevPageNav.onclick = () => navigationButtonAction(page_data.prev_page);
    nextPageNav.onclick = () => navigationButtonAction(page_data.next_page);
    lastPageNav.onclick = () => navigationButtonAction(page_data.last_page);
}

function generateMovieRow(movie) {
    let row = document.createElement("tr");
    let movie_id = document.createElement("td");
    let movie_title = document.createElement("td");
    let movie_genre = document.createElement("td");

    movie_id.innerText = movie.id;
    movie_title.innerText = movie.movie_title;
    movie_genre.innerText = movie.movie_genres;

    row.appendChild(movie_id);
    row.appendChild(movie_title);
    row.appendChild(movie_genre);

    row.onclick = () => {
        updateDetailsView(movie.details);
        for (let i = 0; i < movieContainer.children.length; i++) {
            movieContainer.children[i].classList.remove("selectedMovie");
        }
        row.classList.add("selectedMovie");
    }

    row.classList.add("movieRow");

    row.id = "movie-" + movie.id;

    return row;
}

async function deleteMovie(movie_url) {
    fetch(movie_url, {
        method: 'DELETE',
    })
        .then(response => {
            if(response.ok) {
                clearDetailsView();
                updatePage(currentPage);
            }
        })
}

function clearDetailsView() {
    detailsContainer.action = startingURL;
    document.getElementById("submit").value = "Ajouter";
    document.getElementById("deleteButton").classList.add("hiddenButton");
}

function navigationButtonAction(nav_url) {
    if (nav_url !== undefined) {
        updatePage(nav_url);
    }
}

async function selectOnClick() {
    console.log(select.value);
    await updatePage(`${startingURL}?per_page=${select.value}`);
}

async function onSubmitMovie() {
    let selectedMovie = document.getElementsByClassName("selectedMovie")[0];

    await updatePage(currentPage, selectedMovie);
}

function initializePerPagePicker() {
    for(let i = minPerPage; i <= maxPerPage; i++) {
        select.options[select.options.length] = new Option(i, i);
    }
    select.value = defaultPerPage;
}

initializePerPagePicker();
updatePage(`${startingURL}?per_page=${defaultPerPage}`);