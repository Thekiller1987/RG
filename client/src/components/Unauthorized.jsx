import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { getPermissionMeta } from '../utils/permissions';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f1f5f9;
  text-align: center;
  padding: 1.5rem;
  font-family: 'Inter', sans-serif;
`;

const MessageBox = styled.div`
  animation: ${fadeIn} 0.35s ease-out;
  background-color: white;
  border-radius: 20px;
  max-width: 480px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.16);
  border: 2px solid #fca5a5;
`;

const TopBanner = styled.div`
  background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%);
  color: #ffffff;
  padding: 1.8rem 1.5rem;

  .icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  h1 {
    margin: 0;
    font-size: 1.45rem;
    font-weight: 800;
  }
`;

const Body = styled.div`
  padding: 1.8rem;
  color: #334155;

  p {
    margin: 0 0 1.2rem;
    font-size: 0.96rem;
    line-height: 1.55;
  }
`;

const BackButton = styled(Link)`
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  padding: 0.85rem 1.5rem;
  background: #0f172a;
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 800;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1e293b;
  }
`;

const Unauthorized = () => {
  const { state } = useLocation();
  const role = state?.role || 'Usuario';
  const reqPerm = Array.isArray(state?.requiredPermission)
    ? state.requiredPermission[0]
    : state?.requiredPermission;
  const meta = reqPerm ? getPermissionMeta(reqPerm) : null;

  return (
    <Wrapper>
      <MessageBox>
        <TopBanner>
          <div className="icon">🚫</div>
          <h1>No tienes permiso para realizar esta acción</h1>
        </TopBanner>
        <Body>
          <p>
            Tu perfil actual (<strong>{role}</strong>) no tiene habilitado el acceso a este módulo o función del sistema.
          </p>
          {meta && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '1.3rem',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '0.73rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>
                {meta.category}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#7f1d1d', marginTop: 3 }}>
                🔒 Permiso requerido: {meta.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#991b1b', marginTop: 4 }}>
                {meta.description}
              </div>
            </div>
          )}
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Si necesitas acceder a esta función, solicita al Administrador Principal que marque esta casilla en tu configuración de usuario.
          </p>
          <BackButton to="/dashboard">Volver al Dashboard</BackButton>
        </Body>
      </MessageBox>
    </Wrapper>
  );
};

export default Unauthorized;
