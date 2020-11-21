/**
 * static Variables
 */

/**
 * static functions
 */
function searchMovie(name) {

    $.ajax({
        method: "GET",
        url: "http://www.omdbapi.com/?t="+name+"&apikey=8e4b0c73"

    }).then(function (res) {

        // movie title
        var movieTitle = res.Title
        $("#movie-title").text(movieTitle);

        // movie poster
        var imgURL = res.Poster
        var moviePoster = $("#movie-poster").attr("src", imgURL);

        //movie plot
        var moviePlot = res.Plot
        $("#movie-plot").text(moviePlot);


    });




}





function searchBook(movieName){
 
    var openLibraryUrl = "http://openlibrary.org/search.json?title="+movieName;
    //Directions for search api https://openlibrary.org/dev/docs/api/search
    
    $.ajax({
        method: "GET",
        url: openLibraryUrl

    }).then(function (res) {
        console.log(res);

        //book title
        var bookTitle = res.docs[0].title;
        $("#book-title").text(bookTitle);

        // book cover
        var bookIsbn = res.docs[0].isbn[0];
        var bookCoverURL = "http://covers.openlibrary.org/b/isbn/" + bookIsbn + "-M.jpg";
        var bookCover = $("#book-cover").attr("src", bookCoverURL);

        //book description
        var bookPlot = 
    
        

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
    })



});


/**
 * main
 */

