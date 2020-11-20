queryUrl= "http://openlibrary.org/search.json?title=the+lord+of+the+rings";

//Directions for search api https://openlibrary.org/dev/docs/api/search

$.ajax({
    method:"GET",
    url: queryUrl
}).then(function(response){
    console.log(response);

    console.log("Author of First Result: " + response.docs[0].author_name);
});