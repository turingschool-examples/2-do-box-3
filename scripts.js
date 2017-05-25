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
  this.quality = 'swill';
}

//retrieve content from input fields
function prependIdeaCard(newIdeaCard) {
  $('.bottom-section').prepend(`<section
    class="card-holder-section">
      <article class="idea-card" id=${newIdeaCard.id}>
        <div>
          <h2 contenteditable='true' class="idea-card-header">${newIdeaCard.title}</h2>
          <button class="delete-button" type="button" name="button"></button>
        </div>
        <div>
          <p contenteditable='true' class="article-text-container">${newIdeaCard.body}</p>
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
  localStorage.setItem(newIdeaCard.id, JSON.stringify(newIdeaCard));
}

//delete idea card from bottom section
$('.bottom-section').on('click','button.delete-button', function() {
  var id = $(this).closest('.idea-card').prop('id');
  localStorage.removeItem(id);
  $(this).parents('.idea-card').remove();
});

//edit title box
$('.bottom-section').on('keyup','.idea-card-header',function() {
  var id = $(this).closest('.idea-card').prop('id');
  var parseIdea = JSON.parse(localStorage.getItem(id));
  parseIdea.title = $(this).text();
  console.log(parseIdea);
  localStorage.setItem(id, JSON.stringify(parseIdea));
})

//edit body box
$('.bottom-section').on('keyup','.article-text-container',function() {
  console.log('helloooo')
  var id = $(this).closest('.idea-card').prop('id');
  var parseIdea = JSON.parse(localStorage.getItem(id));
  parseIdea.body = $(this).text();
  console.log(parseIdea);
  localStorage.setItem(id, JSON.stringify(parseIdea));
})


//upvote button from default
$('.bottom-section').on('click', 'button.upvote-button', function() {
  var id = $(this).closest('.idea-card').prop('id');
  var parseIdea = JSON.parse(localStorage.getItem(id));
    if (parseIdea.quality === 'Swill') {
      $(this).siblings('p').children().text('Plausible');
    } else if (parseIdea.quality === 'Plausible') {
      $(this).siblings('p').children().text('Genius');
    }
  parseIdea.quality = $(this).siblings('p').children().text();
  localStorage.setItem(id, JSON.stringify(parseIdea));
})

//downvote button
$('.bottom-section').on('click', 'button.downvote-button', function() {
  console.log('hello')
  var id = $(this).closest('.idea-card').prop('id');
  var parseIdea = JSON.parse(localStorage.getItem(id));
    if (parseIdea.quality === 'Genius') {
      $(this).siblings('p').children().text('Plausible');
    } else if (parseIdea.quality === 'Plausible') {
      $(this).siblings('p').children().text('Swill');
    }
  parseIdea.quality = $(this).siblings('p').children().text();
  localStorage.setItem(id, JSON.stringify(parseIdea));
})
