// server/src/controllers/aiController.js
const { askBusinessAI, getGeminiApiKey, getLiveBusinessContext } = require('../services/aiBusinessService');
const { getTelegramToken, restartTelegramBot } = require('../services/telegramBotService');
const pool = require('../config/db');

const askAI = async (req, res) => {
  try {
    const { question, history } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ message: 'Se requiere una pregunta.' });
    }

    const userId = req.user?.id_usuario || req.user?.id || 'web-user';
    const result = await askBusinessAI({ question, history, userId });

    res.json(result);
  } catch (error) {
    console.error('[AIController] Error en askAI:', error);
    res.status(500).json({ 
      message: 'Error procesando la consulta con IA.',
      error: error.message 
    });
  }
};

const getAIStatus = async (req, res) => {
  try {
    const geminiKey = await getGeminiApiKey();
    const telegramToken = await getTelegramToken();
    const context = await getLiveBusinessContext();

    res.json({
      hasGeminiKey: Boolean(geminiKey),
      hasTelegramToken: Boolean(telegramToken),
      model: 'gemini-1.5-flash',
      summary: {
        ventasHoy: context.ventasHoy?.total_facturado || 0,
        cajasAbiertas: (context.cajaHoy?.cajasAbiertas || []).length,
        stockCriticoCount: (context.stockCritico || []).length
      }
    });
  } catch (error) {
    console.error('[AIController] Error en getAIStatus:', error);
    res.status(500).json({ message: 'Error obteniendo estado de la IA.' });
  }
};

const saveAIConfig = async (req, res) => {
  try {
    const { gemini_api_key, telegram_bot_token } = req.body;

    const fields = [];
    const values = [];

    if (gemini_api_key !== undefined) {
      fields.push('gemini_api_key = ?');
      values.push(gemini_api_key.trim());
    }

    if (telegram_bot_token !== undefined) {
      fields.push('telegram_bot_token = ?');
      values.push(telegram_bot_token.trim());
    }

    if (fields.length > 0) {
      values.push(1); // id = 1
      await pool.query(`UPDATE business_config SET ${fields.join(', ')} WHERE id = ?`, values);

      // Si se actualizó el token de Telegram, reiniciar el bot
      if (telegram_bot_token !== undefined) {
        await restartTelegramBot();
      }
    }

    const geminiKey = await getGeminiApiKey();
    const telegramToken = await getTelegramToken();

    res.json({
      message: 'Configuración de IA guardada exitosamente.',
      hasGeminiKey: Boolean(geminiKey),
      hasTelegramToken: Boolean(telegramToken)
    });
  } catch (error) {
    console.error('[AIController] Error en saveAIConfig:', error);
    res.status(500).json({ message: 'Error guardando configuración de IA.' });
  }
};

module.exports = {
  askAI,
  getAIStatus,
  saveAIConfig
};
