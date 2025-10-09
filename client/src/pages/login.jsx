import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import * as api from '../service/api.js';
import { useAuth } from '../context/AuthContext.jsx';

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
      const data = await api.login({ nombre_usuario, password });
      const token = data.token ?? data.accessToken ?? null;
      const user = data.user ?? data.usuario ?? data.data?.user ?? null;

      if (token && !user) {
        try {
          const me = await api.fetchMe(token);
          if (me) {
            await auth.login(me, token);
            setSubmitting(false);
            navigate('/dashboard', { replace: true });
            return;
          }
        } catch (e) {
          console.warn('Advertencia: fetchMe falló tras login exitoso. Token obtenido pero usuario no cargado.', e);
        }
      }

      if (!token || !user) {
        throw new Error('Respuesta de login inválida: falta token o user');
      }

      await auth.login(user, token);
      navigate('/dashboard', { replace: true });

    } catch (err) {
      console.error('Error durante el proceso de Login:', err.message || JSON.stringify(err));
      setErrMsg(err.message || 'Error en el inicio de sesión. Verifique sus credenciales.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleInputChange = (setter) => (e) => {
    setErrMsg('');
    setter(e.target.value);
  }

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
            onChange={handleInputChange(setNombreUsuario)}
          />
          <Input
            aria-label="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={handleInputChange(setPassword)}
          />

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>
          {errMsg && <ErrorMessage role="alert">{errMsg}</ErrorMessage>}
        </form>
      </FormContainer>
    </PageWrapper>
  );
};

export default Login;