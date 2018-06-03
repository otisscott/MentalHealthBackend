const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const csv = require("fast-csv");
const ObjectID = mongodb.ObjectID;
const twilio = require("twilio");

//MentalHealth Collections
const MENTALHEALTHUSERS = "mentalhealthusers";
//MethPain Collections
const METHPAINUSERS = "methpainusers";
//CoEducate Collections
const COEDUCATEUSERS = "codeucateusers";
const COEDUCATECALENDAR = "codeucatecalendar";
const COEDUCATERESOURCES = "coeducateresources";
//Veggie Gang Collections
const VEGGIEGANGUSERS = "veggiegangusers";
//Berkeley Eats Collections
const BERKELEYEATSUSERS = "berkeleyeatsusers";
const BERKELEYEATSORDERS = "berkeleyeatsorders";
const BERKELEYEATSTEXTS = "berkeleyeatstexts";
//FloofBunny Collections
const FLOOFBUNNYUSERS = "floofbunnyusers";
const FLOOFBUNNY = "floofbunny";

const app = express();
app.use(bodyParser.json());

let db;

const connectString = "mongodb://otisscott:mrholstonbulliesme@ds125896.mlab.com:25896/heroku_j1dpz4jk";

mongodb.MongoClient.connect(connectString, (err, database) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  db = database;
  console.log("Database connection ready");
  // Initialize the app.
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log("App now running on port", port);
  });
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
// Mental Health App Backend Stuff
app.get("/mentalhealthapp/api/users/:email", (req, res, next) => {
  db.collection(MENTALHEALTHUSERS).findOne({email: req.params.email}, (err, doc) => {
    if (err) {
      handleError(res, err.message, "That is not a valid user email");
    } else {
      res.status(200).json(doc);
    }
  })
});

app.post("/mentalhealthapp/api/users", (req, res, next) => {
  const newUser = req.body;
  newUser.createDate = new Date();


  db.collection(MENTALHEALTHUSERS).insertOne(newUser, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new user.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
})

app.put("/mentalhealthapp/api/users/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(MENTALHEALTHUSERS).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

//CoEducate Backend Stuff
app.get("/coeducate/api/users/:email", (req, res, next) => {
  db.collection(COEDUCATEUSERS).findOne({email: req.params.email}, (err, doc) => {
    if (err) {
      handleError(res, err.message, "That is not a valid user email");
    } else {
      res.status(200).json(doc);
    }
  })
});

app.post("/coeducate/api/users", (req, res, next) => {
  const newUser = req.body;
  newUser.createDate = new Date();

  db.collection(COEDUCATEUSERS).insertOne(newUser, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new user.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
})

app.put("/coeducate/api/users/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(COEDUCATEUSERS).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.post("/coeducate/api/calendar", (req, res, next) => {
  const newCalendar = req.body;
  newCalendar.createDate = new Date();

  db.collection(COEDUCATEUSERS).insertOne(newCalendar, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new calendar.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
})

app.get("/coeducate/api/calendar/:id", (req, res, next) => {
  db.collection(COEDUCATECALENDAR).findOne({studentid: req.params.id}, (err, doc) => {
    if (err) {
      handleError(res, err.message, "That is not a valid ID");
    } else {
      res.status(200).json(doc);
    }
  })
});

app.put("/coeducate/api/calendar/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(COEDUCATECALENDAR).updateOne({studentid: req.params.id}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.post("/coeducate/api/resources", (req, res, next) => {
  const newResources = req.body;
  newCalendar.createDate = new Date();

  db.collection(COEDUCATERESOURCES).insertOne(newCalendar, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new calendar.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.get("/coeducate/api/resources", (req, res, next) => {
  db.collection(COEDUCATERESOURCES).find({}).toArray((err, docs) => {
    if (err) {
      handleError(res, err.message, "Failed to get roasts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

//MethPain Backend Stuff
app.get("/methpain/api/users/:email", (req, res, next) => {
  db.collection(METHPAINUSERS).findOne({email: req.params.email}, (err, doc) => {
    if (err) {
      handleError(res, err.message, "That is not a valid user email");
    } else {
      res.status(200).json(doc);
    }
  })
});

app.post("/methpain/api/users", (req, res, next) => {
  const newUser = req.body;
  newUser.createDate = new Date();

  db.collection(METHPAINUSERS).insertOne(newUser, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new user.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.put("/methpain/api/users/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(METHPAINUSERS).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

//Veggie Gang Backend Stuff
app.get("/veggiegang/api/users/:email", (req, res, next) => {
  db.collection(VEGGIEGANGUSERS).findOne({email: req.params.email}, (err, doc) => {
    if (err) {
      handleError(res, err.message, "That is not a valid user email");
    } else {
      res.status(200).json(doc);
    }
  })
});

app.post("/veggiegang/api/users", (req, res, next) => {
  const newUser = req.body;
  newUser.createDate = new Date();

  db.collection(VEGGIEGANGUSERS).insertOne(newUser, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new user.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.put("/veggiegang/api/users/:id", function(req, res) {
  let updateDoc = req.body;
  delete updateDoc._id;

  db.collection(VEGGIEGANGUSERS).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

//Berkeley Eats Backend Stuff
app.get("/berkeleyeats/api/users/:email", (req, res, next) => {
  db.collection(BERKELEYEATSUSERS).findOne({email: req.params.email}, (err, doc) => {
    if (err) {
      handleError(res, err.message, "That is not a valid user email");
    } else {
      res.status(200).json(doc);
    }
  })
});

app.post("/berkeleyeats/api/users", (req, res, next) => {
  const newUser = req.body;
  newUser.createDate = new Date();

  db.collection(BERKELEYEATSUSERS).insertOne(newUser, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new user.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.put("/berkeleyeats/api/users/:id", function(req, res) {
  let updateDoc = req.body;
  delete updateDoc._id;

  db.collection(BERKELEYEATSUSERS).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.get("/berkeleyeats/api/orders/:id", (req, res, next) => {
  db.collection(BERKELEYEATSORDERS).findOne({_id: new ObjectID(req.params.id)}, (err, doc) => {
    if (err) {
      handleError(res, err.message, "That is not a valid user email");
    } else {
      res.status(200).json(doc);
    }
  })
});

app.get("/berkeleyeats/api/orders", (req, res, next) => {
  db.collection(BERKELEYEATSORDERS).find({}).toArray((err, docs) => {
    if (err) {
      handleError(res, err.message, "Failed to get roasts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/berkeleyeats/api/orders", (req, res, next) => {
  const newOrder = req.body;
  newOrder.createDate = new Date();

  db.collection(BERKELEYEATSORDERS).insertOne(newOrder, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new order.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.put("/berkeleyeats/api/orders/:id", function(req, res) {
  let updateDoc = req.body;
  delete updateDoc._id;

  db.collection(BERKELEYEATSORDERS).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/berkeleyeats/api/orders/:id", (req, res, next) => {
  db.collection(BERKELEYEATSORDERS).deleteOne({_id: new ObjectID(req.params.id)}, (err, result) => {
    if (err) {
      handleError(res, err.message, "Failed to delete order");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});

app.post("/berkeleyeats/api/send", (req, res) => {
    const SID = "AC1ec5c5194591dd5ae9adae846c28693f";
    const TOKEN = "f05fc664aae751c22f2552a0f48de57b";
  
    const client = new twilio(SID, TOKEN);
    const text = req.body;
    text.createDate = new Date();
  
   client.messages.create({
      body: req.note,
      to: '+15106127276',
      from: "+14158518990"
    })
    .then((message) => console.log(client.httpClient.lastResponse.statusCode + " " + message.sid))
    .catch(error => console.log(error));

    db.collection(BERKELEYEATSTEXTS).insertOne(text, (err, doc) => {
      if (err) {
        handleError(res, err.message, "Failed to create new text.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
   
});


//FloofBunny Backend Stuff

app.get("/floofbunny/api/users/:email", (req, res, next) => {
  db.collection(FLOOFBUNNYUSERS).findOne({email: req.params.email}, (err, doc) => {
    if (err) {
      handleError(res, err.message, "That is not a valid user email");
    } else {
      res.status(200).json(doc);
    }
  })
});

app.post("/floofbunny/api/users", (req, res, next) => {
  const newUser = req.body;
  newUser.createDate = new Date();

  db.collection(FLOOFBUNNYUSERS).insertOne(newUser, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new user.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.put("/floofbunny/api/users/:id", function(req, res) {
  let updateDoc = req.body;
  delete updateDoc._id;

  db.collection(FLOOFBUNNYUSERS).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.get("/floofbunny/api/bunnies/:bunName", (req, res, next) => {
  db.collection(FLOOFBUNNY).findOne({bunName: req.params.bunName}, (err, doc) => {
    if (err) {
      handleError(res, err.message, "That is not a valid user email");
    } else {
      res.status(200).json(doc);
    }
  })
});

app.post("/floofbunny/api/bunnies", (req, res, next) => {
  const newUser = req.body;
  newUser.createDate = new Date();

  db.collection(FLOOFBUNNY).insertOne(newUser, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new user.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
})

app.put("/floofbunny/api/bunnies/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(FLOOFBUNNY).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

/*
app.post("/api/students", (req, res, next) => {
  csv
    .fromPath("my.csv")
    .on("data", function(data){
      sub = data[3].split(", ")
      for(let i = 0; i < sub.length; i++) {
        db.collection(TEACHERS_COLLECTION).insertOne({first: data[2], last: data[1], subject: sub[i]}, (err, doc) => {
          if (err) {
            handleError(res, err.message, "Something went wrong");
          } else {
            res.status(201);
          }
        })
      }
    })
    .on("end", function(){
      console.log("done");
    });
});


app.get("/api/teachers", (req, res, next) => {
  db.collection(TEACHERS_COLLECTION).find({}).toArray((err, docs) => {
    if (err) {
      handleError(res, err.message, "Failed to get teachers.");
    } else {
      res.status(200).json(docs);
    }
  });
});



app.post("/api/teachers", (req, res, next) => {
  const newTeacher = req.body;
  newTeacher.createDate = new Date();

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection(TEACHERS_COLLECTION).insertOne(newTeacher, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new teacher.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.get("/api/teachers/:id", (req, res, next) => {
  db.collection(TEACHERS_COLLECTION).findOne({ _id: new ObjectID(req.params.id)}, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to get teacher");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/teachers/:id", (req, res, next) => {
  const updateDoc = req.body;
  delete updateDoc._id;

  db.collection(TEACHERS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to update teacher");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/teachers/:id", (req, res, next) => {
  db.collection(TEACHERS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, (err, result) => {
    if (err) {
      handleError(res, err.message, "Failed to delete teacher");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});

app.get("/api/roasts", (req, res, next) => {
  db.collection(ROAST_COLLECTION).find({}).toArray((err, docs) => {
    if (err) {
      handleError(res, err.message, "Failed to get roasts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/roasts", (req, res, next) => {
  let newRoast = req.body;
  newRoast.createDate = new Date();
  newRoast.toast = swearjar.censor(newRoast.toast);

  db.collection(ROAST_COLLECTION).insertOne(newRoast, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new roast.");
    } else {
      res.status(201).json(doc);
    }
  });
});

app.get("/api/roasts/:teacherid", (req, res, next) => {
  if(req.params.teacherid.length < 7) {
    db.collection(ROAST_COLLECTION).find({from: req.params.teacherid }).toArray((err, doc) => {
      if (err) {
        handleError(res, err.message, "Failed to get roasts for teacher");
      } else {
        res.status(200).json(doc);
      }
    });
  } else {
    db.collection(ROAST_COLLECTION).find({refer: req.params.teacherid }).toArray((err, doc) => {
      if (err) {
        handleError(res, err.message, "Failed to get roasts for teacher");
      } else {
        res.status(200).json(doc);
      }
    });
  }
});

app.delete("/api/roasts/:id", (req, res, next) => {
  db.collection(ROAST_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, (err, result) => {
    if (err)
      handleError(res, err.message, "Failed to delete roast");
    else
      res.status(200).json(req.params.id);
  });
});
*/
//explicate5181*Truces
