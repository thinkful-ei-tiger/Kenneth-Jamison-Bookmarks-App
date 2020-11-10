import $ from 'jquery';
import './main.css';
import app from './app';


function main(){
   app.bindEventListeners();
   app.bookmarkList();
}

$(main);