const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
mongoose.connect(url)
    .then(result => {
        console.log("connected to DB");
    })
.catch((error) => {
    console.log(error.message);
});

const personSchema = new mongoose.Schema({
    name: {
      type: String, 
      required: true
    },
    number: {
      type: String,
      required: true
    }
});

const Person = mongoose.model('Person', personSchema);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);
