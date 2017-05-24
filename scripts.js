var ideaTitleInput = $('.title-input');
var ideaBodyInput = $('.body-input');
var storageArray = [];

function ideasFromLocal() {
  var keys = Object.keys(localStorage);
  var keyLength = keys.length;

  for (var i = 0; i < keyLength; i++) {
    prependIdeaCard(JSON.parse(localStorage.getItem(keys[i])));
  }
}

ideasFromLocal();

//clear input fields
function clearInput() {
  ideaTitleInput.val('');
  ideaBodyInput.val('');
}

//adding card to local storage constructor function
function constructNewIdea(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.quality = 'Swill';
}

//retrieve content from input fields
function prependIdeaCard(newIdeaCard) {
  $('.bottom-section').prepend(`<section
    class="card-holder-section">
      <article class="idea-card" id=${newIdeaCard.id}>
        <div contenteditable='true' class="idea-card-header">
          <h2>${newIdeaCard.title}</h2>
          <button class="delete-button" type="button" name="button"></button>
        </div>
        <div contenteditable='true' class="article-text-container">
          <p>${newIdeaCard.body}</p>
        </div>
        <div class="quality-control-container">
        <button class="upvote-button" type="button" name="button"></button>
        <button class="downvote-button" type="button" name="button"></button>
        <p>quality: <span class="quality">${newIdeaCard.quality}</p>
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
  var newIdeaCard = new constructNewIdea(ideaTitle, ideaBody);
  constructNewIdea();
  prependIdeaCard(newIdeaCard);
  storeIdeaCard(newIdeaCard);
});

//store unique ID
function storeIdeaCard(newIdeaCard) {
  // storageArray.push(newIdeaCard.id);
  localStorage.setItem(newIdeaCard.id, JSON.stringify(newIdeaCard));
}

// //retrieve ideas from storage
// function retrieveIdeas(id) {
//   var parsedIdeas = JSON.parse(localStorage.getItem(id));
//   console.log(parsedIdeas);
// }
// retrieveIdeas();

//delete idea card from bottom section
$('.bottom-section').on('click','button.delete-button', function() {
  $(this).parents('.idea-card').remove();
  var deleteButton = $(this).parent.prop();
  localStorage.getItem(deleteButton);
  console.log(deleteButton);
});

//need to get correct id for .prop()

// //upvote button from default :: not yet functional
// $('.bottom-section').on('click', 'button.upvote-button', function() {
//
// })
//
// //downvote button :: not yet functional
// $('.bottom-section').on('click', 'button.downvote-button', function() {
//
// })
