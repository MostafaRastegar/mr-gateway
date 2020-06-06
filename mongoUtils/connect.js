// const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dotenv = require("dotenv");
dotenv.config();
const { ACCESS_TOKEN, DB_URL, DB_NAME } = process.env;

const mrConnect = (callFunc) => {
  MongoClient.connect(DB_URL, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(DB_NAME);
    callFunc(db);
    client.close();
  });
}

module.exports.mrConnect = mrConnect;
