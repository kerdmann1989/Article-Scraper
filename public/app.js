// Grab the articles as a JSON
// $.getJSON("/articles", function(data) {
//     //For each one
//     for (var i=0; i < data.length; i++) {
//         //Display the apropos info on the page
//         $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "https://www.ksl.com" + data[i].link + "<br />" + data[i].summary + "</p>");
//     }
// });
//Handle scrape button
$(".scrape").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    .done(function(data) {
        location.reload();
    });
});

//Save article button -- not working
$(".save-btn").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId
    }).done(function(data) {
        window.location = "/"
    })
});

//Add note button
$(".note-btn").on("click", function() {
    //Empty the notes from the note section
    $(".notes").empty();
    //Save the id from the p tag
    var thisId = $(this).attr("data-id");
    console.log("this id for note-btn", thisId)

    //Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    //With that done, add the note information to the page
    .then(function(data) {
        console.log(data);
        //The title of the article
        // $(`.${thisId}notes`).append("<h5>" + data.title + "</h5>");

        //An input to enter a new title
        $(`.${thisId}notes`).append("<input id='titleinput" + data._id + "' class='titleinput' name='title' placeholder='Enter Note Title'>");
        //A textarea to add a new note body
        $(`.${thisId}notes`).append("<textarea id='bodyinput" + data._id + "' class='bodyinput' name='body'></textarea>");
        //A button to submit a new note, with the id of the article saved to it
        $(`.${thisId}notes`).append("<br><button data-id='" + data._id + "' class='savenote btn-floating btn-large waves-effect waves-light'>Save Note</button>");
        $(`.${thisId}notes`).append("<button data-id='" + data._id + "' id='close' class='btn-floating btn-large waves-effect waves-light'>Close Note</button><br>");
        // $(`.${thisId}notes`).append("<button data-id='" + data._id + "' id='view'>View Notes</button>");

        //If there's a note in the article
        if (data.note) {
            
            //Place the title of the note in the title input
            $("#titleinput").val(data.note.title);

            //Place the body in the note of the body textarea
            $("#bodyinput").val(data.note.body);
        }
    });
});


//When you click the savenote button
$(document).on("click", ".savenote", function(event) {
    //grab the id associated with the article from the submit button
    console.log("This is event", event);
    var thisId = $(this).attr("data-id");
    console.log("This id", thisId)

    //Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            //value taken from the title input
            title: $("#titleinput" + thisId).val(),
            // title: $("#titleinput").val(),

            //Value taken from note textarea
            body: $("#bodyinput" + thisId).val()
            // title: $("#titleinput").val(),

        }
    })
    //With that done
    .then(function(article) {
        //Log the response
        console.log("Here is the article", article);
        var articleNotes = $(`.${article._id}articleNotes`)
        //Emtpy the notes section
        articleNotes.empty();

        for (let i = 0; i < article.note.length; i++) {
            // var p = $("<p>" +  article.note[i] + "</p>"); //the same
            var div = $('<br><div class="noteBox" style="border: 1px solid black; margin-bottom: 5px;"></div>')
            var p = $(`<p> ${ article.note[i].body } </p>`);
            var button = $(`<button data-id="${article.note[i]._id}" class="delete"> delete note</button>`)
            div.append(p, button)
            articleNotes.append(div)
        }
    });

    //Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});


//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$44
//When you click the savenote button
$(document).on("click", "#view", function() {
    //grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    //Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId,
    })
    //With that done
    .then(function(article) {
        var articleNotes = $(`.${article._id}articleNotes`)
        //Emtpy the notes section
        articleNotes.empty();

        for (let i = 0; i < article.note.length; i++) {
            // var p = $("<p>" +  article.note[i] + "</p>"); //the same
            var div = $('<div style="border: 1px solid black; margin-bottom: 5px;"></div>')
            var p = $(`<p> ${ article.note[i].body } </p>`);
            var button = $(`<button data-id="${article.note[i]._id}" class="delete"> delete note</button>`)
            div.append(p, button)
            articleNotes.append(div)
        }
    });

    //Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
    
});

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

//delete button
$(document).on('click', '.delete', function (){
    event.preventDefault();
    console.log($(this).attr("data-id"))
    const id = $(this).attr("data-id");
    console.log(id);
    $.ajax(`/note/${id}`, {
        type: "DELETE"
    }).then(function () {
       location.reload();
    });
});

$(document).on("click", "#close", function () {
    event.preventDefault();
    $.ajax({
        method: "GET",
        url: "/"
    })
    .done(function(data) {
        location.reload();
    });
});






$(document).ready(function(){
    $('.collapsible').collapsible();
  });