const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
dotenv.config();
const { ACCESS_TOKEN, DB_URL } = process.env;
const url = "mongodb://localhost:27017";
const dbName = "test";

const mrConnect = (call) => {
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    call(db);
    client.close();
  });
}

module.exports.mrConnect = mrConnect;
