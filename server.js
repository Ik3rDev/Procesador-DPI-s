import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.post('/api/analizar-dpi', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No se envió ninguna imagen.' });
    }

    const response = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b", // Modelo activo en Groq con soporte de visión
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Eres un asistente experto en extracción de datos de documentos de identificación (DPI de Guatemala). 
Analiza la imagen enviada y responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "cui": "número de 13 dígitos sin espacios ni guiones",
  "nombre": "NOMBRES Y APELLIDOS COMPLETOS"
}`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extrae el CUI y el nombre completo de este DPI." },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ]
    });

    const resultadoJson = JSON.parse(response.choices[0].message.content);
    res.json(resultadoJson);

  } catch (error) {
    console.error('Error al conectar con Groq:', error);
    res.status(500).json({ 
      error: 'Fallo al procesar la imagen con Groq.',
      detalle: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${3000}`);
});