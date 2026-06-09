import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Email } from '@mui/icons-material';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';
import unapLogo from '../imports/image-4.png';

// Nodo para el efecto de onda animada
interface WaveNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Múltiples curvas onduladas con colores vibrantes
      const curves = [
        { color: 'rgba(102,126,234,0.35)', amplitude: 80, frequency: 0.8, speed: 1, yBase: 0.35 },
        { color: 'rgba(118,75,162,0.3)', amplitude: 100, frequency: 0.6, speed: 0.7, yBase: 0.5 },
        { color: 'rgba(36,243,156,0.2)', amplitude: 60, frequency: 1, speed: 1.2, yBase: 0.65 },
        { color: 'rgba(167,139,250,0.25)', amplitude: 120, frequency: 0.5, speed: 0.5, yBase: 0.4 },
        { color: 'rgba(59,130,246,0.2)', amplitude: 70, frequency: 0.9, speed: 0.9, yBase: 0.7 },
      ];

      curves.forEach(({ color, amplitude, frequency, speed, yBase }) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;

        for (let x = 0; x <= canvas.width; x += 4) {
          const y =
            canvas.height * yBase +
            Math.sin(x * frequency * 0.005 + t * speed) * amplitude +
            Math.sin(x * frequency * 0.003 + t * speed * 0.5) * (amplitude * 0.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('Credenciales incorrectas. Intente nuevamente.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 40%, #0a0a18 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
      }}
    >
      {/* Canvas de ondas animadas */}
      <WaveCanvas />

      {/* Resplandores de fondo */}
      <Box sx={{
        position: 'absolute', top: '20%', left: '20%', width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(102,126,234,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '15%', right: '15%', width: 350, height: 350,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(118,75,162,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card glassmorphism */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 3,
          p: { xs: 3, md: 4.5 },
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Logo UNAP */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: '0 0 24px rgba(102,126,234,0.4)',
            background: 'white',
            p: 0.5,
          }}>
            <ImageWithFallback
              src={unapLogo}
              alt="Logo UNAP - Universidad Nacional del Altiplano"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Box>
        </Box>

        {/* Títulos */}
        <Box sx={{ textAlign: 'center', mb: 3.5 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: 'white', letterSpacing: 0.3, mb: 0.5 }}
          >
            Login
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>
            Universidad Nacional del Altiplano — Puno
          </Typography>
          <Typography
            variant="caption"
            display="block"
            sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', mt: 0.3 }}
          >
            Sistema de Gestión Académica
          </Typography>
        </Box>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            placeholder="Username"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 1.5,
                background: 'rgba(211,47,47,0.15)',
                border: '1px solid rgba(211,47,47,0.3)',
                color: '#fca5a5',
                '& .MuiAlert-icon': { color: '#fca5a5' },
                borderRadius: 2,
                fontSize: '0.8rem',
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 700,
              letterSpacing: 0.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '0.95rem',
              boxShadow: '0 8px 24px rgba(102,126,234,0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a72d8 0%, #6a3d92 100%)',
                boxShadow: '0 12px 32px rgba(102,126,234,0.5)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Login
          </Button>
        </form>

        {/* Credenciales de prueba */}
        <Box sx={{
          mt: 2,
          p: 2,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 2,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', display: 'block', mb: 0.8, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            Usuarios de prueba
          </Typography>
          {[
            { label: 'Administrador', email: 'admin@colegio.edu', pass: 'admin123' },
            { label: 'Docente', email: 'docente@colegio.edu', pass: 'docente123' },
            { label: 'Padre/Tutor', email: 'padre@email.com', pass: 'padre123' },
          ].map(({ label, email: e, pass }) => (
            <Box
              key={label}
              onClick={() => { setEmail(e); setPassword(pass); }}
              sx={{
                cursor: 'pointer',
                py: 0.4,
                px: 1,
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                '&:hover': { background: 'rgba(255,255,255,0.06)' },
              }}
            >
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>
                {label}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(102,126,234,0.7)', fontSize: '0.72rem' }}>
                {e}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ mt: 2.5, color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem' }}
        >
          © 2025 SGA — Conforme a IEEE Std 830-1998
        </Typography>
      </Box>
    </Box>
  );
}

// Estilos reutilizables para inputs en modo oscuro glassmorphism
const inputSx = {
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255,255,255,0.07)',
    borderRadius: 2,
    color: 'white',
    fontSize: '0.9rem',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: 'rgba(102,126,234,0.7)', borderWidth: 1 },
    '& input::placeholder': { color: 'rgba(255,255,255,0.3)', opacity: 1 },
  },
  '& .MuiInputLabel-root': { display: 'none' },
  mb: 0,
};
