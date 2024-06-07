import { TodoModel } from "../models/Todo.js";

// Add to do controller:
export const addToDo = async(req, res)=>{
    const userId = req.params.userId
    const {title, description} = req.body;
    try{
        if(!title || !description){
            return res.status(400).json({ msg: "Required fields are missing." });
        }
        const newTodo = new TodoModel({
            userId: userId,
            title,
            description
          });
          await newTodo.save();
          res.status(201).json(newTodo);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

// Get to do controller:
export const getToDo  = async (req, res) => {
    const userId = req.params.userId;
    try {
      const toDos = await TodoModel.find({ userId: userId });
      res.json(toDos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// update to do controller:
export const updateToDo = async (req, res) => {
    const { title, description, completed } = req.body;
    try {
      const todo = await TodoModel.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      console.log(todo.userId.toString())
      if (todo.userId.toString() !== req.body.userId) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      todo.title = title || todo.title;
      todo.description = description || todo.description;
      todo.completed = completed || todo.completed;
      await todo.save();
      res.json(todo);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

export const deleteToDo = async (req, res) => {
  try {
    const todo = await TodoModel.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    if (todo.userId.toString() !== req.body.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await todo.deleteOne();
    res.json({ message: 'Todo removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};