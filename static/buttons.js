$(document).ready(function () {
    $(document).on("click", ".notes", handleNoteSave);

    function handleNoteSave() {
        // This function handles what happens when a user tries to save a new note for an article
        // Setting a variable to hold some formatted data about our note,
        // grabbing the note typed into the input box
        var noteData;
        var newNote = $(".bootbox-body textarea")
          .val()
          .trim();
        // If we actually have data typed into the note input field, format it
        // and post it to the "/api/notes" route and send the formatted noteData as well
        if (newNote) {
          noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
          $.post("/api/notes", noteData).then(function() {
            // When complete, close the modal
            bootbox.hideAll();
          });
        }
      }
})