var topics = [];
var lastTopic = "";
var pagination = 0;

var topics = JSON.parse(localStorage.getItem("buttonlist"));

// Checks to see if the todolist exists in localStorage and is an array currently
// If not, set a local list variable to an empty array
// Otherwise list is our current list of todos
if (!Array.isArray(topics)) {
  topics = [];
}

function renderButtons(buttonArea, topics) {
  // Deleting the movie buttons prior to adding new movie buttons
  // (this is necessary otherwise we will have repeat buttons)
  len = topics.length;
  if (len > 0) {
    $("#" + buttonArea).empty();
    // Looping through the array of movies
    for (var i = 0; i < len; i++) {
      // Then dynamicaly generating buttons for each topic in the array.
      // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
      var a = $("<button>");
      // Adding a class
      a.addClass("search btn btn-primary btn-md mt-1 ml-1");
      // Adding a data-attribute with a value of the topic at index i
      a.attr("data-search", topics[i]);
      // Providing the button's text with a value of the topic at index i
      a.text(topics[i]);
      a.attr("draggable", "true");
      a.attr("ondragstart", "drag(event)");
      a.attr("id", "btn" + i);
      // Adding the button to the HTML
      $("#" + buttonArea).append(a);
    }
  }
}

renderButtons("button-area", topics);

function clearAll(buttonArea, topics) {
  $("#" + buttonArea).empty();
  $("#" + buttonArea).text("Search buttons here...");
  var len = topics.length;
  for (var i = 0; i < len; i++) {
    topics.pop();
  }
  localStorage.setItem("buttonlist", JSON.stringify(topics));
  clearImages();
}

function clearImages() {
  $("#gifs-appear-here").empty();
  $("#gifs-appear-here").text("Search Images here...");
}

function createGifDiv(result) {
  var gifDiv = $("<div class='col-3 justify-content-center item' >");

  // Storing the result item's rating & title
  var title = result.title;
  var rating = result.rating;

  // Creating a paragraph tag with the result item's rating
  var r = $("<h6>").text("Rating: " + rating);
  var t = $("<h6>").text("Title: " + title);

  // Creating an image tag
  var gifImage = $("<img style='width: 100%'>");
  gifImage.addClass("gif");
  // var animateVal = $("#animate-check").val();
  var checked = $("#animate-check").is(":checked");
  // if ($("#check_id").is(":checked")) {
  //   console.log(checked);
  // }
  if (checked === false) {
    // Giving the image tag an src attribute of a proprty pulled off the
    // result item
    gifImage.attr("data-state", "still");
    gifImage.attr("src", result.images.fixed_height_still.url);
  } else {
    gifImage.attr("data-state", "animate");
    gifImage.attr("src", result.images.fixed_height.url);
  }

  // gifImage.attr("data-state", "still");
  gifImage.attr("data-animate", result.images.fixed_height.url);
  gifImage.attr("data-still", result.images.fixed_height_still.url);
  gifImage.attr("data-toggle", "hover");
  gifImage.attr("title", title);
  gifImage.attr("data-content", "Rating: " + rating);

  // Appending the paragraph and gifImage we created to the "gifDiv" div we created
  // gifDiv.append(t);
  // gifDiv.append(r);
  gifDiv.append($("<hr>"));

  gifDiv.append(gifImage);
  return gifDiv;
}

// Event listener for Add button
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
    localStorage.setItem("buttonlist", JSON.stringify(topics));
    renderButtons("button-area", topics);
    $("#search-input").val("");
  }
});

// Event listener for clear all button
$("#clear-button").on("click", function(e) {
  e.preventDefault();
  clearAll("button-area", topics);
});

$(document).on("mouseenter", ".gif", function(e) {
  // e.preventDefault();
  $(this).popover("show");
});

$(document).on("mouseleave", ".gif", function(e) {
  // e.preventDefault();
  $(this).popover("hide");
});

// $(".gif").on("click", function() {
$(document).on("click", ".gif", function(e) {
  // e.preventDefault();
  // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
  var state = $(this).attr("data-state");
  // If the clicked image's state is still, update its src attribute to what its data-animate value is.
  // Then, set the image's data-state to animate
  // Else set src to the data-still value
  if (state === "still") {
    $(this).attr("src", $(this).attr("data-animate"));
    $(this).attr("data-state", "animate");
    // console.log(state + "->animate");
  } else {
    $(this).attr("src", $(this).attr("data-still"));
    $(this).attr("data-state", "still");
    // console.log(state + "->still");
  }
});

// Event listener for all button search elements
$(document).on("click", "button.search", function(e) {
  e.preventDefault();
  // In this case, the "this" keyword refers to the button that was clicked

  var search = $(this).attr("data-search");
  if (lastTopic !== search) {
    lastTopic = search;
    pagination = 0;
    clearImages();
  } else {
    pagination += 10;
  }

  var api_key = "RRfxh8Wu54LVq2ZtoWbDSpL5ETNJTKEz";
  // Constructing a URL to search Giphy for the name of the person who said the quote
  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    search +
    // "&api_key=dc6zaTOxFJmzC&limit=10";
    "&api_key=" +
    api_key +
    "&limit=10&offset=" +
    pagination;

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

          // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
          var gifDiv = createGifDiv(results[i]);
          $("#gifs-appear-here").prepend(gifDiv);
        }
      }
    });
});

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var id = ev.dataTransfer.getData("text");
  //ev.target.appendChild(document.getElementById(data));
  var text = $("#" + id).attr("data-search");
  var i = topics.indexOf(text);
  if (i > -1) {
    topics.splice(i, 1);
    localStorage.setItem("buttonlist", JSON.stringify(topics));
    $("#" + id).remove();
  }
}

$("#animate-check").change("click", function() {
  var checked = $(this).is(":checked");
  console.log(checked);
  // var checked = $("#check_id").is(":checked");
  // if ($("#check_id").is(":checked")) {
  //   console.log(checked);
  // }
  if (checked) {
    console.log('checked');
    // $("#animate-check").prop("checked", true);
  } else {
    console.log('unchecked');
    // $("#animate-check").prop("checked", false);
  }
});
