var topics = [];
// var topicsNum = 0;

function renderButtons(buttonArea, topics) {
  // Deleting the movie buttons prior to adding new movie buttons
  // (this is necessary otherwise we will have repeat buttons)
  $("#" + buttonArea).empty();

  // Looping through the array of movies
  for (var i = 0; i < topics.length; i++) {
    // Then dynamicaly generating buttons for each topic in the array.
    // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
    var a = $("<button>");
    // Adding a class
    a.addClass("search btn btn-primary btn-sm m-1");
    // Adding a data-attribute with a value of the topic at index i
    a.attr("data-search", topics[i]);
    a.attr("data-ignore", "false");
    // Providing the button's text with a value of the topic at index i
    a.text(topics[i]);
    // Adding the button to the HTML
    $("#" + buttonArea).append(a);
  }
}

$("#add-button").on("click", function(e) {
  e.preventDefault();
  // $("#search-term").attr("value");
  var st = $("#search-input")
    .val()
    .trim();
  // "TEST";
  var empty = "";
  // dont add empty or one that already exists
  if (st !== empty && topics.indexOf(st) === -1) {
    //st = st + topicsNum++;
    topics.push(st);
    renderButtons("button-area", topics);
    $("#search-input").val("");
  }
});

// function addNewButton(){
//   var st = $("#search-input")
//     .val()
//     .trim();
//   // "TEST";
//   var empty = "";
//   // dont add empty or one that already exists
//   if (st !== empty && topics.indexOf(st) === -1) {
//     //st = st + topicsNum++;
//     topics.push(st);
//     renderButtons("button-area", topics);
//   }
// };

// Event listener for all button elements
$(document).on("click", "button.search", function(e) {
  e.preventDefault();
  // In this case, the "this" keyword refers to the button that was clicked
  var ignore = $(this).attr("data-ignore");
  if (ignore === "true") {
    // addNewButton();

    return;
  }
  var search = $(this).attr("data-search");
  var api_key = "RRfxh8Wu54LVq2ZtoWbDSpL5ETNJTKEz"
  // Constructing a URL to search Giphy for the name of the person who said the quote
  var queryURL =
  "https://api.giphy.com/v1/gifs/search?q=" +
  search +
  // "&api_key=dc6zaTOxFJmzC&limit=10";
  "&api_key="+api_key+"&limit=10";
  
  // Performing our AJAX GET request
  $.ajax({
    url: queryURL,
    method: "GET"
  })
  // After the data comes back from the API
  .then(function(response) {
    // Storing an array of results in the results variable
    console.log(response);
      var results = response.data;

      // Looping over every result item
      for (var i = 0; i < results.length; i++) {
        // Only taking action if the photo has an appropriate rating
        if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
        
          // Creating a div with the class "item"
          var gifDiv = $("<div class='col-4 justify-content-center item'>");

          // Storing the result item's rating
          var rating = results[i].rating;

          // Creating a paragraph tag with the result item's rating
          var p = $("<p>").text("Rating: " + rating);

          // Creating an image tag
          var personImage = $("<img>");

          // Giving the image tag an src attribute of a proprty pulled off the
          // result item
          personImage.attr("src", results[i].images.fixed_height.url);

          // Appending the paragraph and personImage we created to the "gifDiv" div we created
          gifDiv.append(p);
          gifDiv.append(personImage);

          // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
          $("#gifs-appear-here").prepend(gifDiv);
        }
      }
    });
});
