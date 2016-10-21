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
  var link = document.createElement("a");
  var pic = 0; // personal infos count
  // personal infos
  var pis = [ "name", "company", "location", "blog", "email", "bio" ]; 
  var pi;
  
  message += "------------------------------------------------\n";
  message += "login        : ";
  
  panel.textContent = message;
  
  link.href = user.html_url;
  link.textContent = user.login;
  panel.appendChild(link);
  
  message = "\n";
  message += "joined on    : " + user.created_at + "\n";
  message += "------------------------------------------------\n";
  
  for(pi in pis) {
    console.log(pi, pis[pi]);
    if(user[pis[pi]]) {
      var prop = pis[pi];
      while(prop.length < 13) { prop += " "; }
      message += prop + ": " + user[pis[pi]] + "\n";
      pic++;
    }
  }
  /*message += "name         : " + user.name + "\n";
  message += "company      : " + user.company + "\n";
  message += "location     : " + user.location + "\n";
  message += "blog         : " + user.blog + "\n";
  message += "email        : " + user.email + "\n";
  message += "bio          : " + user.bio + "\n";*/
  if(pic) {
    message += "-----------------------------------------------\n";
  }
  
  message += "public repos : " + user.public_repos + "\n";
  message += "followers    : " + user.followers + "\n";
  message += "following    : " + user.following + " \n";
  
  panel.appendChild(document.createTextNode(message));
}

/**
 * Show an error message to user
 */
function showInPanel(message) {
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
      showInPanel("Server send error "+this.status+ " : " + errMessage);
      return;
    }
    showInPanel("Parsing server's response...");
    var data = JSON.parse(this.responseText);
    afficheUser(data);
  };
  
  showInPanel("Sending request...");
  req.send();
}

bouton.addEventListener("click", cherche);

console.log("page loaded");

