/**
 * static Variables
 */
var firstSearch = "sorcerer's stone";

/**
 * static functions
 */
function searchMovie(name) {

    var omdbUrl="http://www.omdbapi.com/?t=" + name + "&apikey=8e4b0c73";

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
        $("#imdb-score").text(res.imdbRating);

    });

}

function searchBook(movieName) {

    var openLibraryUrl = "http://openlibrary.org/search.json?title=" + movieName;
    //Directions for search api https://openlibrary.org/dev/docs/api/search

    $.ajax({
        method: "GET",
        url: openLibraryUrl

    }).then(function (res) {

        //book title
        var bookTitle = res.docs[0].title;
        $("#book-title").text(bookTitle);

        // book cover
        var bookIsbn = res.docs[0].isbn[0];

        console.log(bookIsbn);

        var bookCoverURL = "http://covers.openlibrary.org/b/isbn/" + bookIsbn + "-M.jpg";

        $("#book-cover").attr("src", bookCoverURL);

        //book description
        var worksUrl= `https://openlibrary.org${res.docs[0].key}.json`;

        $.ajax({
            method: "GET",
            url: worksUrl
        }).then(function(res){
            $("#book-plot").text(res.description.value);
        });

        //books rating
        var goodReadsUrl=`https://www.googleapis.com/books/v1/volumes?q=isbn:${bookIsbn}&key=AIzaSyBtYq9z6CgPa4rmGWVSkwwSORdFIuFLc_4`;

        $.ajax({
            method: "GET",
            url: goodReadsUrl
        }).then(function(res){
            $("#book-rating").text("Google Books rating" + res.items[0].volumeInfo.averageRating*2+"/10");
        });
    });

}

/**
 * Event Listeners
 */
$(document).ready(function () {
    $("#search-button").on("click", function (event) {
        event.preventDefault();

        var movieName = $("#search-input").val();

        searchMovie(movieName);

        searchBook(movieName);

        localStorage.setItem("search",movieName);
    })

});


/**
 * main
 */
var firstSearchTemp = localStorage.getItem("search");

if(firstSearchTemp != null){
    firstSearch=firstSearchTemp;
}

searchMovie(firstSearch);

searchBook(firstSearch);
