# paranoia-server
Endpoints:
- POST /new-room
  - Body:
    {
      "userId": "JOHN"
    }
  - Will create a new room and imput the name given as the creator of the room. 
  - Returns:
    {
      "data": {
		    "roomId": "Random 4 letter/digit code"
	    }
    }

- POST /new-player
  - Body:
    {
      "userId": "JOHN",
      "roomId": "Random 4 letter/digit code"
    }
  - Will add the name given to the list of users in the room specified if the name is unique and the room exists. 
  - Returns:
    {
      "data": {
		    "roomId": "Random 4 letter/digit code"
	    }
    }
    
- GET /users/:roomId
  - Will return all of the users in the specified room and their info if the room exists. 
  - Returns:
    {
      "data": {
        "users": [
          {
            "name": "LIAM",
            "creator": true
          },
          {
            "name": "ROSA",
            "creator": false
          },
          {
            "name": "TIFF",
            "creator": false
          }
		    ]
	    }
    }

- POST /new-question
  - Body:
    {
      "roomCode": "4 letter/digit code",
      "askerId": "TIFF",
      "victimId": "LIAM",
      "message": "Who is the most likely to get married first?",
      "answer": "ROSA",
      "shown": true
    }
  - Will add the question to the specified room if the room exists. It will return the question key that the room identifies it with.
  - Returns:
    {
      "data": {
		    "questionKey": 0
	    }
    }

- DELETE /room
  - Body:
    {
      "roomCode": "4 letter/digit code"
    }
  - Will delete the room along with all of the questions and users in it.
  - Returns:
    {
      "msg": "Room deleted"
    }
