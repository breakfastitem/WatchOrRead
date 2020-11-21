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
/**
 * Event Listeners
 */
$(document).ready(function () {
    $("#search-button").on("click", function (event) {
        event.preventDefault();

        var movieName = $("#search-input").val();

        searchMovie(movieName);
    })



});

/**
 * main
 */
var openLibraryUrl = "http://openlibrary.org/search.json?title=the+lord+of+the+rings";
//Directions for search api https://openlibrary.org/dev/docs/api/search

$.ajax({
    method: "GET",
    url: openLibraryUrl
}).then(function (response) {
    console.log(response);

    console.log("Author of First Result: " + response.docs[0].author_name);
});
