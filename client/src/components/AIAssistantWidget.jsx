import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaSync,
  FaCopy,
  FaCheck,
  FaExpand,
  FaCog,
  FaKey,
  FaTelegramPlane,
  FaCheckCircle
} from 'react-icons/fa';
import { askAI, getAIStatus, saveAIConfig } from '../service/api';

// --- ANIMACIONES ---
const popIn = keyframes`
  0% { transform: scale(0.92) translateY(18px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.55), 0 0 0 0 rgba(59, 130, 246, 0.55); }
  70% { box-shadow: 0 12px 28px -5px rgba(37, 99, 235, 0.65), 0 0 0 14px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.55), 0 0 0 0 rgba(59, 130, 246, 0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// --- CONTENEDOR EN ESQUINA INFERIOR IZQUIERDA ---
const WidgetContainer = styled.div`
  position: fixed;
  bottom: ${props =>
    props.$isPosOnMobile
      ? 'calc(80px + env(safe-area-inset-bottom, 0px))'
      : 'calc(22px + env(safe-area-inset-bottom, 0px))'};
  left: calc(20px + env(safe-area-inset-left, 0px));
  z-index: 9999999;
  font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  pointer-events: auto;

  @media (max-width: 640px) {
    bottom: ${props =>
      props.$isPosOnMobile
        ? 'calc(82px + env(safe-area-inset-bottom, 0px))'
        : 'calc(18px + env(safe-area-inset-bottom, 0px))'};
    left: calc(14px + env(safe-area-inset-left, 0px));
  }

  @media print {
    display: none !important;
  }
`;

const FloatingButton = styled.button`
  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 52%, #4f46e5 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  height: 56px;
  padding: 0 18px 0 12px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ${pulseGlow} 2.8s infinite;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  backdrop-filter: blur(10px);

  .bot-icon-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.16);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    position: relative;
  }

  .online-dot {
    position: absolute;
    top: 1px;
    right: 1px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #10b981;
    border: 2px solid #0f172a;
  }

  .btn-labels {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.15;
  }

  .btn-main {
    font-size: 0.88rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: #ffffff;
  }

  .btn-sub {
    font-size: 0.67rem;
    font-weight: 600;
    color: #bfdbfe;
  }

  @media (max-width: 640px) {
    width: 54px;
    height: 54px;
    padding: 0;
    justify-content: center;
    border-radius: 50%;

    .btn-labels {
      display: none;
    }

    .bot-icon-circle {
      background: transparent;
      font-size: 1.38rem;
    }
  }

  &:hover {
    transform: scale(1.05) translateY(-3px);
    box-shadow: 0 16px 34px -5px rgba(37, 99, 235, 0.65);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 70px;
  left: 0;
  width: 440px;
  height: 610px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 110px);
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 28px 60px -12px rgba(2, 6, 23, 0.72), 0 0 0 1px rgba(255, 255, 255, 0.07);
  overflow: hidden;
  animation: ${popIn} 0.26s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: bottom left;

  @media (max-width: 640px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100dvh;
    max-width: 100vw;
    max-height: 100dvh;
    border-radius: 0;
    border: none;
    z-index: 10000000;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #312e81 100%);
  padding: 1rem 1.15rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .header-left {
    display: flex;
    align-items: center;
    gap: 11px;

    .bot-avatar {
      width: 40px;
      height: 40px;
      border-radius: 13px;
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .bot-info {
      h3 {
        margin: 0;
        font-size: 0.98rem;
        font-weight: 800;
        color: #f8fafc;
        display: flex;
        align-items: center;
        gap: 7px;
      }

      .badge-live {
        font-size: 0.62rem;
        font-weight: 800;
        text-transform: uppercase;
        padding: 2px 7px;
        border-radius: 999px;
        background: rgba(16, 185, 129, 0.2);
        color: #6ee7b7;
        border: 1px solid rgba(16, 185, 129, 0.4);
      }

      p {
        margin: 3px 0 0 0;
        font-size: 0.73rem;
        color: #cbd5e1;
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
  }

  .header-actions {
    display: flex;
    gap: 6px;

    button {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #e2e8f0;
      width: 33px;
      height: 33px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.22);
        color: #ffffff;
        transform: translateY(-1px);
      }
    }
  }
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${props => (props.$online ? '#10b981' : '#f59e0b')};
  display: inline-block;
  box-shadow: 0 0 8px ${props => (props.$online ? '#10b981' : '#f59e0b')};
`;

const SuggestionsContainer = styled.div`
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  overflow-x: auto;
  background: rgba(15, 23, 42, 0.92);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }
`;

const Chip = styled.button`
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.35);
  color: #e2e8f0;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover:not(:disabled) {
    background: rgba(59, 130, 246, 0.28);
    border-color: #60a5fa;
    color: #ffffff;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: radial-gradient(circle at top left, rgba(30, 58, 138, 0.18), transparent 60%), #0f172a;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.16);
    border-radius: 10px;
  }
`;

const MessageRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.$user ? 'flex-end' : 'flex-start')};
  gap: 4px;
`;

const MessageBubble = styled.div`
  max-width: 88%;
  padding: 12px 15px;
  border-radius: 16px;
  font-size: 0.87rem;
  line-height: 1.54;
  word-wrap: break-word;
  white-space: pre-wrap;

  ${props =>
    props.$user
      ? `
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 6px 16px -3px rgba(37, 99, 235, 0.35);
  `
      : `
    background: #1e293b;
    color: #e2e8f0;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
  `}

  strong {
    color: ${props => (props.$user ? '#ffffff' : '#93c5fd')};
    font-weight: 700;
  }

  code {
    background: rgba(15, 23, 42, 0.65);
    color: #6ee7b7;
    padding: 1px 6px;
    border-radius: 5px;
    font-size: 0.79rem;
    font-family: monospace;
  }
`;

const MetaBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  font-size: 0.68rem;
  color: #64748b;

  button {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 0.68rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 5px;
    transition: all 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #f8fafc;
    }
  }
`;

const ProductImageCard = styled.div`
  margin-top: 10px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: #0f172a;

  img {
    width: 100%;
    max-height: 210px;
    object-fit: contain;
    background: #ffffff;
    cursor: pointer;
    display: block;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.02);
    }
  }

  .image-action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 11px;
    background: #0f172a;
    font-size: 0.74rem;
    color: #94a3b8;

    button {
      background: rgba(99, 102, 241, 0.22);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #c7d2fe;
      border-radius: 6px;
      padding: 3px 9px;
      font-size: 0.7rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;

      &:hover {
        background: rgba(99, 102, 241, 0.38);
        color: #ffffff;
      }
    }
  }
`;

const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(2, 6, 23, 0.88);
  backdrop-filter: blur(6px);
  z-index: 10000005;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 88vh;
    background: #ffffff;
    border-radius: 16px;
    padding: 12px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75);

    img {
      max-width: 85vw;
      max-height: 80vh;
      object-fit: contain;
      display: block;
      border-radius: 10px;
    }

    .close-btn {
      position: absolute;
      top: -14px;
      right: -14px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #ef4444;
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1rem;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
    }
  }
`;

const InputArea = styled.form`
  padding: 12px;
  background: #1e293b;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  display: flex;
  gap: 8px;

  input {
    flex: 1;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 12px;
    padding: 10px 14px;
    color: #f8fafc;
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    &::placeholder {
      color: #64748b;
    }
  }

  button {
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    color: white;
    border: none;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 14px -2px rgba(37, 99, 235, 0.5);
    }
  }
`;

const SettingsArea = styled.form`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 14px;

  .card {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 13px;
    padding: 13px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    font-size: 0.78rem;
    font-weight: 700;
    color: #e2e8f0;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  input {
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 9px;
    padding: 9px 12px;
    color: #f8fafc;
    font-size: 0.82rem;
    outline: none;

    &:focus {
      border-color: #3b82f6;
    }
  }

  .hint {
    font-size: 0.72rem;
    color: #94a3b8;
    line-height: 1.4;
  }

  .save-btn {
    padding: 11px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    color: #ffffff;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
  }
`;

const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 0.82rem;
  padding: 10px 14px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 12px;
  align-self: flex-start;
  border: 1px solid rgba(255, 255, 255, 0.08);

  .spinner {
    animation: ${spin} 1.2s linear infinite;
    color: #60a5fa;
  }
`;

const INITIAL_MESSAGE = {
  role: 'assistant',
  text:
    '👋 ¡Hola! Soy **ADA**, el Asistente de Inteligencia de Negocios de **Multirepuestos RG**.\n\n' +
    'Estoy conectada en tiempo real a tu base de datos de **Ventas, Cajas, Inventario, Empleados y Cartera de Crédito** (y sincronizada con Telegram **@Ada1987_bot**).\n\n' +
    'Toca cualquiera de los botones rápidos arriba o escribe tu consulta abajo.'
};

const AIAssistantWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ hasGeminiKey: false, hasTelegramToken: false, summary: null });
  const [lightboxImage, setLightboxImage] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [configForm, setConfigForm] = useState({ gemini_api_key: '', telegram_bot_token: '' });
  const [savingConfig, setSavingConfig] = useState(false);
  const [configNotice, setConfigNotice] = useState('');
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (isOpen && token) {
      getAIStatus(token)
        .then(data => {
          if (data) setStatus(data);
        })
        .catch(() => {});
    }
  }, [isOpen, token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  if (!token) return null;

  const isPosOnMobile =
    location?.pathname?.startsWith('/pos') || location?.pathname?.startsWith('/wholesale-pos');

  const handleSend = async customQuestion => {
    const q = (typeof customQuestion === 'string' ? customQuestion : input).trim();
    if (!q || loading) return;

    const newMessages = [...messages, { role: 'user', text: q }];
    setMessages(newMessages);
    if (typeof customQuestion !== 'string') setInput('');
    setLoading(true);

    try {
      const historyForApi = messages.slice(-6).map(m => ({ role: m.role, text: m.text }));
      const res = await askAI(q, historyForApi, token);

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: res?.answer || res?.reply || 'No se recibió respuesta.',
          image: res?.image || null,
          product: res?.product || null,
          provider: res?.provider
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: `⚠️ Error al consultar el asistente: ${err.message || 'Intenta nuevamente.'}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    try {
      navigator.clipboard.writeText(String(text || '').replace(/\*\*/g, ''));
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1800);
    } catch {}
  };

  const handleSaveConfig = async e => {
    e.preventDefault();
    setSavingConfig(true);
    setConfigNotice('');
    try {
      const payload = {};
      if (configForm.gemini_api_key.trim()) payload.gemini_api_key = configForm.gemini_api_key.trim();
      if (configForm.telegram_bot_token.trim()) payload.telegram_bot_token = configForm.telegram_bot_token.trim();

      const res = await saveAIConfig(payload, token);
      setConfigNotice(`✅ ${res?.message || 'Configuración actualizada correctamente.'}`);
      setConfigForm({ gemini_api_key: '', telegram_bot_token: '' });
      const st = await getAIStatus(token);
      if (st) setStatus(st);
    } catch (err) {
      setConfigNotice(`❌ Error: ${err.message}`);
    } finally {
      setSavingConfig(false);
    }
  };

  // Formatear negritas (**texto** y *texto*) y código (`codigo`)
  const formatText = text => {
    if (!text) return '';
    const lines = String(text).split('\n');
    return lines.map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g);
      return (
        <React.Fragment key={i}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
              return <strong key={j}>{part.slice(1, -1)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
              return <code key={j}>{part.slice(1, -1)}</code>;
            }
            return part;
          })}
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <WidgetContainer $isPosOnMobile={isPosOnMobile}>
        {isOpen && (
          <ChatWindow>
            <ChatHeader>
              <div className="header-left">
                <div className="bot-avatar">
                  <FaRobot />
                </div>
                <div className="bot-info">
                  <h3>
                    ADA — Inteligencia RG
                    <span className="badge-live">EN VIVO</span>
                  </h3>
                  <p>
                    <StatusDot $online={true} />
                    BD en Tiempo Real · Telegram @Ada1987_bot
                  </p>
                </div>
              </div>
              <div className="header-actions">
                <button
                  type="button"
                  title="Configuración de IA y Telegram"
                  onClick={() => setShowSettings(s => !s)}
                >
                  <FaCog size={13} />
                </button>
                <button
                  type="button"
                  title="Reiniciar conversación"
                  onClick={() => setMessages([INITIAL_MESSAGE])}
                >
                  <FaSync size={12} />
                </button>
                <button type="button" title="Minimizar" onClick={() => setIsOpen(false)}>
                  <FaTimes size={15} />
                </button>
              </div>
            </ChatHeader>

            {showSettings ? (
              <SettingsArea onSubmit={handleSaveConfig}>
                <div className="card">
                  <label>
                    <FaKey color="#60a5fa" /> Motor Conversacional IA (API Key)
                    <span style={{ marginLeft: 'auto', color: status.hasGeminiKey ? '#34d399' : '#fbbf24' }}>
                      {status.hasGeminiKey ? '● Activo' : '● Motor Local'}
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder={
                      status.hasGeminiKey
                        ? '•••••••• (Dejar en blanco para mantener actual)'
                        : 'Pegar API Key...'
                    }
                    value={configForm.gemini_api_key}
                    onChange={e => setConfigForm(p => ({ ...p, gemini_api_key: e.target.value }))}
                  />
                  <div className="hint">
                    Habilita respuestas analíticas abiertas combinadas con el motor determinístico en tiempo real.
                  </div>
                </div>

                <div className="card">
                  <label>
                    <FaTelegramPlane color="#38bdf8" /> Bot de Telegram (@Ada1987_bot)
                    <span style={{ marginLeft: 'auto', color: status.hasTelegramToken ? '#34d399' : '#94a3b8' }}>
                      {status.hasTelegramToken ? '● Conectado' : '● Sin Token'}
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder={
                      status.hasTelegramToken
                        ? '•••••••• (Dejar en blanco para mantener actual)'
                        : 'Token de @BotFather...'
                    }
                    value={configForm.telegram_bot_token}
                    onChange={e => setConfigForm(p => ({ ...p, telegram_bot_token: e.target.value }))}
                  />
                  <div className="hint">
                    Permite consultar ventas, arqueos de caja, stock y fotografías de repuestos desde Telegram.
                  </div>
                </div>

                {configNotice && (
                  <div
                    style={{
                      padding: '9px 12px',
                      borderRadius: 9,
                      fontSize: '0.8rem',
                      background: configNotice.startsWith('✅') ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)',
                      color: configNotice.startsWith('✅') ? '#6ee7b7' : '#fca5a5'
                    }}
                  >
                    {configNotice}
                  </div>
                )}

                <button type="submit" className="save-btn" disabled={savingConfig}>
                  {savingConfig ? 'Guardando...' : 'Guardar Configuración'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  style={{
                    padding: '9px',
                    borderRadius: 9,
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'transparent',
                    color: '#e2e8f0',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Volver al Chat
                </button>
              </SettingsArea>
            ) : (
              <>
                <SuggestionsContainer>
                  <Chip disabled={loading} onClick={() => handleSend('¿Cuánto se ha vendido hoy y qué hay en caja?')}>
                    💵 Ventas y Caja Hoy
                  </Chip>
                  <Chip disabled={loading} onClick={() => handleSend('¿Cuáles son las ventas del mes?')}>
                    🗓️ Ventas del Mes
                  </Chip>
                  <Chip disabled={loading} onClick={() => handleSend('¿Cuánto hemos vendido en toda la semana?')}>
                    📅 Ventas Semana
                  </Chip>
                  <Chip disabled={loading} onClick={() => handleSend('Ventas de Waskar')}>
                    👤 Ventas de Waskar
                  </Chip>
                  <Chip disabled={loading} onClick={() => handleSend('¿Cuánto vendió cada empleado o vendedor?')}>
                    👥 Por Vendedor
                  </Chip>
                  <Chip disabled={loading} onClick={() => handleSend('¿Cuáles son los productos más vendidos?')}>
                    🏆 Más Vendidos
                  </Chip>
                  <Chip disabled={loading} onClick={() => handleSend('¿Cómo cerraron las últimas cajas?')}>
                    🧾 Cierres de Caja
                  </Chip>
                  <Chip disabled={loading} onClick={() => handleSend('¿Quiénes son los clientes con deuda pendiente?')}>
                    💳 Clientes Deudores
                  </Chip>
                  <Chip disabled={loading} onClick={() => handleSend('¿Cuál es el valor total del inventario?')}>
                    📦 Valor Inventario
                  </Chip>
                  <Chip disabled={loading} onClick={() => handleSend('Muéstrame la foto de un repuesto')}>
                    📷 Foto Repuesto
                  </Chip>
                  <Chip disabled={loading} onClick={() => handleSend('¿Qué repuestos tienen stock crítico o bajo?')}>
                    ⚠️ Stock Bajo
                  </Chip>
                </SuggestionsContainer>

                <MessagesArea>
                  {messages.map((m, i) => (
                    <MessageRow key={i} $user={m.role === 'user'}>
                      <MessageBubble $user={m.role === 'user'}>
                        {formatText(m.text)}
                        {m.image && (
                          <ProductImageCard>
                            <img
                              src={m.image}
                              alt={m.product?.nombre || 'Foto del repuesto'}
                              onClick={() => setLightboxImage(m.image)}
                              title="Toca para ampliar fotografía"
                            />
                            <div className="image-action-bar">
                              <span>
                                {m.product?.nombre ? `${m.product.nombre} ` : ''}
                                {m.product?.codigo ? `(${m.product.codigo})` : 'Catálogo RG'}
                              </span>
                              <button type="button" onClick={() => setLightboxImage(m.image)}>
                                <FaExpand size={10} /> Ampliar
                              </button>
                            </div>
                          </ProductImageCard>
                        )}
                      </MessageBubble>
                      {m.role === 'assistant' && i > 0 && (
                        <MetaBar>
                          <button type="button" onClick={() => handleCopy(m.text, i)}>
                            {copiedIdx === i ? (
                              <>
                                <FaCheck size={10} color="#10b981" /> Copiado
                              </>
                            ) : (
                              <>
                                <FaCopy size={10} /> Copiar respuesta
                              </>
                            )}
                          </button>
                        </MetaBar>
                      )}
                    </MessageRow>
                  ))}

                  {loading && (
                    <LoadingDots>
                      <FaSync className="spinner" />
                      <span>Consultando datos de Multirepuestos RG en tiempo real...</span>
                    </LoadingDots>
                  )}
                  <div ref={messagesEndRef} />
                </MessagesArea>

                <InputArea
                  onSubmit={e => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Pregunta sobre ventas, cajas, Waskar, stock o fotos..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                  <button type="submit" disabled={loading || !input.trim()} title="Enviar consulta">
                    <FaPaperPlane size={14} />
                  </button>
                </InputArea>
              </>
            )}
          </ChatWindow>
        )}

        <FloatingButton
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title="Abrir Asistente de Inteligencia de Negocios ADA"
        >
          <div className="bot-icon-circle">
            {isOpen ? <FaTimes /> : <FaRobot />}
            <span className="online-dot" />
          </div>
          {!isOpen && (
            <div className="btn-labels">
              <span className="btn-main">ADA IA</span>
              <span className="btn-sub">Asistente RG</span>
            </div>
          )}
        </FloatingButton>
      </WidgetContainer>

      {lightboxImage && (
        <LightboxOverlay onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setLightboxImage(null)} title="Cerrar">
              <FaTimes />
            </button>
            <img src={lightboxImage} alt="Fotografía del repuesto ampliada" />
          </div>
        </LightboxOverlay>
      )}
    </>
  );
};

export default AIAssistantWidget;
