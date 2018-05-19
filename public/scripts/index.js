let currentListHere = "";

let Listrequest = new XMLHttpRequest();
Listrequest.open('GET', '/currentlist', true);
Listrequest.onload = function() {
  if (Listrequest.status == 200 && Listrequest.readyState == 4) {
    currentListHere = Listrequest.responseText;
    document.getElementById("listName").innerHTML = currentListHere;  
  }
}
Listrequest.send();

let request = new XMLHttpRequest();
request.open('GET', '/showlist', true);

let requestErrorFunc = function() {
  alert("ERROR: failed to load List");
};

request.onload = function() {
  if (request.status == 200 && request.readyState == 4) {
    //let nameList = document.getElementById('myList');
    let newItem = JSON.parse(request.responseText);

    for (x in newItem) {
      if (newItem[x].listName == currentListHere) {
        for(item in newItem[x].items){
          //Create new row for item
          let tr = document.createElement("tr");
          //tr.id += "item"+String(x);
          document.getElementById("myList").appendChild(tr);

          //Create new table cell for item name/category/qty
          let tdName = document.createElement("TD");
          let tdCategory = document.createElement("TD");
          let tdQuantity = document.createElement("TD");
          let tdTextName = document.createTextNode(newItem[x].items[item].itemName);
          let tdTextCategory = document.createTextNode(newItem[x].items[item].itemCategory);
          let tdTextQuantity = document.createTextNode(newItem[x].items[item].itemQuantity);

          // Append text to list item and list item to list
          tdName.appendChild(tdTextName);
          tdCategory.appendChild(tdTextCategory);
          tdQuantity.appendChild(tdTextQuantity);
          tr.appendChild(tdName);
          tr.appendChild(tdCategory);
          tr.appendChild(tdQuantity);

          // Create a <button> element
          var delButton = document.createElement("BUTTON");
          delButton.id = String(newItem[x].items[item].itemName);
          delButton.className = "btn";
          //When delete button clicked, send get req to delete item (with item name appended)
          delButton.onclick = function() {
            let delRequest = new XMLHttpRequest();
            delRequest.open('GET', '/list/delete/' + String(this.id), true);
            delRequest.send();
            delRequest.onload = function() {
              if (delRequest.status == 200 && delRequest.readyState == 4) {
                var rowID = parseInt(delRequest.responseText);
                //Delete row in html (item already deleted from List[])
                document.getElementById("myList").deleteRow(rowID + 1);
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
  } else {
    requestErrorFunc();
  }
};

request.onerror = requestErrorFunc;
request.send();