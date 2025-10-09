// client/src/pages/login.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import * as api from '../service/api.js';
import { useAuth } from '../context/AuthContext.jsx';

/* ===========================
   Styled components (completos)
   =========================== */
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(-45deg, #e0eafc, #cfdef3, #eef1f5);
  background-size: 400% 400%;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1.2rem;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.12);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: #3498db;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.12s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: #2980b9;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: white;
  background-color: #e74c3c;
  padding: 0.8rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

/* ===========================
   Component
   =========================== */

const Login = () => {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    if (!nombre_usuario || !password) {
      setErrMsg('Ingresa usuario y contraseña.');
      return;
    }

    setSubmitting(true);
    try {
      // Llamada al helper del servicio: espera { token, user } o al menos token
      const data = await api.login({ nombre_usuario, password });
      const token = data.token ?? data.accessToken ?? null;
      const user = data.user ?? data.usuario ?? data.data?.user ?? null;

      // Si backend devuelve token pero no user, intentamos fetchMe (siempre que haya token)
      if (token && !user) {
        try {
          const me = await api.fetchMe(token);
          if (me) {
            await auth.login(me, token);
            setSubmitting(false);
            return;
          }
        } catch (e) {
          // Mantener este console.warn en caso de fallar fetchMe tras login exitoso.
          console.warn('Advertencia: fetchMe falló tras login exitoso. Token obtenido pero usuario no cargado.', e); 
        }
      }

      if (!token || !user) {
        throw new Error('Respuesta de login inválida: falta token o user');
      }

      // login en memoria (AuthContext)
      await auth.login(user, token);

      // navigate al dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // CAMBIO: Simplificamos el console.error para evitar logs redundantes
      console.error('Error durante el proceso de Login:', err.message || JSON.stringify(err));
      // err puede ser Error o un objeto con message
      setErrMsg(err.message || (err.response && (err.response.data?.msg || JSON.stringify(err.response.data))) || 'Error en login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <Title>MultirepuestosRG</Title>
        <Subtitle>Bienvenido de nuevo</Subtitle>

        <form onSubmit={handleSubmit} aria-label="login-form">
          <Input
            aria-label="usuario"
            type="text"
            placeholder="Nombre de usuario"
            value={nombre_usuario}
            onChange={(e) => setNombre_usuario_and_clear_error(e.target.value)}
          />
          <Input
            aria-label="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword_and_clear_error(e.target.value)}
          />

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>
          {errMsg && <ErrorMessage role="alert">{errMsg}</ErrorMessage>}
        </form>
      </FormContainer>
    </PageWrapper>
  );

  // helper functions (local) to keep error cleared on change
  function setNombre_usuario_and_clear_error(v) {
    setErrMsg('');
    setNombreUsuario(v);
  }
  function setPassword_and_clear_error(v) {
    setErrMsg('');
    setPassword(v);
  }
};

export default Login;