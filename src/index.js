import $ from 'jquery';
import './main.css';
import app from './app.js';


function main(){
   app.bindEventListeners();
   app.bookmarkList();
}

$(main);