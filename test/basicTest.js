"use strict";
let test = require("tape");

test("Hello World: hello should greet the world", function(t) {
    let hello = "world";
    t.equal(hello, "world");
    t.end();
});

test("List has zero length when no items added", function(t) {
    let item = {itemName:"1st item name",itemCategory:"1st item cat",itemQuantity:"1st item qty"};
    let List = [];

    let listSize = List.length;
    let expected = 0;

    t.equal(listSize, expected);
    t.end();
});

test("List size increases by 1 when item added", function(t) {
    let item = {itemName:"1st item name",itemCategory:"1st item cat",itemQuantity:"1st item qty"};
    let List = [];

    List.push(item);
    let listSize = List.length;
    let expected = 1;

    t.equal(listSize, expected);
    t.end();
});

test("List size decreases by 1 when item removed", function(t) {
  let item = {itemName:"1st item name",itemCategory:"1st item cat",itemQuantity:"1st item qty"};
  let List = [];
  List.push(item);

  List.splice(0,1);
  let listSize = List.length;
  let expected = 0;

  t.equal(listSize, expected);
  t.end();
});

// Test JSON parsing
test("Item name can be parsed", function(t) {
  let itemSent = '{"itemName":"1st item name","itemCategory":"1st item cat","itemQuantity":"1st item qty"}';
  let parsedItem = JSON.parse(itemSent);
  let List = [];
  List.push(parsedItem);

  let parsedName = List[0].itemName;
  let expected = "1st item name";

  t.equal(parsedName, expected);
  t.end();
});

test("Item category can be parsed", function(t) {
  let itemSent = '{"itemName":"1st item name","itemCategory":"1st item cat","itemQuantity":"1st item qty"}';
  let parsedItem = JSON.parse(itemSent);
  let List = [];
  List.push(parsedItem);

  let parsedCategory = List[0].itemCategory;
  let expected = "1st item cat";

  t.equal(parsedCategory, expected);
  t.end();
});

test("Item quantity can be parsed", function(t) {
  let itemSent = '{"itemName":"1st item name","itemCategory":"1st item cat","itemQuantity":"1st item qty"}';
  let parsedItem = JSON.parse(itemSent);
  let List = [];
  List.push(parsedItem);

  let parsedQuantity = List[0].itemQuantity;
  let expected = "1st item qty";

  t.equal(parsedQuantity, expected);
  t.end();
});

test("List size increases if another item JSON object is added", function(t) {
  let itemSent = '[{"itemName":"1st item name","itemCategory":"1st item cat","itemQuantity":"1st item qty"},\
                  {"itemName":"2nd item name","itemCategory":"2nd item cat","itemQuantity":"2nd item qty"}]';
  let parsedItem = JSON.parse(itemSent);
  let List = parsedItem;
  let listSize = List.length;
  let expected = 2;

  t.equal(listSize,expected);
  t.end();
});

test("List size decreases if an item JSON object is removed", function(t) {
  let itemSent = '[{"itemName":"1st item name","itemCategory":"1st item cat","itemQuantity":"1st item qty"},\
                  {"itemName":"2nd item name","itemCategory":"2nd item cat","itemQuantity":"2nd item qty"}]';
  let parsedItem = JSON.parse(itemSent);
  let List = parsedItem;

  //Remove item 2
  List.splice(1,1);
  let listSize = List.length;
  let expected = 1;

  t.equal(listSize,expected);
  t.end();
});

test("Item attributes can be parsed for multiple items", function(t) {
  let itemSent = '[{"itemName":"1st item name","itemCategory":"1st item cat","itemQuantity":"1st item qty"},\
                  {"itemName":"2nd item name","itemCategory":"2nd item cat","itemQuantity":"2nd item qty"}]';
  let parsedItem = JSON.parse(itemSent);
  let List = parsedItem;

  let parsedName1 = List[0].itemName;
  let parsedName2 = List[1].itemName;

  t.notEqual(parsedName1,parsedName2);
  t.end();
});

//Tests for multiple lists
test("List name can be parsed", function(t) {
  let itemSent = '[{"listName":"List 1","itemName":"1st item name","itemCategory":"1st item cat","itemQuantity":"1st item qty"}]';
  let parsedItem = JSON.parse(itemSent);
  let List = parsedItem;

  let listName = List[0].listName;
  let expected = "List 1";

  t.equal(listName,expected);
  t.end();
});

test("List names can be parsed for mulitple items", function(t) {
  let itemSent = '[{"listName":"List 1","itemName":"1st item name","itemCategory":"1st item cat","itemQuantity":"1st item qty"},\
                  {"listName":"List 1","itemName":"2nd item name","itemCategory":"2nd item cat","itemQuantity":"2nd item qty"}]';
  let parsedItem = JSON.parse(itemSent);
  let List = parsedItem;

  let listName1 = List[0].listName;
  let listName2 = List[1].listName;

  t.equal(listName1,listName2);
  t.end();
});

test("Multiple List names can be parsed for mulitple items", function(t) {
  let itemSent = '[{"listName":"List 1","itemName":"1st item name","itemCategory":"1st item cat","itemQuantity":"1st item qty"},\
                  {"listName":"List 2","itemName":"2nd item name","itemCategory":"2nd item cat","itemQuantity":"2nd item qty"}]';
  let parsedItem = JSON.parse(itemSent);
  let List = parsedItem;

  let listName1 = List[0].listName;
  let listName2 = List[1].listName;

  t.notEqual(listName1,listName2);
  t.end();
});

test("List lookup table stores unique list names only", function(t) {
  let itemSent = '[{"listName":"List 1","itemName":"1st item name","itemCategory":"1st item cat","itemQuantity":"1st item qty"},\
                  {"listName":"List 1","itemName":"2nd item name","itemCategory":"2nd item cat","itemQuantity":"2nd item qty"},\
                  {"listName":"List 2","itemName":"3rd item name","itemCategory":"3rd item cat","itemQuantity":"3rd item qty"}]';
  let parsedItem = JSON.parse(itemSent);
  let List = parsedItem;
  let listLookup = [];

  for (var x in List) {
    if (listLookup.includes(List[x].listName) == false){
      listLookup.push(List[x].listName);}}

  let numberOfLists = listLookup.length;
  let expected = 2; //Only two unique lists exist

  t.equal(numberOfLists,expected);
  t.end();
});
