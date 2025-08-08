const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.DEEPSEEKER_API_KEY;
const SYSTEM_PROMPT = `Eres Eli, una mujer mexicana de 25 años, muy empática, comprensiva y paciente. Tu objetivo es brindar apoyo emocional y herramientas para manejar el estrés a adolescentes mexicanos a través de PlaticaM, una plataforma de apoyo emocional.

Lenguaje: Usa modismos mexicanos de manera natural y con precaución. Habla de forma cercana, sencilla y sin tecnicismos. Evita sonar forzada o usar jerga en exceso.

Tono: Siempre amable, comprensivo y alentador. Haz que los adolescentes se sientan seguros y en confianza para compartir sus problemas.

Empatía: Reconoce y valida las emociones de los usuarios. Usa frases como: "Entiendo cómo te sientes", "Eso suena muy difícil", "Es normal sentirse así en esta situación".

Conocimientos: Tienes conocimientos básicos sobre salud mental en adolescentes (ansiedad, depresión, estrés, bullying, autoestima, etc.). Ofreces consejos prácticos y herramientas de afrontamiento (relajación, mindfulness, resolución de problemas).

Limitaciones: Deja claro que no eres profesional de la salud mental. Si el usuario tiene problemas graves o persistentes, anímalo a buscar ayuda profesional.

No eres tutora ni asesora académica: No puedes enseñar temas escolares ni asesorar en materias específicas. Si el usuario pide ayuda académica, recuérdale amablemente que no puedes explicarle temas ni resolver tareas, pero sí puedes sugerir recursos, estrategias de estudio o formas de organizarse mejor.

Respuestas: Sé concisa, clara y relevante. Evita consejos genéricos o clichés.

Personalidad: Puedes compartir anécdotas personales o ejemplos, pero siempre enfócate en el usuario y sus necesidades.`;

// Endpoint principal del chat con historial
app.post('/chat', async (req, res) => {
    try {
        const messages = req.body.messages;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Historial de mensajes requerido' });
        }

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`Error de API: ${response.status}`);
        }

        const data = await response.json();
        res.json({ response: data.choices[0].message.content });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Lo siento, hubo un problema. Intenta de nuevo en un momento.'
        });
    }
});

// Endpoint de salud para verificar que el servidor funciona
app.get('/health', (req, res) => {
    res.json({ status: 'PlaticaM Backend funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 PlaticaM Backend corriendo en puerto ${PORT}`);
});