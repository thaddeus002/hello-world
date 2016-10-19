/**
 * \file script.js
 * \brief Simple use of Github's API
 */

"use strict";

var input = document.getElementById("speudo");
var bouton = document.getElementById("speudoValid");
var panel = document.getElementById("result");
var baseUrl = "https://api.github.com/users";


/**
 * Show a user data.
 * \param user an object representing a user
 */
function afficheUser(user) {
  var message = "";
  message += "User's login : " + user.login + "\n";
  message += "name : " + user.name + "\n";
  message += "company : " + user.company + "\n";
  message += "blog : " + user.blog + "\n";
  message += "email : " + user.email + "\n";
  message += "bio : " + user.bio + "\n";
  message += "public_repos : " + user.public_repos + "\n";
  message += "followers : " + user.followers + "\n";
  message += "following : " + user.following + "\n";
  message += "created_at : " + user.created_at + "\n";
  panel.textContent = message;
}

/**
 * Show an error message to user
 */
function afficheErreur(message) {
  panel.textContent = message;
}



/**
 * Find a user's speudo on github and show infos.
 */
function cherche() {
  var url;
  var req = new XMLHttpRequest();
  
  var speudo = input.value;
  if(!speudo) {
    speudo = "thaddeus002";
  }
  url = baseUrl + "/" + speudo;
  
  req.open('GET', url);
  req.onload = function() {
    if(this.status<200 || this.status>=300) {
      var errMessage = JSON.parse(this.responseText).message;
      afficheErreur("Server send error "+this.status+ " : " + errMessage);
      return;
    }
    var data = JSON.parse(this.responseText);
    afficheUser(data);
  };
  req.send();
}


bouton.addEventListener("click", cherche);

console.log("page loaded");

