const mongoose = require("mongoose");
import Counter from './counter';

const EventSchema = mongoose.Schema(
    {
    eventname: {
        type: String,
        required: true,
    },
    city:{
        type: Array,
        "default" : [],
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    tags:{
        type: Array,
        "default" : [],
        required: false,
    },
    VIPprice:{
        type: Number,
        required: true,
    },
    GAprice:{
        type: Number,
        required: true,
    },
    slots:[{
        Date: {
            type: Date,
            default: Date.now,
            required: true,
        },
        startTime: {
            type: Date,
            default: Date.now,
            required: true,
        },
        endTime: {
            type: Date,
            default: Date.now,
            required: true,
        },
        VIPtickets: {
            type: Number,
            required: true,
        },
        GATickets: {
            type: Number,
            required: true,
        },
        availVIPTick: {
            type: Number,
            required: true,
        },
        availGATick: {
            type: Number,
            required: true,
        }, 
        maxTicket: {
            type: Number,
            required: true,
        },
        imageURL: {
            type: Schema.Types.Mixed,
            required: false,
        }

    }]
},
{ timestamps: true }
)

eventSchema.pre('save', function (next) {
    var event = this;
    if (!event.isNew) {
      next();
    }
    Counter.count({}).then(count => {
      if (count === 0) {
        Counter.create({
          _id: 'entity',
          value: 1000
        }).then(result => {
          event.eventname = result.value;
          next();
        });
      } else {
        Counter.findOneAndUpdate(
          { _id: 'entity' },
          { $inc: { value: 1 } },
          { new: true }).then(result => {
            event.eventname = result.value;
            next();
          });
      }
    });
  });
  

const Event = mongoose.model('Event', EventSchema)

module.exports = Event