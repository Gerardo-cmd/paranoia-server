import fetch from "node-fetch";
import express from 'express';
import cors from 'cors';
import fs from "fs";
import path from 'path';
import admin from 'firebase-admin';
import { createRequire } from "module";
import generateCode from "./utils/generateCode.js";

const require = createRequire(import.meta.url);
const app = express();

// Use express's body parser for post requests
app.use(express.json());

// Activate cors
app.use(cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET, POST', 'DELETE'],
    optionsSuccessStatus: 200
}));

// Firebase starter code
let serviceAccount;
if (fs.existsSync('./secrets/paranoia-server-57ac8-firebase-adminsdk-7wleu-eb85bc2b78.json')) {
    serviceAccount = require('./secrets/paranoia-server-57ac8-firebase-adminsdk-7wleu-eb85bc2b78.json');
} else {
    serviceAccount = JSON.parse(process.env.PARANOIA_FIREBASE_KEY);
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Endpoints start below

app.get('/', (req, res) => {
  res.send({
    "code": 200,
    "msg": "Connected"
  });
});

// ROOM ENDPOINTS

// Create a new room and returns the room code
app.post('/new-room', async (req, res) => {
  if (!req.body.userId) {
    res.send({
      "code": 400,
      "data": "Must include all necessary info!"
    });
    return;
  }
  let unique = false;
  let roomCode = "";
  while (!unique) {
    roomCode = generateCode();
    const docRefTest = await db.collection('rooms').doc(`${roomCode}`).get();
    if (!docRefTest.exists) {
      unique = true;
    }
  }
  const usersRef = db.collection(`${roomCode}-Users`).doc(`${req.body.userId}`);
  const roomRef = db.collection('rooms').doc(`${roomCode}`);
  const newRoom = {
    questions: {},
    answers: {}
  }

  const setUser = await usersRef.set({creator: true});
  const setBody =  await roomRef.set(newRoom);
  res.send({
    "code": 200,
    "data": roomCode
  });
  return;
});

// Adds a user to an existing room and returns room code
app.post('/new-player', async (req, res) => {
  if (!req.body.userId || !req.body.roomCode ) {
    res.send({
      "code": 400,
      "data": "Must include both user ID and room code!"
    });
    return;
  }
  const roomRef = await db.collection('rooms').doc(`${req.body.roomCode}`).get();
  if (!roomRef.exists) {
    res.send({
      "code": 401,
      "msg": "No room was found with that code"
    });
    return;
  }
  const userRefTest = await db.collection(`${req.body.roomCode}-Users`).doc(`${req.body.userId}`).get();
  if (userRefTest.exists) {
    res.send({
      "code": 402,
      "msg": "There is already a user with that name in the room"
    });
    return;
  }
  const userRef = await db.collection(`${req.body.roomCode}-Users`).doc(`${req.body.userId}`).set({creator: false});
  res.send({
    "code": 200,
    "data": {
      roomCode: req.body.roomCode,
      name: req.body.userId
    }
  });
  return;
});

// Deletes a room **ONLY DELETES ROOM NOT THE "ROOM-USERS COLLECTION** Will work on that later"
app.delete('/room', async (req, res) => {
  if (!req.body.roomCode) {
    res.send({
      "code": 400,
      "msg": "Must include the room code"
    });
    return;
  }
  const docRef = await db.collection('rooms').doc(`${req.body.roomCode}`).get();
  if (!docRef.exists) {
    res.send({
      "code": 401,
      "msg": "No room was found with that code"
    });
    return;
  }
  else {
    const deleteRoom = await db.collection('rooms').doc(`${req.body.roomCode}`).delete();
    res.send({
      "code": 200,
      "msg": "Room deleted"
    });
    return;
  }
});

// QUESTIONS ENDPOINTS

// ANSWER ENDPOINTS

app.listen(process.env.PORT || 5000, () => console.log("server starting on port 5000!"));