import mongoose from "mongoose";

const highscoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  time_ms: {
    type: Number,
    required: true,
  },
  guesses: {
    type: Array,
    required: true,
  },
  word_length: {
    type: Number,
    required: true,
  },
  allow_duplicates: {
    type: Boolean,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Highscore = mongoose.model("Highscore", highscoreSchema);

export default Highscore;