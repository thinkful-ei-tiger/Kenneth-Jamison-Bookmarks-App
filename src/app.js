import $ from 'jquery';
import store from './store';
import api from './api';





function startUpPage(){
  return $('main').html(`    
  <nav class='navBar'>
    <ul class='navMenu'>
      <li class='navList'>Home</li>
      <li class='navList'>Home</li>
      <li class='navList'>Home</li>
      <li class='navList'>Home</li>
    </ul>
  </nav>
  <h1>Bookmark App</h1>

  <section id="beginning" class="beginning"> 
    
    <h2 id="adding" class="initialAdd"><button>ADD </button></h2>
    <section class="bookmarkNum">
      <select id="filter" class="bookmark-select" id="filter">
        <option value="" >Rate⭐</option>
        <option value="5">5⭐⭐⭐⭐⭐</option>
        <option value="4">4+⭐⭐⭐⭐</option>
        <option value="3">3+⭐⭐⭐</option>
        <option value="2">2+⭐⭐</option>
        <option value="1" >1+⭐</option>
      </select>
    </section>  
  </section>  
    <section id="formContainer" class="formContainer">
        
      </section>


      <section id="listContainer" class="listContainer">
          <section id="bookmarkList" class="listDisplay">
            
            <section class="listItems" id="filler">
                
                  <p class="emptyMarks"><b>Add a bookmark</b></p>
  
              <section>

          </section>
      </section>`);
}

function generateForm(){
  return `<h2 class="newBm">New Bookmark</h2>
  <section id="formUp">
    <section id="listContainer" class="listContainer listDisplay">
      <section>
        <form class="addingNew">
          <fieldset>
            <legend>New Bookmark</legend>
            <label for="siteName">Title:</label>
            <input id="siteName" class="boxed" type="text" name="site" placeholder="Name"><br>

            <label for="siteURL">URL:</label>
            <input id="siteURL" class="boxed" type="text" name="siteURL" required placeholder="https://"><br>

            <label for="description">Description:</label><br>
            <textarea name="description" class="boxed" id="description" cols="30" rows="10" placeholder="Site Description"></textarea><br><br>
            <section id="rating" class="rating">
              <p>Rate Your Bookmark Below </p>
              <span><input type="radio" name="rating" id="str5" value="5" required><label for="str5">5</label></span>
              <span><input type="radio" name="rating" id="str4" value="4"><label for="str4">4</label></span>
              <span><input type="radio" name="rating" id="str3" value="3"><label for="str3">3</label></span>
              <span><input type="radio" name="rating" id="str2" value="2"><label for="str2">2</label></span>
              <span><input type="radio" name="rating" id="str1" value="1"><label for="str1">1</label></span>
            </section>
          </fieldset>
          
          <section class="linkRemove"> 
            <button id="cancel">Cancel </button>
            <button alt="Submit" id="addBookmark"> Add </button>
          </section>
        </form>

  </section>`;
}


function addToList(){
  let list = store.store.bookmarks;
  for(let i = 0; i < list.length; i++){  
    $('#bookmarkList').append(`
    <section id="${list[i].id}" class="listItems">
      <span class="nameTitle collapse" contenteditable="false"><b>${list[i].title}</b></span>
      <span class="stars" contenteditable="false"><button>⭐</button><b>${list[i].rating}</b></span>
      <section class="moveRight">
        <button class="edit"> Edit </button>
        <button class="delButton"> Delete </button>
        <input type="checkbox" placeholder='checked' border="0" alt="Submit" ></input>
      </section>
      <section class="editing">
        <p class="hidden description" contenteditable="false">${list[i].desc}<br>
        <a href=${list[i].url} target="_blank"><button> Visit</button></a></p>
        <button alt='submit'> Save </button>
      </section>
    </section>`)};
}



function newBookmarkEvent(){
  $('body').on('click', '#adding', function (){
    store.store.adding = true;
    $('.listContainer').toggleClass('hidden');
    $('.formContainer').toggleClass('hidden');
    $('#beginning').toggleClass('hidden');
    render();
  });
}


function bookmarkFormSubmit(){
  $('body').on('submit','.addingNew', function(event){
    event.preventDefault();
    $('#formContainer').toggleClass('hidden');
    api.saveBookmark()
    .then(function (){
      $('#beginning').toggleClass('hidden');
      console.log('added');
      store.store.adding = false;
      render()
    })
  });
}

function cancelForm() {
  $('body').on('click', '#cancel', function() {
    console.log('cancel');
    $('.listContainer').toggleClass('hidden');
    $('#formContainer').toggleClass('hidden');
    $('.beginning').show();
    store.store.adding = false;
    render();
  })
}


function deleteBookmark() {
  $('body').on('click', '.delButton', function(event) {
    let id = $(event.target).closest('.listItems').attr('id');
    api.deleteBookmarks(id)
    .then(function () {
      api.showBookmarks()
        .then(function () {
          render()
        })
    })
  })
}


function showDescription(){
  $('body').on('click', '.nameTitle', function (event) {
    let item = $(event.target).closest('.listItems').find('p');
    item.toggleClass('hidden');
  })
}


function editBookmark() {
  $('body').on('click', '.edit', function() {
    console.log('clicked');
    $(this).siblings('.save').show();
    $(this).parent().siblings('.nameTitle').attr('contenteditable', 'true').toggleClass('boxed');
    $(this).parent().siblings('.stars').attr('contenteditable', 'true').toggleClass('boxed');
    $(this).parent().siblings('.editing').find('.description').attr('contenteditable', 'true').toggleClass('boxed');

  })
}


function saveEditBookmark() {
  $('body').on('click', '.save', function() {
    console.log('works');
    $(this).hide();

    let name = $(this).parent().siblings('.nameTitle').toggleClass('boxed');
    let rating = $(this).parent().siblings('.stars').toggleClass('boxed');
    let description = $(this).parent().siblings('.editing').find('.description').toggleClass('boxed');
    let id = $(this).parents('.listItems').attr('id');

    name.attr('contenteditable', 'false');
    rating.attr('contenteditable', 'false');
    description.attr('contenteditable', 'false');

  api.editBookmarks(id, name.text(), rating.text(), description.text());
  })
}



function sortBy(){
  $('body').on('change', '.bookmark-select', function() {
    let rating = $(this).val();
    let sorted = store.store.bookmarks.filter( function (item) {
      return item.rating >= rating;
    })
    console.log(sorted);
    displaySorted(sorted);
  })
}


function displaySorted(store){
  let list = store;
  let html = '';
  for(let i = 0; i < list.length; i++){  
    html += `
    <section id="${list[i].id}" class="listItems">
      <span class="nameTitle collapse" contenteditable="false"><b>${list[i].title}</b></span>
      <span class="stars" contenteditable="false"><img src=${rating}/><b>${list[i].rating}</b></span>
      <section class="moveRight">
        <img src=${pen} class="edit"/>
        <img src=${deleteIt} class="delButton"/>
        <button class="hidden save">SAVE</button>
      </section>
      <section class="editing">
        <p class="hidden description" contenteditable="false">${list[i].desc}<br>
        <a href=${list[i].url} target="_blank"><img src=${visit}/></a></p>
      </section>
    </section>`};

    $('#bookmarkList').html(html);
}


function bookmarkList(){
  api.showBookmarks()
  .then(function () {
    render();
  })
  }


function ratings(){
  $(".rating input:radio").attr("checked", false);
  $('.rating input').on('click', function () {
      $(".rating span").removeClass('checked');
      $(this).parent().addClass('checked');
  });
};


function render(){

  if(store.store.adding) {
    console.log('with');
    $('#formContainer').html(generateForm());
    $('#formContainer').toggleClass('hidden');
  }
  else{
    startUpPage();
    addToList();
    $('#filter').prop('selectedIndex',0);
  }

  $('#listContainer').addClass('testing')

  if(store.store.bookmarks.length > 0) {
    $('.listContainer .emptyMarks').addClass('hidden')
  } 
  else {
    $('.listContainer .emptyMarks').removeClass('hidden')
  }
}

function bindEventListeners(){ 
  newBookmarkEvent();
  bookmarkFormSubmit();
  deleteBookmark();
  ratings();
  showDescription();
  editBookmark();
  saveEditBookmark();
  sortBy();
  cancelForm();
}



export default { 
  generateForm, 
  bindEventListeners,
  bookmarkList,
  startUpPage
}