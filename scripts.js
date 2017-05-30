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
  switchImportanceUp(parseTask);
  localStorage.setItem(id, JSON.stringify(parseTask));
  filterTasks();
})

$('.todo-card').on('click', 'button.completed-btn-select', function() {
  var id = $(this).closest('.todo-card').prop('id');
  var parseTask = JSON.parse(localStorage.getItem(id));
    if (parseTask.completed === false) {
      $(this).closest('.todo-card').toggleClass('completed-task');
      parseTask.completed = true;
    } else if (parseTask.completed === true) {
      $(this).closest('.todo-card').toggleClass('completed-task');
      parseTask.completed = false;
    }
  localStorage.setItem(id, JSON.stringify(parseTask))
  // filterTasks();
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

$('.critical-btn').on('click', importanceBtnFilter);
$('.high-btn').on('click', importanceBtnFilter);
$('.normal-btn').on('click', importanceBtnFilter);
$('.low-btn').on('click', importanceBtnFilter);
$('.none-btn').on('click', importanceBtnFilter);



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
  switchImportanceDown(parseTask);
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

function importanceBtnFilter(e) {
  var importanceArray = pushLocalStorageIntoArray();
  var importanceResults = importanceArray.filter(function(task) {
    if (task.importance === $(e.target).text()) {
      return task
    }
  })
  $('.todo-lib').empty();
  importanceResults.forEach(function(result) {
    prependTaskCard(result)
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
          <p>quality: <span class="quality">${newTaskCard.importance}</p>
          <div class="completed-container">
            <button class="completed-btn-select" type="button" name="button"></button>
          </div>
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

function switchImportanceDown(parseTask) {
  switch (parseTask.importance) {
    case 'Low':
      parseTask.importance = 'None'
      $(this).siblings('p').children().text('None');
      break;
    case 'Normal':
      parseTask.importance = 'Low'
      $(this).siblings('p').children().text('Low');
      break;
    case 'High':
      parseTask.importance = 'Normal'
      $(this).siblings('p').children().text('Normal');
      break;
    case 'Critical':
      parseTask.importance = 'High'
      $(this).siblings('p').children().text('High');
      break;
    default:
      break;
  }
}

function switchImportanceUp(parseTask) {
  switch (parseTask.importance) {
    case 'None':
      parseTask.importance = 'Low'
      $(this).siblings('p').children().text('Low');
      break;
    case 'Low':
      parseTask.importance = 'Normal'
      $(this).siblings('p').children().text('Normal');
      break;
    case 'Normal':
      parseTask.importance = 'High'
      $(this).siblings('p').children().text('High');
      break;
    case 'High':
      parseTask.importance = 'Critical'
      $(this).siblings('p').children().text('Critical');
      break;
    default:
      break;
  }
}

function todoObj(title, task) {
  this.title = title;
  this.taskBody = task;
  this.id = Date.now();
  this.importance = 'Normal';
  this.completed = false;
}

function toggleCompletedTask() {
  var id = $(this).closest('.todo-card').prop('id');
  var parseTask = JSON.parse(localStorage.getItem(id));
    if (parseTask.completed === false) {
      $(this).closest('.todo-card').toggleClass('completed-task');
      parseTask.completed = true;
    } else if (parseTask.completed === true) {
      $(this).closest('.todo-card').toggleClass('completed-task');
      parseTask.completed = false;
    }
  localStorage.setItem(id, JSON.stringify(parseTask))
  // filterTasks();
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
  if (parseTask.importance === 'Genius') {
    $(this).siblings('p').children().text('Plausible');
  } else if (parseTask.importance === 'Plausible') {
    $(this).siblings('p').children().text('Swill');
  }
}

function parseQualitySetNewID(parseTask) {
  parseTask.importance = $(this).siblings('p').children().text();
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
