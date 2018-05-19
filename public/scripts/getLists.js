var availableLists = [];

//Get Currently Logged In User
let userReq = new XMLHttpRequest();
var currentUser = "";
userReq.open('GET', '/getUser', true);
userReq.onload = function() {
  if (userReq.status == 200 && userReq.readyState == 4) {
    currentUser = userReq.responseText;
    document.getElementById("welcomeDisplay").innerHTML = "Welcome, " + userReq.responseText;
  }
}
userReq.send();

//Get Available Lists
let availListsReq = new XMLHttpRequest();
availListsReq.open('GET', '/getAvailableLists', true);
availListsReq.onload = function() {
  if (availListsReq.status == 200 && availListsReq.readyState == 4) {
    availableLists = JSON.parse(availListsReq.responseText);
  }
}
availListsReq.send();

//Get and Display List Of Lists
let listrequest = new XMLHttpRequest();
listrequest.open('GET', '/showlist', true);
listrequest.onload = function() {
  if (listrequest.status == 200 && listrequest.readyState == 4) {
    //let nameList = document.getElementById('myList');
    let newItem = JSON.parse(listrequest.responseText);
    //ADMIN CONDITION - Admin gets all lists (helps make list sharing easier)
    if (currentUser == "admin") {
      var allLists = [];
      //get all lists
      for (i in newItem) {
        allLists.push(newItem[i].listName);
      }
      availableLists = allLists;
    }
    for (y in availableLists) {
      //Create new row for item
      let tr = document.createElement("tr");
      //tr.id += "item"+String(x);
      document.getElementById("myLists").appendChild(tr);

      //Create new table cell for item name/category/qty
      let liName = document.createElement("TD");
      let liTextName = document.createTextNode(availableLists[y]);

      // Append text to list item and list item to list
      liName.appendChild(liTextName);
      tr.appendChild(liName);

      //Deletion and Sharing of Lists
      var delButton = document.createElement("BUTTON");
      delButton.id = String(availableLists[y]);
      delButton.className = "btn";
      //When delete button clicked, send get req to delete item (with item name appended)
      delButton.onclick = function() {
        let delRequest = new XMLHttpRequest();
        delRequest.open('GET', '/list/deleteList/' + String(this.id), true);
        delRequest.send();
        delRequest.onload = function() {
          if (delRequest.status == 200 && delRequest.readyState == 4) {
            var rowID = parseInt(delRequest.responseText);
            //Delete row in html (item already deleted from List[])
            document.getElementById("myList").deleteRow(rowID);
          }
        }
      }
      // Create a text node
      var delText = document.createTextNode("X");
      delButton.appendChild(delText);
      // Append delete button to row
      tr.appendChild(delButton);
    }
  }
}
listrequest.send();