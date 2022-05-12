require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("body", (req) => JSON.stringify(req.body));

const cors = require("cors");
const Person = require("./models/phonebook");
const phonebook = require("./models/phonebook");

app.use(express.json());
app.use(express.static("build"));
app.use(morgan("tiny"));
app.use(cors());

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  // if (error.name === "CastError") {
  //   return response.status(400).send({ error: "malformatted id" });
  // }

  // next(error);

  next(error);

  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: "malformatted id" });
      break;
    case "ParallelSaveError":
      return response
        .status(409)
        .send({ error: "the instance of this document is already saving" });
      break;

    case "MongooseError":
      return response
        .status(500)
        .send({ error: "generic Mongoose error happened" });
      break;
    default:
      return response.status(500).send({ error: "generic error happened" });
  }
};

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  // const id = Number(request.params.id);
  // const person = persons.find((person) => person.id === id);
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    // .catch((error) => {
    //   console.log(error);
    // response.status(400).send({ error: "malformatted id" });
    // });
    .catch((error) => next(error));
});

app.get("/api/info", (request, response) => {
  Person.estimatedDocumentCount((err, count) => {
    response.send(
      `<h3>Persons has info for ${count} people.</h3>
        ${new Date()}
        `
    );
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// const generateId = () => {
//   const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

app.post("/api/persons", morgan(":body"), (request, response) => {
  const body = request.body;
  // const existingNames = persons.map((person) => (names = person.name));
  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  });

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name and/or number missing",
    });
    // } else if (existingNames.includes(body.name)) {
    //   return response.status(400).json({
    //     error: "Person already exists",
    //   });
  }

  app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const person = {
      name: body.name,
      number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then((updatedPerson) => {
        response.json(updatedPerson);
      })
      .catch((error) => next(error));
  });

  // persons = persons.concat(person);

  person.save().then((savedPerson) => {
    response.json(savedPerson).catch((error) => next(error));
  });
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
