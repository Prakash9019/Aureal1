const express = require('express');
const app = express();
const PORT=5000;
app.use(express.json());
const mongoose = require('mongoose');

// Connect to your MongoDB server (replace with your actual connection string)
mongoose.connect('mongodb://localhost:27017/wild_animals_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the animal schema
const animalSchema = new mongoose.Schema({
  name: String,
  species: String,
  average_lifespan: Number,
  description: String,
  type: String,
});

// Create a model based on the schema
const Animal = mongoose.model('Animal', animalSchema);


app.get('/',(req,res)=>{
    res.json("hello");
})


app.listen(PORT, () => {
    console.log(`Todolist listening at http://localhost:${PORT}`);
})

// Create a new animal
app.post('/animal', async (req, res) => {
  try {
    const newAnimal = new Animal(req.body);
    console.log(newAnimal);
    await newAnimal.save();
    res.status(201).json(newAnimal);
  } catch (error) {
    console.error('Error creating animal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get a specific animal by ID
app.get('/animal', async (req, res) => {
  try {
    const h = await Animal.find();
    if (!h) {
      return res.status(404).json({ error: 'animals not found' });
    }
    res.status(200).json(h);
  } catch (error) {
    console.error('Error fetching animal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a animal by ID
app.put('/animal/:id', async (req, res) => {
    try {
      const updatedData = req.body; 
      const updatedAnimal = await Animal.findOneAndUpdate(
        {_id: req.params.id},
        { $set: updatedData },
        { new: true } 
      );
      if (!updatedAnimal) {
        return res.status(404).json({ error: 'animal not found' });
      }
  
      res.status(200).json(updatedAnimal);
    } catch (error) {
      console.error('Error updating animal:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Delete a animal by ID
app.delete('/animal/:id', async (req, res) => {
    try {
      const deletedAnimal = await Animal.findOneAndDelete({_id: req.params.id});
  
      if (!deletedAnimal) {
        return res.status(404).json({ error: 'animal not found' });
      }
  
      res.status(200).json({ message: 'animal deleted successfully' });
    } catch (error) {
      console.error('Error deleting animal:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  