const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/event");
const User = require("./models/user");

const app = express();
app.use(bodyParser.json());

const EVENTS = [];

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      email: String!
      password: String
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
      user: User
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation 
    }
  `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(resp => {
            return resp.map(event => {
              return { ...event._doc, _id: event.id };
            });
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date().toISOString()
        });

        return event
          .save()
          .then(res => {
            return { ...res._doc, _id: event.id };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
      createUser: args => {}
    },
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-bsjtx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(res => {
    app.listen(3000, (req, res) => console.log("Running on port 3000"));
  })
  .catch(err => {
    console.log(err);
  });
