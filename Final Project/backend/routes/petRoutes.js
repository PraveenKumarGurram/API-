
const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');

// GET all pets
router.get('/', async (req, res) => {
  const pets = await Pet.find();
  res.json(pets);
});

// POST a new pet
router.post('/', async (req, res) => {
  const pet = new Pet(req.body);
  await pet.save();
  res.json(pet);
});

// PUT - Replace entire pet information
router.put('/:id', async (req, res) => {
  const replacedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true, overwrite: true });
  res.json(replacedPet);
});

// PATCH - Update partial pet information
router.patch('/:id', async (req, res) => {
  const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedPet);
});

// DELETE a pet
router.delete('/:id', async (req, res) => {
  await Pet.findByIdAndDelete(req.params.id);
  res.json({ message: 'Pet deleted' });
});

module.exports = router;
