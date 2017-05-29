parseAndPrependLocalStorage();

$(window).on('load', function() {
  $('.title-input').focus();
  toggleSaveDisable();
})

$(window).on('keyup', function(e) {
  if(e.keyCode === 13 && ($('.title-input').val() !== '') && ($('.task-input').val() !== '')){
    toggleSaveDisable();
    $('.save-btn').trigger('click');
  }
});

$('.task-input').on('input', function() {
  toggleSaveDisable();
})

$('.title-input').on('input', function() {
  toggleSaveDisable();
})

$('.todo-lib').on('click','button.delete-btn', deleteTask)

//may want to refactor to switch case function
$('.todo-lib').on('click', 'button.downvote-btn', downvoteBtnClick)

$('.todo-lib').on('click', 'button.upvote-btn', function() {
  var id = $(this).closest('.todo-card').prop('id');
  var parseTask = JSON.parse(localStorage.getItem(id));
    if (parseTask.quality === 'Swill') {
      $(this).siblings('p').children().text('Plausible');
    } else if (parseTask.quality === 'Plausible') {
      $(this).siblings('p').children().text('Genius');
    }
  parseTask.quality = $(this).siblings('p').children().text();
  localStorage.setItem(id, JSON.stringify(parseTask));
  filterTasks();
})

$('.todo-lib').on('focusout','.article-text-container',editTaskBody)
$('.todo-lib').on('focusout','.todo-card-header', editTaskTitle)


$('.save-btn').on('click', function(event) {
  event.preventDefault();
  var newTaskCard = makeNewTaskObjectInstance();
  prependTaskCard(newTaskCard);
  storeTaskCard(newTaskCard);
  clearInputs();
  filterTasks();
});

$('.search-box').on('input', function() {
  var searchResult = $(this).val().toUpperCase();
  var taskArray = pushLocalStorageIntoArray();
  var results = taskArray.filter(function(task) {
    if (task.title.toUpperCase().includes(searchResult) || task.taskBody.toUpperCase().includes(searchResult)) {
      return task
    }
  })
  $('.todo-lib').empty();
  results.forEach(function(result){
    prependTaskCard(result);
  })
})

function clearInputs() {
  $('.title-input').val('');
  $('.task-input').val('');
  $('.title-input').focus();
  toggleSaveDisable();
}

function deleteTask() {
  var id = $(this).closest('.todo-card').prop('id');
  localStorage.removeItem(id);
  $(this).parents('.todo-card').remove();
  pushLocalStorageIntoArray();
  filterTasks();
}

function downvoteBtnClick() {
  var id = $(this).closest('.todo-card').prop('id');
  var parseTask = JSON.parse(localStorage.getItem(id));
    if (parseTask.quality === 'Genius') {
      $(this).siblings('p').children().text('Plausible');
    } else if (parseTask.quality === 'Plausible') {
      $(this).siblings('p').children().text('Swill');
    }
  parseTask.quality = $(this).siblings('p').children().text();
  localStorage.setItem(id, JSON.stringify(parseTask));
  filterTasks();
}

function editTaskBody() {
  var id = $(this).closest('.todo-card').prop('id');
  var parseTask = JSON.parse(localStorage.getItem(id));
  parseTask.taskBody = $(this).text();
  localStorage.setItem(id, JSON.stringify(parseTask));
  filterTasks();
}

function editTaskTitle() {
  var id = $(this).closest('.todo-card').prop('id');
  var parseTask = JSON.parse(localStorage.getItem(id));
  parseTask.title = $(this).text();
  localStorage.setItem(id, JSON.stringify(parseTask));
  filterTasks();
}

function filterTasks() {
  var searchResult = $('.search-box').val().toUpperCase();
  var taskArray = pushLocalStorageIntoArray();
  var results = taskArray.filter(function(task) {
    if (task.title.toUpperCase().includes(searchResult) || task.taskBody.toUpperCase().includes(searchResult)) {
      return task
    }
  })
  $('.todo-lib').empty();
  results.forEach(function(result){
    prependTaskCard(result);
  })
}

function makeNewTaskObjectInstance() {
  var taskTitle = $('.title-input').val();
  var taskBody = $('.task-input').val();
  var newTaskCard = new todoObj(taskTitle, taskBody);
  return newTaskCard
}

function parseAndPrependLocalStorage() {
  var keys = Object.keys(localStorage);
  var keyLength = keys.length;
  for (var i = 0; i < keyLength; i++) {
    prependTaskCard(JSON.parse(localStorage.getItem(keys[i])));
  }
}

function prependTaskCard(newTaskCard) {
  $('.todo-lib').prepend(`<section
    class="card-holder-section">
      <article class="todo-card" id=${newTaskCard.id}>
        <div class="task-name-section">
          <h2 contenteditable='true' class="todo-card-header">${newTaskCard.title}</h2>
          <button class="delete-btn" type="button" name="button"></button>
        </div>
        <div>
          <p contenteditable='true' class="article-text-container">${newTaskCard.taskBody}</p>
        </div>
        <div class="quality-control-container">
        <button class="upvote-btn" type="button" name="button"></button>
        <button class="downvote-btn" type="button" name="button"></button>
        <p>quality: <span class="quality">${newTaskCard.quality}</p>
        </div>
      </article>
    </section>`);
}

function pushLocalStorageIntoArray() {
  var taskArray = [];
  var keys = Object.keys(localStorage);
  var keyLength = keys.length;
  for (var j = 0; j < keyLength; j++) {
    taskArray.push(JSON.parse(localStorage.getItem(keys[j])));
  } return taskArray;
}

function storeTaskCard(newTaskCard) {
  localStorage.setItem(newTaskCard.id, JSON.stringify(newTaskCard));
}

function todoObj(title, task) {
  this.title = title;
  this.taskBody = task;
  this.id = Date.now();
  this.quality = 'Swill';
}

function toggleSaveDisable() {
  var titleInput = $('.title-input').val();
  var taskInput = $('.task-input').val();
  if (titleInput === '' || taskInput === '') {
    $('.save-btn').prop('disabled', true)
  } else {
    $('.save-btn').prop('disabled', false)
  }
}

//Attempt to pull out separate functions for changing downvote
function getID(e){
  var id = $(this).closest('.todo-card').prop('id');
  return id
}

function parseStorage(id) {
  var parseTask = JSON.parse(localStorage.getItem(id));
  return parseTask
}

function checkDownvoteConditional(parseTask) {
  if (parseTask.quality === 'Genius') {
    $(this).siblings('p').children().text('Plausible');
  } else if (parseTask.quality === 'Plausible') {
    $(this).siblings('p').children().text('Swill');
  }
}

function parseQualitySetNewID(parseTask) {
  parseTask.quality = $(this).siblings('p').children().text();
  localStorage.setItem(id, JSON.stringify(parseTask));
}

//Attempt to fix the contentEditable with enter keypress

$('.todo-lib').on('input keydown', '.todo-card-header', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault()
    $('.todo-card-header').prop('contenteditable', false)
  }
})

$('.todo-card-header').on('click', function() {
  $('.todo-card-header').prop('contenteditable', true)
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
