const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

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

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation 
    }
  `),
    rootValue: {
      events: () => {
        return EVENTS;
      },
      createEvent: args => {
        const event = {
          _id: Math.floor(Math.random() * 100).toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date().toISOString()
        };

        EVENTS.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-bsjtx.mongodb.net/test?retryWrites=true&w=majority`
  )
  .then(res => {
    app.listen(3000, (req, res) => console.log("Running on port 3000"));
  })
  .catch(err => {
    console.log(err);
  });
