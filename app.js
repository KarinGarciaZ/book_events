const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const app = express();
app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema,
    rootValue: resolvers,
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
