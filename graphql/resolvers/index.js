const Event = require("../../models/event");
const User = require("../../models/user");

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event._doc.creator.id)
      };
    });
  } catch (err) {
    throw err;
  }
};

const resolvers = {
  events: async () => {
    const resp = await Event.find({}).populate("creator");
    return resp.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event._doc.creator.id)
      };
    });
  },
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date().toISOString()
    });

    const res = event.save();
    return { ...res._doc, _id: event.id };
  },
  createUser: args => {}
};

module.exports = resolvers;
