/**
 * static Variables
 */
var firstSearch = "twilight";
var bookRating = null;
var movieRating = null;

var bookResults = [];
var movieResults = [];

/**
 * static functions
 */

function displayBooksList() {
    var bookResultsDiv = $("#book-results");

    if (bookResults.length === 0) {
        console.log("No books found in search");
    } else {
        bookResultsDiv.empty();

        var bookheader = $("<h2 class=`result-title` >Book Results</h2>");

        bookResultsDiv.append(bookheader);

        for (var i = 0; i < bookResults.length; i++) {

            var bookButton = $(`<button>`);
            bookButton.attr("class", "results");
            bookButton.attr("id", `book-${i}`);
            bookButton.text(bookResults[i].title + " (" + bookResults[i].first_publish_year + ")");

            bookResultsDiv.append(bookButton);

        }
    }
}

function displayBookData(bookIndex) {

    //book title
    var bookTitle = bookResults[bookIndex].title;
    $("#book-title").text(bookTitle);

    // book cover
    var bookIsbn = bookResults[bookIndex].isbn[0];

    var bookCoverURL = "https://covers.openlibrary.org/b/isbn/" + bookIsbn + "-M.jpg";

    $("#book-cover").attr("src", bookCoverURL);

    //book description
    var worksUrl = `https://openlibrary.org${bookResults[bookIndex].key}.json`;

    $.ajax({
        method: "GET",
        url: worksUrl,
    }).then(function (res) {

        console.log(res);

        if (res.description.value === undefined) {
            $("#book-plot").text("No Description Available");
        }
        
        var description = res.description.value;
        description = description.substring(0, 200);
        description += "...";
        
        $("#book-plot").text(description);
    });

    //books rating
    var googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${bookIsbn}&key=AIzaSyBtYq9z6CgPa4rmGWVSkwwSORdFIuFLc_4`;

    $.ajax({
        method: "GET",
        url: googleBooksUrl
    }).then(function (res) {

        bookRating=res.items[0].volumeInfo.averageRating;

        if (bookRating === undefined) {
            bookRating=null;
            $("#google-books-score").text("-");
        } else {
            bookRating= res.items[0].volumeInfo.averageRating * 2;
            $("#google-books-score").text(res.items[0].volumeInfo.averageRating * 2);
        }

        displaySuggestion(bookRating, movieRating);

    });
}

function displayMovieList() {
    var movieResultsDiv = $("#movie-results");

    if (movieResults.length === 0) {
        console.log("No movies found in search");
    } else {
        movieResultsDiv.empty();

        var movieHeader = $("<h2 class=`result-title`>Movie Results</h2>");

        movieResultsDiv.append(movieHeader);

        for (var i = 0; i < movieResults.length; i++) {

            var movieButton = $(`<button>`);
            movieButton.attr("class", "results");
            movieButton.attr("id", `movie-${i}`);
            movieButton.text(movieResults[i].Title + " (" + movieResults[i].Year + ")");

            movieResultsDiv.append(movieButton);

        }
    }

}

function searchMovie(name , year) {

    console.log(year);

    if(name.length=0){
        console.log("No title was input");
        return;
    }

    movieResults=[];

    var omdbUrl = "https://www.omdbapi.com/?s=" + name + "&type=movie&apikey=8e4b0c73";

    if(year != "" && year.length >4){
        omdbUrl += "&y="+year;
    }

    $.ajax({
        method: "GET",
        url: omdbUrl,
        error: function (){
            console.log("No Movies Found");
        }

    }).then(function (res) {
        console.log(res);

        for (var i = 0; i < 5 && i < res.Search.length; i++) {
            movieResults.push(res.Search[i]);
        }

        displayMovieList();

        displayMovieData(movieResults[0].imdbID);

    });

}

// added a 2nd API call to get more specific and desired information about our movie search

function displayMovieData(id) {
    console.log(id);
    omdbUrl = "https://www.omdbapi.com/?i=" + id + "&apikey=8e4b0c73&type=movie";
    $.ajax({
        method: "GET",
        url: omdbUrl

    }).then(function (res) {
        // movie title
        var movieTitle = res.Title;
        $("#movie-title").text(movieTitle);

        // movie poster
        var imgURL = res.Poster;
        var moviePoster = $("#movie-poster").attr("src", imgURL);

        //movie plot
        var moviePlot = res.Plot;
        $("#movie-plot").text(moviePlot);

        //movie rating
        movieRating = res.imdbRating;
        $("#imdb-score").text(movieRating);

        displaySuggestion(bookRating, movieRating);

    });

}

function searchBook(name, authorName) {

    var openLibraryUrl = "https://openlibrary.org/search.json?";
    var titleMod = name ? "title=" + name : "";
    // ternary operator -     condition ? true branch : false branch
    var authorMod = authorName ? "author=" + authorName : "";
    openLibraryUrl += titleMod;
    openLibraryUrl += authorMod;


    //Directions for search api https://openlibrary.org/dev/docs/api/search

    if (openLibraryUrl === "https://openlibrary.org/search.json?") {
        console.log("error - no parameters");
    } else {

        $.ajax({
            method: "GET",
            url: openLibraryUrl

        }).then(function (res) {

            bookResults = [];

            //Temporary location for search results
            for (var i = 0; i < 5 && i < res.docs.length; i++) {
                bookResults.push(res.docs[i]);
            }

            displayBooksList();
            displayBookData(0);
        });

    }

}

function displaySuggestion(bookRating, movieRating) {

    if (Number(bookRating) > Number(movieRating)) {
        $("#suggestion").text("The book is better than the movie, you should read!")
    } else if (bookRating === null) {
        $("#suggestion").text("There is no book rating available for us to compare.")
    } else if (movieRating === null) {
        $("#suggestion").text("There is no movie rating available for us to compare.")
    } else {
        $("#suggestion").text("The movie is better than the book, you should watch!")
    }

}

/**
 * Event Listeners
 */
$(document).ready(function () {
    $("#book-search-button").on("click", function (event) {
        event.preventDefault();

        var bookTitle = $("#title-input").val();
        var bookAuthor = $("#author-input").val();

        searchBook(bookTitle, bookAuthor);
        searchMovie(bookTitle, "");

        localStorage.setItem("search", bookTitle);
    })

    $("#book-results").on("click", function (event) {
        event.preventDefault();

        var type = event.target.id.split("-")[0];
        var index = event.target.id.split("-")[1];

        if (type === "book") {

            displayBookData(index);

        }

    })

    $("#movie-results").on("click", function (event) {
        event.preventDefault();

        var type = event.target.id.split("-")[0];
        var index = event.target.id.split("-")[1];

        if (type === "movie") {

            displayMovieData(movieResults[index].imdbID);

        }

    })

    $("#movie-search-button").on("click", function (event) {
        event.preventDefault();

        var movieTitle = $("#movie-input").val();
        searchMovie(movieTitle,"");
        searchBook(movieTitle,"");

    })

});

/**
 * main
 */
var firstSearchTemp = localStorage.getItem("search");

if (firstSearchTemp != null) {
    firstSearch = firstSearchTemp;
}

searchBook(firstSearch, "");
searchMovie(firstSearch,"");