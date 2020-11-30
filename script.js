/**
 * static Variables
 */
var firstSearch = "sorcerer's stone";

/**
 * static functions
 */
function searchMovie(name) {

    var omdbUrl = "http://www.omdbapi.com/?t=" + name + "&apikey=8e4b0c73";

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
        var movieRating = res.imdbRating;
        $("#imdb-score").text(movieRating);

    });

}

function searchBook(name, authorName) {

    var openLibraryUrl = "http://openlibrary.org/search.json?";
    var titleMod = name ? "title=" + name : "";
    // ternary operator -     condition ? true branch : false branch
    var authorMod = authorName ? "author=" + authorName : "";
    openLibraryUrl += titleMod;
    openLibraryUrl += authorMod;


    //Directions for search api https://openlibrary.org/dev/docs/api/search
    console.log(openLibraryUrl);

    if (openLibraryUrl === "http://openlibrary.org/search.json?") {
        console.log("error - no parameters");

    } else {
        searchMovie(name);
           $.ajax({
            method: "GET",
            url: openLibraryUrl

        }).then(function (res) {
            
            //book title
            var bookTitle = res.docs[0].title;
            $("#book-title").text(bookTitle);

            // book cover
            var bookIsbn = res.docs[0].isbn[0];

            var bookCoverURL = "http://covers.openlibrary.org/b/isbn/" + bookIsbn + "-M.jpg";

            $("#book-cover").attr("src", bookCoverURL);

            //book description
            var worksUrl = `https://openlibrary.org${res.docs[0].key}.json`;

            $.ajax({
                method: "GET",
                url: worksUrl
            }).then(function (res) {
                $("#book-plot").text(res.description.value);
            });

            //books rating
            var googleBooksUrl=`https://www.googleapis.com/books/v1/volumes?q=isbn:${bookIsbn}&key=AIzaSyBtYq9z6CgPa4rmGWVSkwwSORdFIuFLc_4`;
            $.ajax({
                method: "GET",
                url: googleBooksUrl
            }).then(function (res) {

                var bookRating = res.items[0].volumeInfo.averageRating*2;
                $("#google-books-score").text(bookRating);


            });
        });

    }



}



function displaySuggestion(bookRating, movieRating) {

    if (bookRating > movieRating) {
        $("#suggestion").text("The book is better than the movie, you should read!")
    } else if (bookRating === null) {
        $("#suggestion").text("There is no book, you should watch the movie!")
    } else if (movieRating === null) {
        $("#suggestion").text("There is no movie, you should read the book!")
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
        var movieRating = $("#imdb-score").val();
        var bookRating = $("#google-books-score").val();
        
        searchBook(bookTitle, bookAuthor);
        displaySuggestion(bookRating, movieRating);

        localStorage.setItem("search",bookTitle);
    })

});


/**
 * main
 */
var firstSearchTemp = localStorage.getItem("search");

if (firstSearchTemp != null) {
    firstSearch = firstSearchTemp;
}

searchBook(firstSearch,"");
