/**
 * \file script.js
 * \brief Simple use of Github's API
 */

"use strict";

var input = document.getElementById("pseudo");
var bouton = document.getElementById("pseudoValid");
var panel = document.getElementById("result");
var baseUrl = "https://api.github.com/users";
var avatar = document.getElementById("avatar");

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
    if(user[pis[pi]]) {
      var prop = pis[pi];
      while(prop.length < 13) { prop += " "; }
      message += prop + ": " + user[pis[pi]] + "\n";
      pic++;
    }
  }

  if(pic) {
    message += "-----------------------------------------------\n";
  }

  message += "public repos : " + user.public_repos + "\n";
  message += "followers    : " + user.followers + "\n";
  message += "following    : " + user.following + "\n";

  message += "------------------------------------------------\n";

  panel.appendChild(document.createTextNode(message));

  avatar.src=user.avatar_url;
  avatar.onload = function() {
    console.log("Image loaded");
    this.className = "imgavatar";
  }
}

/**
 * Show an error message to user
 */
function showInPanel(message) {
  panel.textContent = message;
}


/**
 * Add a td or other element to the given parent.
 * \param parent
 * \param content
 * \param type the new element type (by default "td")
 */
function addCell(parent, content, type) {

  var elt;

  if(type == null) {
    elt = document.createElement("td");
  } else {
    elt = document.createElement(type);
  }

  elt.textContent = content;
  parent.appendChild(elt);
}


/**
 * Add a line to a table.
 */
function addLine(table, a, b, c){
  var tr = document.createElement("tr");

  addCell(tr, a);
  addCell(tr, b);
  addCell(tr, c);

  table.appendChild(tr);
}


/**
 * Remove all the content of a node.
 */
function removeChildren(elem) {
  while(elem.lastChild) {
    elem.removeChild(elem.lastChild);
  }
}


/**
 * Create a new HTML element (empty table) to show the repos.
 * And add it to the showing panel.
 * \return the tbody element of the newly created element
 */
function createTable() {
  var table = document.createElement("table");
  var thead, tr, tbody;
  // where put the table
  var repos = document.getElementById("repos");

  //table.className="pretable";
  thead = document.createElement("thead");
  tr = document.createElement("tr");
  table.appendChild(thead);
  thead.appendChild(tr);
  addCell(tr, "Project", "th");
  addCell(tr, "Language", "th");
  addCell(tr, "Number of stars", "th");
  tbody = document.createElement("tbody");
  table.appendChild(tbody);

  removeChildren(repos);
  repos.appendChild(table);
  return tbody;
}



/**
 * Puts the repos' infos in the table.
 * \param data array of repos objects
 */
function creeTableau(data) {

  var n, N;
  var repos;
  var table = createTable();

  for(n=0, N=data.length; n < N; n++) {

    repos = data[n];
    addLine(table, repos.name, repos.language, repos.stargazers_count);
  }
}



/**
 * Request for user's repos.
 */
function repos(url) {

  var req = new XMLHttpRequest();

  req.open('GET', url);
  req.onload = function() {
    if(this.status<200 || this.status>=300) {
      var errMessage = JSON.parse(this.responseText).message;
      console.log("Server send error "+this.status+ " : " + errMessage);
      return;
    }
    console.log("Parsing server's response...");
    var data = JSON.parse(this.responseText);
    creeTableau(data);
  };

  console.log("Sending request on repos...");
  req.send();
}


/**
 * Find a user's pseudo on github and show infos.
 */
function cherche() {
  var url;
  var req = new XMLHttpRequest();
  var pseudo = input.value;

  avatar.className = "hidenavatar";

  if(!pseudo) {
    pseudo = "thaddeus002";
  }
  url = baseUrl + "/" + pseudo;

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
    repos(data.repos_url);
  };

  showInPanel("Sending request...");
  req.send();
}

bouton.addEventListener("click", cherche);

console.log("page loaded");

