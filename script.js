/**
 * static Variables
 */
var firstSearch = "sorcerer's stone";
var bookRating = null;
var movieRating = null;

/**
 * static functions
 */
function searchMovie(name) {

    var omdbUrl = "http://www.omdbapi.com/?s=" + name + "&apikey=8e4b0c73&type=movie";
    
    $.ajax({
        method: "GET",
        url: omdbUrl

    }).then(function (res) {
        console.log(res);
        var id = res.Search[0].imdbID;
        secondMovie(id)

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

    });

}


// added a 2nd API call to get more specific and desired information about our movie search

function secondMovie(id) {
        console.log(id);
        omdbUrl = "http://www.omdbapi.com/?i=" + id + "&apikey=8e4b0c73&type=movie";
        $.ajax({
            method: "GET",
            url: omdbUrl
    
        }).then(function (res) {
            console.log(res);
            //build the html content here (confirm skeleton framework class is called card?)
            var card  = $("<div>").addClass("card");
            var cardImg = $("<img>").addClass("card-image").attr("src", res.Poster)
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

                bookRating = res.items[0].volumeInfo.averageRating*2;
                $("#google-books-score").text(bookRating);


            });
        });

    }

}



function displaySuggestion(bookRating, movieRating) {

    if (bookRating > movieRating) {
        $("#suggestion").text("The book is better than the movie, you should read!")
    } else if (bookRating === null) {
        $("#suggestion").text("There is no book rating available.")
    } else if (movieRating === null) {
        $("#suggestion").text("There is no movie rating available.")
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
        displaySuggestion(bookRating, movieRating);

        localStorage.setItem("search",bookTitle);
    })
    $("#movie-search-button").on("click", function (event) {
        event.preventDefault();

        var movieTitle = $("#movie-input").val();
        searchMovie(movieTitle);
       

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
