'use strict';

const request = require('supertest');
const express = require('express');
const app = express();

app.get('/user', function(req, res) {
  res.status(200).json({"listName":"List 1","items":[{"itemName":"item1","itemCategory":"itemCat","itemQuantity":"itemQty"}]});
});

request(app)
  .get('/user')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '102')
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  });

  app.get('/list/delete/:id', function(req, res) {
    res.status(200).json('{rowID:1}');
  });

  request(app)
    .get('/list/delete/:id')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '11')
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
    });
