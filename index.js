const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/MoneyList', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to the Database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/add", (req, res) => {
    const { category_select, amount_input, info, date_input } = req.body;

    const data = {
        Category: category_select,
        Amount: amount_input,
        Info: info,
        Date: date_input
    };

    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            console.error("Error inserting record:", err);
            return res.status(500).send("Error inserting record");
        }
        console.log("Record Inserted Successfully");
        return res.status(200).json(data);
    });
});

app.get("/data", (req, res) => {
    db.collection('users').find({}).toArray((err, data) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).send("Error fetching data");
        }
        return res.status(200).json(data);
    });
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.collection('users').deleteOne({ _id: ObjectId(id) }, (err, result) => {
        if (err) {
            console.error("Error deleting record:", err);
            return res.status(500).json({ success: false, message: "Error deleting record" });
        }
        return res.status(200).json({ success: true, message: "Record deleted successfully" });
    });
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

app.listen(5000, () => {
    console.log("Listening on port 5000");
});
