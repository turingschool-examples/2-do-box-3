var ideaTitleInput = $('.title-input');
var ideaBodyInput = $('.body-input');
var qualityName = document.querySelector('.quality');

//clear input fields
function clearInput() {
  ideaTitleInput.val('');
  ideaBodyInput.val('');
}
//retrieve content from input fields
function newIdeaCard(title, body) {
  $('.bottom-section').prepend(`<section
    class="card-holder-section">
      <article class="idea-card">
        <div class="idea-card-header">
          <h2>${title}</h2>
          <button class="delete-button" type="button" name="button"></button>
        </div>
        <div class="article-text-container">
          <p>${body}</p>
        </div>
        <div class="quality-control-container">
        <button class="upvote-button" type="button" name="button"></button>
        <button class="downvote-button" type="button" name="button"></button>
        <p>quality: swill</p>
        </div>
      </article>
    </section>`);
  clearInput();
}

//add new idea card on click
$('.save-button').on('click', function(event) {
  event.preventDefault();
  var ideaTitle = ideaTitleInput.val();
  var ideaBody = ideaBodyInput.val();
  newIdeaCard(ideaTitle, ideaBody);
});

//delete idea card from bottom section
$('.bottom-section').on('click','button.delete-button', function() {
  $(this).parents('.idea-card').remove();
});

// //upvote button from default :: not yet functional
// $('.bottom-section').on('click', 'button.upvote-button', function() {
//
// })
//
// //downvote button :: not yet functional
// $('.bottom-section').on('click', 'button.downvote-button', function() {
//
// })
