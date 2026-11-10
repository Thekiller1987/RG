import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaCog,
  FaTelegramPlane,
  FaKey,
  FaCheckCircle,
  FaChartLine,
  FaBoxes,
  FaCashRegister,
  FaUsers,
  FaCamera,
  FaTrashAlt,
  FaCopy,
  FaCheck
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = '/api/ai';

const pulseGlow = keyframes`
  0% { box-shadow: 0 8px 25px rgba(37, 99, 235, 0.45), 0 0 0 0 rgba(59, 130, 246, 0.55); }
  70% { box-shadow: 0 10px 30px rgba(37, 99, 235, 0.6), 0 0 0 12px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 8px 25px rgba(37, 99, 235, 0.45), 0 0 0 0 rgba(59, 130, 246, 0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(18px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const WidgetContainer = styled.div`
  position: fixed;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  left: calc(20px + env(safe-area-inset-left, 0px));
  z-index: 9998;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  @media print {
    display: none !important;
  }
`;

const FloatingButton = styled.button`
  height: 54px;
  padding: 0 18px 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #4f46e5 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  animation: ${pulseGlow} 3s infinite;
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease;
  position: relative;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 14px 32px rgba(29, 78, 216, 0.55);
  }

  &:active {
    transform: scale(0.97);
  }

  .icon-wrap {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.16);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    position: relative;
  }

  .btn-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.15;
  }

  .btn-title {
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: #ffffff;
  }

  .btn-sub {
    font-size: 0.66rem;
    font-weight: 600;
    color: rgba(219, 234, 254, 0.92);
  }

  @media (max-width: 640px) {
    width: 54px;
    height: 54px;
    padding: 0;
    justify-content: center;
    border-radius: 50%;

    .btn-text {
      display: none;
    }

    .icon-wrap {
      background: transparent;
      font-size: 1.35rem;
    }
  }
`;

const OnlineBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${props => (props.$active ? '#10b981' : '#f59e0b')};
  border: 2px solid #0f172a;
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 68px;
  left: 0;
  width: 420px;
  max-width: calc(100vw - 28px);
  height: 620px;
  max-height: calc(100vh - 110px);
  background: #ffffff;
  border-radius: 22px;
  box-shadow: 0 24px 65px rgba(15, 23, 42, 0.32), 0 0 0 1px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${slideUp} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: bottom left;

  @media (max-width: 480px) {
    width: calc(100vw - 24px);
    height: calc(100vh - 105px);
    bottom: 64px;
    left: 0;
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #3730a3 100%);
  color: #ffffff;
  padding: 15px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 13px;
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.28), rgba(129, 140, 248, 0.28));
    border: 1px solid rgba(255, 255, 255, 0.24);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: #93c5fd;
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.2);
  }

  h4 {
    margin: 0;
    font-size: 0.96rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .badge-ai {
    font-size: 0.62rem;
    font-weight: 800;
    text-transform: uppercase;
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(16, 185, 129, 0.22);
    color: #6ee7b7;
    border: 1px solid rgba(16, 185, 129, 0.4);
  }

  p {
    margin: 2px 0 0;
    font-size: 0.72rem;
    color: #cbd5e1;
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  button {
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #f8fafc;
    width: 33px;
    height: 33px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.18s;

    &:hover {
      background: rgba(255, 255, 255, 0.24);
      transform: translateY(-1px);
    }
  }
`;

const QuickChipsBar = styled.div`
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const QuickChip = styled.button`
  white-space: nowrap;
  padding: 6px 11px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #1e293b;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.16s ease;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);

  &:hover:not(:disabled) {
    background: #eff6ff;
    border-color: #3b82f6;
    color: #1d4ed8;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 14px;
  overflow-y: auto;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.$isUser ? 'flex-end' : 'flex-start')};
  gap: 4px;
`;

const MessageBubble = styled.div`
  max-width: 88%;
  padding: 12px 15px;
  border-radius: 16px;
  font-size: 0.855rem;
  line-height: 1.52;
  white-space: pre-wrap;
  word-break: break-word;
  position: relative;

  ${props =>
    props.$isUser
      ? `
    background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 6px 16px rgba(29, 78, 216, 0.22);
  `
      : `
    background: #ffffff;
    color: #1e293b;
    border: 1px solid #e2e8f0;
    border-bottom-left-radius: 4px;
    box-shadow: 0 3px 10px rgba(15, 23, 42, 0.05);
  `}

  strong {
    font-weight: 700;
    color: ${props => (props.$isUser ? '#ffffff' : '#0f172a')};
  }

  code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.78rem;
    padding: 1px 5px;
    border-radius: 5px;
    background: ${props => (props.$isUser ? 'rgba(255,255,255,0.18)' : '#f1f5f9')};
    color: ${props => (props.$isUser ? '#ffffff' : '#1d4ed8')};
    border: ${props => (props.$isUser ? 'none' : '1px solid #e2e8f0')};
  }
`;

const MessageMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  font-size: 0.68rem;
  color: #64748b;

  button.copy-btn {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.68rem;
    padding: 2px 5px;
    border-radius: 4px;
    transition: all 0.15s;

    &:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
  }
`;

const ProductCard = styled.div`
  margin-top: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;

  img {
    width: 100%;
    max-height: 190px;
    object-fit: cover;
    display: block;
    background: #ffffff;
    cursor: pointer;
    transition: opacity 0.15s;

    &:hover {
      opacity: 0.92;
    }
  }

  .info {
    padding: 9px 11px;
    font-size: 0.78rem;
    color: #334155;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e2e8f0;
    background: #ffffff;
  }
`;

const InputBar = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;

  input {
    flex: 1;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.87rem;
    outline: none;
    color: #0f172a;
    background: #f8fafc;
    transition: border-color 0.2s, background 0.2s;

    &:focus {
      border-color: #2563eb;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }
  }

  button {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #2563eb, #4338ca);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.2s;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      transform: scale(1.04);
    }
  }
`;

const SettingsPanel = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 14px;

  h5 {
    margin: 0;
    font-size: 0.92rem;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 13px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    font-size: 0.78rem;
    font-weight: 700;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  input {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 9px 11px;
    font-size: 0.82rem;
    outline: none;
    &:focus {
      border-color: #2563eb;
    }
  }

  .hint {
    font-size: 0.73rem;
    color: #64748b;
    line-height: 1.4;
  }

  .save-btn {
    padding: 11px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #059669, #10b981);
    color: #ffffff;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    margin-top: 4px;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

const INITIAL_WELCOME_MESSAGE = {
  role: 'assistant',
  text:
    '👋 ¡Hola! Soy **ADA**, tu Asistente de Inteligencia de Negocios en **Multirepuestos RG**.\n\n' +
    'Estoy conectada en vivo a tu base de datos de **Ventas, Cajas, Inventario, Vendedores y Cartera de Crédito**.\n\n' +
    'Puedes tocar cualquier botón rápido arriba o preguntarme lo que necesites (ej: *"¿Cuánto ha vendido Waskar este mes?"* o *"Mándame foto de bujía"*).',
  time: 'En línea'
};

/**
 * Renderiza Markdown ligero (**negrita**, *negrita*, `código`) de forma segura en React
 */
function renderFormattedText(text) {
  if (!text) return null;
  const lines = String(text).split('\n');

  return lines.map((line, lineIdx) => {
    // Dividir por **negrita** o `codigo`
    const tokens = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
      <React.Fragment key={lineIdx}>
        {tokens.map((tok, i) => {
          if (tok.startsWith('**') && tok.endsWith('**') && tok.length > 4) {
            return <strong key={i}>{tok.slice(2, -2)}</strong>;
          }
          if (tok.startsWith('`') && tok.endsWith('`') && tok.length > 2) {
            return <code key={i}>{tok.slice(1, -1)}</code>;
          }
          return tok;
        })}
        {lineIdx < lines.length - 1 && '\n'}
      </React.Fragment>
    );
  });
}

const AIAssistantWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [status, setStatus] = useState({
    hasGeminiKey: false,
    hasTelegramToken: false,
    telegramBot: { active: false, username: null }
  });
  const [configForm, setConfigForm] = useState({
    geminiApiKey: '',
    telegramBotToken: ''
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [configMsg, setConfigMsg] = useState('');
  const [previewImg, setPreviewImg] = useState(null);

  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE]);

  const messagesEndRef = useRef(null);

  const isAdmin =
    user &&
    (String(user.role).toLowerCase() === 'admin' ||
      String(user.role).toLowerCase() === 'administrador' ||
      user.id === 1);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/status`, { headers: getAuthHeaders() });
      if (res.data) {
        setStatus(res.data);
      }
    } catch {
      // Silencioso si no ha iniciado sesión
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchStatus();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Solo mostrar el asistente a usuarios autenticados como Administradores
  if (!user || !isAdmin) return null;

  const formatNowTime = () => {
    try {
      return new Date().toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const sendQuestion = async questionText => {
    const text = (questionText ?? input).trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', text, time: formatNowTime() };
    const nextHistory = [...messages.slice(-8), userMsg];
    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/chat`,
        {
          message: text,
          history: nextHistory
        },
        { headers: getAuthHeaders() }
      );

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: res.data?.reply || 'Consulta completada.',
          productPhoto: res.data?.productPhoto || null,
          time: formatNowTime()
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `⚠️ Error al consultar: ${err.response?.data?.message || err.message}`,
          time: formatNowTime()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (text, idx) => {
    try {
      const clean = String(text || '').replace(/\*\*/g, '');
      navigator.clipboard.writeText(clean);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1800);
    } catch {
      // Ignorar
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
  };

  const handleSaveConfig = async e => {
    e.preventDefault();
    setSavingConfig(true);
    setConfigMsg('');
    try {
      const payload = {};
      if (configForm.geminiApiKey.trim()) payload.geminiApiKey = configForm.geminiApiKey.trim();
      if (configForm.telegramBotToken.trim()) payload.telegramBotToken = configForm.telegramBotToken.trim();

      const res = await axios.put(`${API_URL}/config`, payload, { headers: getAuthHeaders() });
      setConfigMsg(`✅ ${res.data.message || 'Configuración guardada.'}`);
      setConfigForm({ geminiApiKey: '', telegramBotToken: '' });
      await fetchStatus();
    } catch (err) {
      setConfigMsg(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setSavingConfig(false);
    }
  };

  return (
    <WidgetContainer>
      {isOpen && (
        <ChatWindow>
          <Header>
            <HeaderTitle>
              <div className="avatar">
                <FaRobot />
              </div>
              <div>
                <h4>
                  ADA — Inteligencia RG
                  <span className="badge-ai">IA + BD</span>
                </h4>
                <p>
                  <FaCheckCircle size={10} color="#34d399" />
                  En línea · Tiempo Real
                  {status.telegramBot?.active && status.telegramBot?.username && (
                    <span style={{ color: '#93c5fd', fontWeight: 700 }}>
                      · @{status.telegramBot.username}
                    </span>
                  )}
                </p>
              </div>
            </HeaderTitle>
            <HeaderActions>
              <button
                type="button"
                title="Limpiar conversación"
                onClick={handleClearChat}
              >
                <FaTrashAlt size={13} />
              </button>
              <button
                type="button"
                title="Configurar Gemini y Bot de Telegram"
                onClick={() => setShowSettings(s => !s)}
              >
                <FaCog size={14} />
              </button>
              <button type="button" title="Minimizar" onClick={() => setIsOpen(false)}>
                <FaTimes size={15} />
              </button>
            </HeaderActions>
          </Header>

          {showSettings ? (
            <SettingsPanel as="form" onSubmit={handleSaveConfig}>
              <h5>
                <FaCog /> Configuración de IA & Bot de Telegram
              </h5>

              <div className="card">
                <label>
                  <FaKey color="#2563eb" /> Google Gemini API Key
                  {status.hasGeminiKey ? (
                    <span style={{ color: '#10b981', marginLeft: 'auto' }}>● Configurada</span>
                  ) : (
                    <span style={{ color: '#f59e0b', marginLeft: 'auto' }}>● Usando Motor Local</span>
                  )}
                </label>
                <input
                  type="password"
                  placeholder={
                    status.hasGeminiKey
                      ? '•••••••• (Dejar vacío para mantener actual)'
                      : 'Pega aquí tu API Key (AIzaSy...)'
                  }
                  value={configForm.geminiApiKey}
                  onChange={e => setConfigForm(p => ({ ...p, geminiApiKey: e.target.value }))}
                />
                <div className="hint">
                  Permite razonamiento conversacional avanzado con Gemini sobre tus métricas reales.
                </div>
              </div>

              <div className="card">
                <label>
                  <FaTelegramPlane color="#0284c7" /> Token de Bot de Telegram (@BotFather)
                  {status.telegramBot?.active ? (
                    <span style={{ color: '#10b981', marginLeft: 'auto' }}>
                      ● @{status.telegramBot.username}
                    </span>
                  ) : (
                    <span style={{ color: '#64748b', marginLeft: 'auto' }}>● Desconectado</span>
                  )}
                </label>
                <input
                  type="password"
                  placeholder={
                    status.hasTelegramToken
                      ? '•••••••• (Dejar vacío para mantener actual)'
                      : 'Ej: 7123456789:AAHxyz...'
                  }
                  value={configForm.telegramBotToken}
                  onChange={e => setConfigForm(p => ({ ...p, telegramBotToken: e.target.value }))}
                />
                <div className="hint">
                  Consulta ventas, cajas, fotos de productos y existencias desde tu celular en Telegram (<b>@Ada1987_bot</b>).
                </div>
              </div>

              {configMsg && (
                <div
                  style={{
                    fontSize: '0.8rem',
                    padding: '9px 12px',
                    borderRadius: 8,
                    background: configMsg.startsWith('✅') ? '#ecfdf5' : '#fef2f2',
                    color: configMsg.startsWith('✅') ? '#065f46' : '#991b1b',
                    fontWeight: 600
                  }}
                >
                  {configMsg}
                </div>
              )}

              <button type="submit" className="save-btn" disabled={savingConfig}>
                {savingConfig ? 'Guardando y conectando...' : 'Guardar y Conectar'}
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                style={{
                  padding: '9px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                Volver al Chat
              </button>
            </SettingsPanel>
          ) : (
            <>
              <QuickChipsBar>
                <QuickChip
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    sendQuestion('Dame un resumen ejecutivo completo de las ventas de hoy y el estado de la caja de hoy')
                  }
                >
                  <FaCashRegister color="#2563eb" /> Ventas y Caja Hoy
                </QuickChip>
                <QuickChip
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion('¿Cuáles son las ventas del mes?')}
                >
                  <FaChartLine color="#059669" /> Ventas del Mes
                </QuickChip>
                <QuickChip
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion('¿Cuáles son las ventas de la última semana?')}
                >
                  📅 Ventas Semana
                </QuickChip>
                <QuickChip
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion('¿Cuánto ha vendido Waskar este mes?')}
                >
                  👤 Ventas Waskar
                </QuickChip>
                <QuickChip
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion('¿Cuánto vendió cada vendedor hoy y en el mes?')}
                >
                  <FaUsers color="#7c3aed" /> Por Vendedor
                </QuickChip>
                <QuickChip
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion('¿Cuáles son los productos más vendidos del mes?')}
                >
                  🏆 Más Vendidos
                </QuickChip>
                <QuickChip
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion('¿Cómo cerraron las últimas cajas?')}
                >
                  🧾 Cierres de Caja
                </QuickChip>
                <QuickChip
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion('¿Qué clientes deben dinero actualmente?')}
                >
                  💳 Clientes Deudores
                </QuickChip>
                <QuickChip
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion('¿Cuál es el valor del inventario?')}
                >
                  <FaBoxes color="#0284c7" /> Valor Inventario
                </QuickChip>
                <QuickChip
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion('Muéstrame la foto de un repuesto del catálogo')}
                >
                  <FaCamera color="#ec4899" /> Foto Repuesto
                </QuickChip>
                <QuickChip
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion('¿Qué productos tienen bajo stock o están agotados?')}
                >
                  ⚠️ Stock Crítico
                </QuickChip>
              </QuickChipsBar>

              <MessagesArea>
                {messages.map((m, idx) => (
                  <MessageWrapper key={idx} $isUser={m.role === 'user'}>
                    <MessageBubble $isUser={m.role === 'user'}>
                      {renderFormattedText(m.text)}
                      {m.productPhoto && m.productPhoto.image && (
                        <ProductCard>
                          <img
                            src={
                              m.productPhoto.image.startsWith('http') ||
                              m.productPhoto.image.startsWith('/')
                                ? m.productPhoto.image
                                : `/uploads/products/${m.productPhoto.image}`
                            }
                            alt={m.productPhoto.name}
                            onClick={() =>
                              setPreviewImg(
                                m.productPhoto.image.startsWith('http') ||
                                  m.productPhoto.image.startsWith('/')
                                  ? m.productPhoto.image
                                  : `/uploads/products/${m.productPhoto.image}`
                              )
                            }
                          />
                          <div className="info">
                            <span>
                              <strong>{m.productPhoto.name}</strong> ({m.productPhoto.code || 'S/C'})
                            </span>
                            <span>
                              Stock: <strong>{m.productPhoto.quantity}</strong> ·{' '}
                              <strong>C${Number(m.productPhoto.selling_price || 0).toFixed(2)}</strong>
                            </span>
                          </div>
                        </ProductCard>
                      )}
                    </MessageBubble>
                    <MessageMetaRow>
                      {m.time && <span>{m.time}</span>}
                      {m.role === 'assistant' && idx > 0 && (
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={() => handleCopyMessage(m.text, idx)}
                        >
                          {copiedIdx === idx ? (
                            <>
                              <FaCheck size={10} color="#10b981" /> Copiado
                            </>
                          ) : (
                            <>
                              <FaCopy size={10} /> Copiar
                            </>
                          )}
                        </button>
                      )}
                    </MessageMetaRow>
                  </MessageWrapper>
                ))}
                {loading && (
                  <MessageWrapper $isUser={false}>
                    <MessageBubble $isUser={false} style={{ color: '#475569', fontWeight: 600 }}>
                      ⏳ Consultando métricas y base de datos en tiempo real...
                    </MessageBubble>
                  </MessageWrapper>
                )}
                <div ref={messagesEndRef} />
              </MessagesArea>

              <InputBar
                onSubmit={e => {
                  e.preventDefault();
                  sendQuestion();
                }}
              >
                <input
                  type="text"
                  placeholder="Pregunta sobre ventas, cajas, Waskar, stock o pide una foto..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !input.trim()} title="Enviar consulta">
                  <FaPaperPlane size={14} />
                </button>
              </InputBar>
            </>
          )}
        </ChatWindow>
      )}

      <FloatingButton
        type="button"
        title="Abrir Asistente de Inteligencia de Negocios ADA"
        onClick={() => setIsOpen(o => !o)}
      >
        <div className="icon-wrap">
          {isOpen ? <FaTimes /> : <FaRobot />}
          <OnlineBadge $active={status.hasGeminiKey || status.telegramBot?.active} />
        </div>
        {!isOpen && (
          <div className="btn-text">
            <span className="btn-title">ADA IA</span>
            <span className="btn-sub">Asistente RG</span>
          </div>
        )}
      </FloatingButton>

      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            cursor: 'zoom-out'
          }}
        >
          <img
            src={previewImg}
            alt="Vista previa de repuesto"
            style={{
              maxWidth: '92vw',
              maxHeight: '88vh',
              borderRadius: 14,
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
            }}
          />
        </div>
      )}
    </WidgetContainer>
  );
};

export default AIAssistantWidget;
