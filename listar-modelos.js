import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY // Asegúrate de tener tu GROQ_API_KEY en el archivo .env
});

async function listarModelos() {
  try {
    const response = await groq.models.list();
    
    console.log('--- MODELOS DISPONIBLES EN TU CUENTA DE GROQ ---');
    response.data.forEach(model => {
      console.log(`- ${model.id}`);
    });
    console.log('------------------------------------------------');

  } catch (error) {
    console.error('Error al obtener la lista de modelos:', error.message);
  }
}

listarModelos();