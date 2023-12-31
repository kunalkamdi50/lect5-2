const express = require("express");
const mongoose  = require("mongoose");
const Todo = require("./models/TodoSchema");
require("dotenv").config();
const app = express();

app.use(express.json());
const PORT = process.env.PORT;

//POST - Create a Todo
app.post("/todo", async (req, res) => {
    const {title, isCompleted, username } = req.body;

  if(title.length == 0 || isCompleted == null || username.length == 0){
    return res.status(400).send({
        status: 400,
        message: "Please enter the value in correct format!"
    });
  } 
     
  try{
       const todoObj = new Todo({
        title,
        isCompleted,
        username,
        dateTime: new Date(),
       });

       await todoObj.save();

     res.status(201).send({
        status: 201,
        message: "Todo created succcessfully!"
     });
  }catch(err){
     res.status(400).send({
        status: 400,
        message: "Todo creation failed"
    });
  }
});

// GET - Get all todos for a username
// /todos/anurag23
app.get("/todos/:username",  async (req, res) => {
  const username = req.params.username;
 

  try {
    const todoList = await Todo.find({ username }).sort({dateTime: -1});
      
    res.status(200).send({
      status: 200,
      message: "Fetched all todos for a username successfully!",
      data: todoList,
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to fetch all todos for a username!",
      
    });
  }
});

// GET - Get a single Todo
app.get("/todo/:id", (req, res) => {
  const todoId = req.params.id;

  Todo.findById(todoId)
    .then((todoData) => {
      res.status(200).send({
        status: 200,
        message: "Fetched a todo successfully!",
        data: todoData,
      });
    })
    .catch((err) => {
      res.status(400).send({
        status: 400,
        message: "Failed to fetch a single todo using id!",
        data: err,
      });
    });
});


// DELETE - Delete a todo based on id
app.delete("/todo/:id",  async (req, res) => {
  const todoId = req.params.id;

  try {
    await Todo.findByIdAndDelete(todoId);

    res.status(200).send({
      status: 200,
      message: "Deleted a todo successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to delete a todo based on id!",
      data: err,
    });
  }
});

// PATCH - Update a todo
app.patch("/todo",  async (req, res) => {
  const { id, title, isCompleted } = req.body;

  try {
    await Todo.findByIdAndUpdate(id, { title, isCompleted });

    res.status(200).send({
      status: 200,
      message: "Updated a todo successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to update a todo based on id!",
      data: err,
    });
  }
});


mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB is connected!"))
.catch((err) => console.log(err));

app.listen(PORT, ()=>{
    console.log("Server is running at:", PORT);
});