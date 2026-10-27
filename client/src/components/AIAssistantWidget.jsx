import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { 
  FaRobot, FaPaperPlane, FaTimes, FaSync, FaLightbulb, 
  FaCopy, FaCheck, FaExclamationTriangle, FaChartLine, FaBoxes, FaUserClock,
  FaExpand, FaImage
} from 'react-icons/fa';
import { askAI, getAIStatus } from '../service/api';

// --- ANIMACIONES ---
const popIn = keyframes`
  0% { transform: scale(0.85) translateY(20px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.55); }
  70% { box-shadow: 0 0 0 16px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// --- ESTILOS RESPONSIVOS ---
const WidgetContainer = styled.div`
  position: fixed;
  bottom: ${props => props.$isPosOnMobile ? 'calc(80px + env(safe-area-inset-bottom, 0px))' : 'calc(24px + env(safe-area-inset-bottom, 0px))'};
  right: calc(16px + env(safe-area-inset-right, 0px));
  z-index: 9999999;
  font-family: 'Outfit', sans-serif;
  pointer-events: auto;

  @media (max-width: 640px) {
    bottom: ${props => props.$isPosOnMobile ? 'calc(82px + env(safe-area-inset-bottom, 0px))' : 'calc(18px + env(safe-area-inset-bottom, 0px))'};
    right: calc(14px + env(safe-area-inset-right, 0px));
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
  box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.5), 0 8px 10px -6px rgba(79, 70, 229, 0.4);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ${pulseGlow} 2.5s infinite;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  @media (max-width: 640px) {
    width: 54px;
    height: 54px;
    font-size: 1.35rem;
  }

  &:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.6);
  }

  &:active {
    transform: scale(0.92);
  }
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 430px;
  height: 580px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 110px);
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  animation: ${popIn} 0.28s cubic-bezier(0.16, 1, 0.3, 1);

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
      width: 32px;
      height: 32px;
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
  max-width: 88%;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  font-size: 0.88rem;
  line-height: 1.48;
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
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom-left-radius: 4px;
  `}

  p { margin: 0 0 6px 0; &:last-child { margin-bottom: 0; } }
  strong { color: #f8fafc; font-weight: 700; }
  code { background: rgba(0,0,0,0.3); padding: 1px 4px; border-radius: 4px; font-family: monospace; font-size: 0.85em; }
`;

const ProductImageCard = styled.div`
  margin-top: 10px;
  border-radius: 12px;
  overflow: hidden;
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;

  img {
    width: 100%;
    max-height: 220px;
    object-fit: contain;
    background: #000;
    display: block;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  .image-action-bar {
    padding: 8px 12px;
    background: rgba(15, 23, 42, 0.85);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: #94a3b8;
    border-top: 1px solid rgba(255, 255, 255, 0.08);

    button {
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.4);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.72rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;

      &:hover {
        background: #4f46e5;
        color: white;
      }
    }
  }
`;

const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 10000001;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  animation: ${popIn} 0.2s ease-out;

  .lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 78vh;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .close-btn {
      position: absolute;
      top: -42px;
      right: 0;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      transition: all 0.2s;

      &:hover {
        background: #ef4444;
      }
    }
  }
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
  padding: 5px 11px;
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
  const [lightboxImage, setLightboxImage] = useState(null);
  const [aiStatus, setAiStatus] = useState({ hasGeminiKey: false, hasTelegramToken: false });
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `👋 ¡Hola! Soy **ADA**, el Asistente Inteligente de **Multirepuestos RG**.\n\nPuedo responderte al instante sobre **ventas del día**, **ventas de Waskar**, **ventas del mes**, **dinero en caja**, **fotografías de repuestos** o **stock crítico**.`
    }
  ]);

  const messagesEndRef = useRef(null);
  const location = useLocation();
  const isPosOnMobile = location.pathname === '/pos';

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
      const history = messages.slice(-3).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await askAI(userMsg.text, history);
      const botMsg = {
        role: 'assistant',
        text: res?.answer || 'No se obtuvo respuesta del servidor.',
        image: res?.image || null,
        product: res?.product || null
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

  const handleChipClick = (suggestion) => {
    handleSend(suggestion);
  };

  const formatText = (content) => {
    if (!content) return null;
    const lines = String(content).split('\n');
    return lines.map((line, idx) => {
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
                  <FaTimes size={15} />
                </button>
              </div>
            </ChatHeader>

            <MessagesArea>
              {messages.map((m, i) => (
                <MessageBubble key={i} $user={m.role === 'user'}>
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
                        <span>{m.product?.codigo ? `Cód: ${m.product.codigo}` : 'Catálogo RG'}</span>
                        <button type="button" onClick={() => setLightboxImage(m.image)}>
                          <FaExpand size={10} /> Ampliar
                        </button>
                      </div>
                    </ProductImageCard>
                  )}
                </MessageBubble>
              ))}

              {loading && (
                <LoadingDots>
                  <FaSync className="spinner" />
                  <span>Consultando datos del negocio...</span>
                </LoadingDots>
              )}
              <div ref={messagesEndRef} />
            </MessagesArea>

            <SuggestionsContainer>
              <Chip onClick={() => handleChipClick('¿Cuánto se ha vendido hoy y qué hay en caja?')}>
                💵 Ventas Hoy
              </Chip>
              <Chip onClick={() => handleChipClick('¿Cuáles son las ventas del mes?')}>
                🗓️ Ventas del Mes
              </Chip>
              <Chip onClick={() => handleChipClick('Ventas de Waskar')}>
                👤 Ventas de Waskar
              </Chip>
              <Chip onClick={() => handleChipClick('¿Cuánto hemos vendido en toda la semana?')}>
                📅 Ventas de la Semana
              </Chip>
              <Chip onClick={() => handleChipClick('¿Cuánto vendió cada empleado o vendedor?')}>
                👥 Por Empleado
              </Chip>
              <Chip onClick={() => handleChipClick('¿Qué repuestos tienen stock crítico o bajo?')}>
                📦 Stock Bajo
              </Chip>
            </SuggestionsContainer>

            <InputArea onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
              <input
                type="text"
                placeholder="Pregunta ventas, repuestos, fotos..."
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

      {/* Lightbox Modal de fotografía a pantalla completa */}
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
