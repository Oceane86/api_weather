// Gère la création et la récupération des sessions, communique avec les APIs OpenWeather
import dotenv from 'dotenv';

import moment from 'moment-timezone';
import Session from '../models/sessionModel.js';
import { fetchWeatherData } from '../services/weatherService.js';

dotenv.config({ path: '../.env' });
export const createSession = async (req, res) => {
    const { email, lat, lng, timezone } = req.body;

    if (!timezone) {
        return res.status(401).json({ error: "Timezone is missing" });
    }
    try {
        // Recherche la dernière session créée pour cet utilisateur dans l'intervalle de dix minutes
        const tenMinutesAgo = moment().subtract(10, 'minute');
        const existingSession = await Session.findOne({ email, createdAt: { $gte: tenMinutesAgo } });

        if (existingSession) {
            // Si une session récente existe, renvoyer cette session
            console.log("Session existante trouvée :", existingSession);
            return res.status(200).json(existingSession);
        }

        // Appel au service météo pour enrichir les données
        const weatherData = await fetchWeatherData(lat, lng);
        const currentDate = moment().tz(timezone);
        const formattedDate = currentDate.format('DD/MM/YYYY');
        const formattedTime = currentDate.format('HH[h]:mm');

        const newSession = new Session({
            email,
            lat,
            lng,
            date: formattedDate,
            time: formattedTime,
            name: weatherData.name,
            temperature: weatherData.temperature,
            weather: weatherData.weather,
            weatherIcon: weatherData.icon,
            humidity: weatherData.humidity,
            wind: {
                speed: weatherData.wind.speed, 
                deg: weatherData.wind.deg,     
                gust: weatherData.wind.gust    
            },
        });
        await newSession.save();

        console.log("Nouvelle session créée :", newSession);
        res.status(201).json(newSession);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Dans votre contrôleur Node.js
export const getLatestSession = async (req, res) => {
    const { email } = req.query; // Récupérer l'e-mail depuis la requête
    try {
        // Recherche la dernière session dans la base de données pour l'e-mail spécifié
        const latestSession = await Session.findOne({ email }).sort({ createdAt: -1 });

        if (!latestSession) {
            return res.status(404).json({ message: "Aucune session trouvée pour cet e-mail" });
        }

        res.status(200).json(latestSession);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getUserSessions = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const userSessions = await Session.find({ email }).sort({ createdAt: -1 });
        res.status(200).json(userSessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}