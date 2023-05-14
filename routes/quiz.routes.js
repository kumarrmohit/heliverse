const express=require("express")
const cron = require('node-cron');
const {quizModel}=require("../models/quiz.model")
const quizRouter=express.Router()

quizRouter.post('/', async (req, res) => {
    try {
        const quiz = new quizModel(req.body)
        await quiz.save()
        res.send({ "msg": "Quiz created successfully" })
    } catch (err) {
        res.send({ "msg": "cannot register Quiz", "error": err.message })
    }
})


cron.schedule('* * * * *', async () => {
    const now = new Date();
    const activeQuizzes = await quizModel.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
    activeQuizzes.forEach(async (quiz) => {
        quiz.status = 'active';
        await quiz.save();
      });
      const finishedQuizzes = await quizModel.find({
        endDate: { $lt: now },
      });
      finishedQuizzes.forEach(async (quiz) => {
        quiz.status = 'finished';
        await quiz.save();
      });
    });

 quizRouter.get('/active', async (req, res) => {
    try {
      const now = new Date();
      const quiz = await quizModel.findOne({ startDate: { $lte: now }, endDate: { $gt: now }, status: 'active' });
      if (quiz) {
        res.json({ quiz });
      } else {
        res.status(404).json({ message: 'No active quiz found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to retrieve active quiz', error: err.message });
    }
  });

  quizRouter.get('/:id/result', async (req, res) => {
    try {
      const quiz = await quizModel.findById(req.params.id);
      if (quiz && quiz.status === 'finished') {
        res.json({ result: quiz.rightAnswer });
      } else {
        res.status(404).json({ message: 'Quiz not found or result not available' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to retrieve quiz result', error: err.message });
    }
  });

  quizRouter.get('/all', async (req, res) => {
    try {
      const quizzes = await quizModel.find();
      res.json({ quizzes });
    } catch (err) {
      res.status(500).json({ message: 'Failed to retrieve quizzes', error: err.message });
    }
  });

  quizRouter.delete('/:id', async (req, res) => {
    try {
      const quiz = await quizModel.findByIdAndDelete(req.params.id);
      if (quiz) {
        res.json({ message: 'Quiz deleted successfully' });
      } else {
        res.status(404).json({ message: 'Quiz not found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete quiz', error: err.message });
    }
  });

  quizRouter.patch("/:id", async (req, res) => {
    const ID = req.params.id
    //res.send(ID)
    const payload = req.body
    try {
        await quizModel.findByIdAndUpdate({ _id: ID }, payload)
        res.send({ "msg": "quiz has been updated" })
    } catch(err) {
        res.send({ "msg": "cannot modify", "error": err.message })
    }
})

  module.exports={
    quizRouter
  }


