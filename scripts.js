
parseAndPrependLocalStorage();

$(window).on('load', function() {
  $('.title-input').focus();
  toggleSaveDisable();
})

$(window).on('keyup', function(e) {
  if(e.keyCode === 13 && ($('.title-input').val() !== '') && ($('.body-input').val() !== '')){
    toggleSaveDisable();
    $('.save-btn').trigger('click');
  }
});

$('.body-input').on('input', function() {
  toggleSaveDisable();
})

$('.title-input').on('input', function() {
  toggleSaveDisable();
})

$('.todo-lib').on('click','button.delete-btn', deleteIdea)

//may want to refactor to switch case function
$('.todo-lib').on('click', 'button.downvote-btn', downvoteBtnClick)

$('.todo-lib').on('click', 'button.upvote-btn', function() {
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

$('.todo-lib').on('focusout','.article-text-container',editIdeaBody)
$('.todo-lib').on('focusout','.idea-card-header', editIdeaTitle)


$('.save-btn').on('click', function(event) {
  event.preventDefault();
  var newIdeaCard = makeNewIdeaObjectInstance();
  prependIdeaCard(newIdeaCard);
  storeIdeaCard(newIdeaCard);
  clearInputs();
});

$('.search-box').on('input', function() {
  var searchResult = $(this).val().toUpperCase();
  var ideaArray = pushLocalStorageIntoArray();
  console.log('idea array', ideaArray)
  var results = ideaArray.filter(function(idea) {
    if (idea.title.toUpperCase().includes(searchResult) || idea.body.toUpperCase().includes(searchResult)) {
      return idea
    }
  })
  $('.todo-lib').empty();
  results.forEach(function(result){
    prependIdeaCard(result);
  })
})

function clearInputs() {
  $('.title-input').val('');
  $('.body-input').val('');
  $('.title-input').focus();
  toggleSaveDisable();
}

function deleteIdea() {
  var id = $(this).closest('.idea-card').prop('id');
  localStorage.removeItem(id);
  $(this).parents('.idea-card').remove();
  pushLocalStorageIntoArray();
}

function downvoteBtnClick() {
  var id = $(this).closest('.idea-card').prop('id');
  var parseIdea = JSON.parse(localStorage.getItem(id));
    if (parseIdea.quality === 'Genius') {
      $(this).siblings('p').children().text('Plausible');
    } else if (parseIdea.quality === 'Plausible') {
      $(this).siblings('p').children().text('Swill');
    }
  parseIdea.quality = $(this).siblings('p').children().text();
  localStorage.setItem(id, JSON.stringify(parseIdea));
}

function editIdeaBody() {
  var id = $(this).closest('.idea-card').prop('id');
  var parseIdea = JSON.parse(localStorage.getItem(id));
  parseIdea.body = $(this).text();
  localStorage.setItem(id, JSON.stringify(parseIdea));
}

function editIdeaTitle() {
  var id = $(this).closest('.idea-card').prop('id');
  var parseIdea = JSON.parse(localStorage.getItem(id));
  parseIdea.title = $(this).text();
  localStorage.setItem(id, JSON.stringify(parseIdea));
}

function makeNewIdeaObjectInstance() {
  var ideaTitle = $('.title-input').val();
  var ideaBody = $('.body-input').val();
  var newIdeaCard = new todoObj(ideaTitle, ideaBody);
  return newIdeaCard
}

function parseAndPrependLocalStorage() {
  var keys = Object.keys(localStorage);
  var keyLength = keys.length;
  for (var i = 0; i < keyLength; i++) {
    prependIdeaCard(JSON.parse(localStorage.getItem(keys[i])));
  }
}

function prependIdeaCard(newIdeaCard) {
  $('.todo-lib').prepend(`<section
    class="card-holder-section">
      <article class="idea-card" id=${newIdeaCard.id}>
        <div class="idea-name-section">
          <h2 contenteditable='true' class="idea-card-header">${newIdeaCard.title}</h2>
          <button class="delete-btn" type="button" name="button"></button>
        </div>
        <div>
          <p contenteditable='true' class="article-text-container">${newIdeaCard.body}</p>
        </div>
        <div class="quality-control-container">
        <button class="upvote-btn" type="button" name="button"></button>
        <button class="downvote-btn" type="button" name="button"></button>
        <p>quality: <span class="quality">${newIdeaCard.quality}</p>
        </div>
      </article>
    </section>`);
}

function pushLocalStorageIntoArray() {
  var ideaArray = [];
  var keys = Object.keys(localStorage);
  var keyLength = keys.length;
  for (var j = 0; j < keyLength; j++) {
    ideaArray.push(JSON.parse(localStorage.getItem(keys[j])));
  } return ideaArray;
}

function storeIdeaCard(newIdeaCard) {
  localStorage.setItem(newIdeaCard.id, JSON.stringify(newIdeaCard));
}

function todoObj(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.quality = 'Swill';
}

function toggleSaveDisable() {
  var titleInput = $('.title-input').val();
  var bodyInput = $('.body-input').val();
  if (titleInput === '' || bodyInput === '') {
    $('.save-btn').prop('disabled', true)
  } else {
    $('.save-btn').prop('disabled', false)
  }
}

function getID(e){
  var id = $(this).closest('.idea-card').prop('id');
  return id
}

function parseStorage(id) {
  var parseIdea = JSON.parse(localStorage.getItem(id));
  return parseIdea
}

function checkDownvoteConditional(parseIdea) {
  if (parseIdea.quality === 'Genius') {
    $(this).siblings('p').children().text('Plausible');
  } else if (parseIdea.quality === 'Plausible') {
    $(this).siblings('p').children().text('Swill');
  }
}

function parseQualitySetNewID(parseIdea) {
  parseIdea.quality = $(this).siblings('p').children().text();
  localStorage.setItem(id, JSON.stringify(parseIdea));
}

//Attempt to fix the contentEditable with enter keypress

$('.todo-lib').on('input keydown', '.idea-card-header', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault()
    $('.idea-card-header').prop('contenteditable', false)
  }
})

$('.idea-card-header').on('click', function() {
  $('.idea-card-header').prop('contenteditable', true)
})

$('.todo-lib').on('input keydown', '.article-text-container', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault()
    $('.article-text-container').prop('contenteditable', false)
  }
})

$('.article-text-container').on('click', function() {
  $('.article-text-container').prop('contenteditable', true)
})
