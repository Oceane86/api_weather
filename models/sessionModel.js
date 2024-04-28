import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  name: { type: String }, // Champ pour stocker le nom de la ville
  time: { type: String },
  temperature: { type: Number },
  weather: { type: String },
  weatherIcon: { type: String },
  wind: { 
    speed: { type: Number }, // Vitesse du vent
    deg: { type: Number },   // Direction du vent en degrés
    gust: { type: Number }   // Rafales de vent
  },
  humidity: { type: Number },
  date: { type: String}
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
