$(document).ready(function(){
    $("#search-button").on("click", function(){
        var movieName = $("#movieName").val().trim();

        searchMovie(movieName)
    })

    function searchMovie(name) {
        var API_KEY = "8489f475"
        console.log(API_KEY);
        console.log(name);

        $.ajax({
            method: "GET",
            url: "http://www.omdbapi.com/?i=tt3896198" + name + "&appid=" + API_KEY,
            dataType: "json"
        }).then(function(res){
            console.log(res)
           
           var card = $("<div>").addClass("card")

        })
    }

})