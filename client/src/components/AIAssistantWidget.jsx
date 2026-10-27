import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FaRobot, FaPaperPlane, FaTimes, FaSync, FaLightbulb, 
  FaCopy, FaCheck, FaExclamationTriangle, FaChartLine, FaBoxes, FaUserClock
} from 'react-icons/fa';
import { askAI, getAIStatus } from '../service/api';

// --- ANIMACIONES ---
const popIn = keyframes`
  0% { transform: scale(0.8) translateY(20px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.5); }
  70% { box-shadow: 0 0 0 14px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// --- ESTILOS ---
const WidgetContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: 'Outfit', sans-serif;

  @media (max-width: 640px) {
    bottom: 80px;
    right: 16px;
  }
`;

const FloatingButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%);
  color: #fff;
  border: none;
  width: 58px;
  height: 58px;
  border-radius: 29px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4), 0 8px 10px -6px rgba(79, 70, 229, 0.3);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ${pulseGlow} 2.5s infinite;

  &:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 420px;
  height: 560px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 120px);
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  animation: ${popIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;

    .bot-avatar {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.15rem;
    }

    .bot-info {
      h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
        color: #f8fafc;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      p {
        margin: 2px 0 0 0;
        font-size: 0.75rem;
        color: #94a3b8;
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
  }

  .header-actions {
    display: flex;
    gap: 8px;

    button {
      background: rgba(255, 255, 255, 0.06);
      border: none;
      color: #94a3b8;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #f8fafc;
      }
    }
  }
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${props => props.$online ? '#10b981' : '#f59e0b'};
  display: inline-block;
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }
`;

const MessageBubble = styled.div`
  max-width: 85%;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  font-size: 0.88rem;
  line-height: 1.45;
  position: relative;
  word-break: break-word;

  ${props => props.$user ? `
    align-self: flex-end;
    background: #4f46e5;
    color: #ffffff;
    border-bottom-right-radius: 4px;
  ` : `
    align-self: flex-start;
    background: #1e293b;
    color: #e2e8f0;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-bottom-left-radius: 4px;
  `}

  p { margin: 0 0 6px 0; &:last-child { margin-bottom: 0; } }
  strong { color: #f8fafc; font-weight: 700; }
  code { background: rgba(0,0,0,0.3); padding: 1px 4px; border-radius: 4px; font-family: monospace; font-size: 0.85em; }
`;

const SuggestionsContainer = styled.div`
  padding: 0.5rem 1rem;
  display: flex;
  gap: 6px;
  overflow-x: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(15, 23, 42, 0.7);

  &::-webkit-scrollbar { display: none; }
`;

const Chip = styled.button`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  white-space: nowrap;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;

  &:hover {
    background: #4f46e5;
    color: #fff;
    border-color: #6366f1;
  }
`;

const InputArea = styled.form`
  padding: 0.75rem 1rem;
  background: #1e293b;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  gap: 8px;
  align-items: center;

  input {
    flex: 1;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 10px 14px;
    color: #f8fafc;
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #6366f1;
    }

    &::placeholder {
      color: #64748b;
    }
  }

  button {
    background: #4f46e5;
    color: #fff;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #4338ca;
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
`;

const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 0.82rem;
  padding: 8px 12px;
  background: #1e293b;
  border-radius: 12px;
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.06);

  .spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState({ hasGeminiKey: false, hasTelegramToken: false });
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '👋 ¡Hola! Soy **ADA**, el Asistente Inteligente de **Multirepuestos RG**.\n\nPuedo responderte al instante sobre **ventas del día**, **dinero en caja**, **precios y existencia de repuestos**, **stock crítico** o **clientes con deuda**.'
    }
  ]);

  const messagesEndRef = useRef(null);

  // Cargar estado de la IA al montar
  useEffect(() => {
    getAIStatus()
      .then(res => {
        if (res) setAiStatus(res);
      })
      .catch(() => {});
  }, []);

  // Auto-scroll hacia el final
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText = null) => {
    const textToSend = typeof questionText === 'string' ? questionText : input;
    if (!textToSend || !textToSend.trim() || loading) return;

    const userMsg = { role: 'user', text: textToSend.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Historial para contexto (optimizado a 3 mensajes para ahorrar tokens y dar respuesta instantánea)
      const history = messages.slice(-3).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await askAI(userMsg.text, history);
      const botMsg = {
        role: 'assistant',
        text: res?.answer || 'No se obtuvo respuesta del servidor.'
      };
      setMessages(prev => [...prev, botMsg]);

      if (res?.hasKey !== undefined) {
        setAiStatus(prev => ({ ...prev, hasGeminiKey: res.hasKey }));
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `⚠️ Error al consultar la IA: ${err.message || 'Error de conexión'}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Sugerencias rápidas
  const handleChipClick = (suggestion) => {
    handleSend(suggestion);
  };

  // Formateador simple de texto markdown (negritas, saltos de línea y viñetas)
  const formatText = (content) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Reemplazo básico de negritas **texto**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <React.Fragment key={idx}>
          {renderedLine}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <WidgetContainer>
      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <div className="header-left">
              <div className="bot-avatar">
                <FaRobot />
              </div>
              <div className="bot-info">
                <h3>ADA — Asistente RG</h3>
                <p>
                  <StatusDot $online={true} />
                  Inteligencia de Negocios en Línea
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button 
                title="Limpiar chat" 
                onClick={() => setMessages([
                  {
                    role: 'assistant',
                    text: 'Chat reiniciado. ¿En qué puedo ayudarte hoy sobre Multirepuestos RG?'
                  }
                ])}
              >
                <FaSync size={12} />
              </button>
              <button title="Cerrar" onClick={() => setIsOpen(false)}>
                <FaTimes size={14} />
              </button>
            </div>
          </ChatHeader>

          <MessagesArea>
            {messages.map((m, i) => (
              <MessageBubble key={i} $user={m.role === 'user'}>
                {formatText(m.text)}
              </MessageBubble>
            ))}

            {loading && (
              <LoadingDots>
                <FaSync className="spinner" />
                <span>Analizando datos del negocio...</span>
              </LoadingDots>
            )}
            <div ref={messagesEndRef} />
          </MessagesArea>

          <SuggestionsContainer>
            <Chip onClick={() => handleChipClick('¿Cuánto se ha vendido hoy y qué hay en caja?')}>
              💵 Ventas de Hoy
            </Chip>
            <Chip onClick={() => handleChipClick('¿Qué repuestos tienen stock crítico o bajo?')}>
              📦 Stock Bajo
            </Chip>
            <Chip onClick={() => handleChipClick('¿Qué clientes tienen crédito pendiente?')}>
              💳 Clientes Deudores
            </Chip>
            <Chip onClick={() => handleChipClick('¿Cuáles son los repuestos más vendidos del mes?')}>
              🏆 Top Vendidos
            </Chip>
          </SuggestionsContainer>

          <InputArea onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <input
              type="text"
              placeholder="Pregunta sobre ventas, repuestos, caja..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button type="submit" disabled={loading || !input.trim()} title="Enviar consulta">
              <FaPaperPlane size={14} />
            </button>
          </InputArea>
        </ChatWindow>
      )}

      <FloatingButton 
        onClick={() => setIsOpen(!isOpen)} 
        title="Asistente de Inteligencia Artificial RG"
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </FloatingButton>
    </WidgetContainer>
  );
};

export default AIAssistantWidget;
