import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  InputAdornment,
  IconButton,
  Tooltip,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Collapse,
} from '@mui/material';
import {
  EmojiEvents,
  AutoAwesome,
  Add,
  Search,
  PersonAdd,
  ExpandMore,
  ExpandLess,
  History,
  Refresh,
  FilterList,
} from '@mui/icons-material';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';
import { useAvatar, StudentAvatarWithLog } from '../contexts/AvatarContext';
import { useAuth } from '../contexts/AuthContext';

import bronzeImg from '../imports/image.png';
import plataImg from '../imports/image-1.png';
import oroImg from '../imports/image-2.png';
import heroicoImg from '../imports/image-3.png';

// ─── Definición de etapas ─────────────────────────────────────────────────────

const STAGES = [
  { name: 'Bronce',   grade: 'C',  gradeLabel: 'En Proceso',          xpMin: 0,   xpMax: 100, color: '#CD7F32', glow: 'rgba(205,127,50,0.5)',   bg: 'linear-gradient(135deg,#8B4513,#CD7F32,#DAA520)', image: bronzeImg,  emoji: '🥉' },
  { name: 'Plata',    grade: 'B',  gradeLabel: 'Logrado',             xpMin: 100, xpMax: 250, color: '#C0C0C0', glow: 'rgba(192,192,192,0.5)', bg: 'linear-gradient(135deg,#708090,#C0C0C0,#E8E8E8)', image: plataImg,   emoji: '🥈' },
  { name: 'Oro',      grade: 'A',  gradeLabel: 'Logro Destacado',     xpMin: 250, xpMax: 400, color: '#FFD700', glow: 'rgba(255,215,0,0.6)',    bg: 'linear-gradient(135deg,#B8860B,#FFD700,#FFFACD)', image: oroImg,     emoji: '🥇' },
  { name: 'Heróico',  grade: 'AD', gradeLabel: 'Logro Sobresaliente', xpMin: 400, xpMax: 500, color: '#9B59B6', glow: 'rgba(155,89,182,0.6)',   bg: 'linear-gradient(135deg,#4A235A,#9B59B6,#E8DAEF)', image: heroicoImg, emoji: '⚡' },
];

function getStage(xp: number) {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (xp >= STAGES[i].xpMin) return STAGES[i];
  }
  return STAGES[0];
}

function getProgress(xp: number, stage: typeof STAGES[0]) {
  if (stage.name === 'Heróico') return Math.min(100, Math.round(((xp - 400) / 100) * 100));
  const range = stage.xpMax - stage.xpMin;
  return Math.min(100, Math.round(((xp - stage.xpMin) / range) * 100));
}

// ─── Vista personal del estudiante ────────────────────────────────────────────

function StudentView({ student }: { student: StudentAvatarWithLog }) {
  const stage = getStage(student.xp);
  const progress = getProgress(student.xp, stage);
  const nextStage = STAGES.find((s) => s.xpMin > stage.xpMin);
  const [showLog, setShowLog] = useState(false);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      p: { xs: 2, md: 4 }, position: 'relative', overflow: 'hidden',
    }}>
      {/* Orbes decorativos */}
      {[
        { top: '10%', left: '5%', size: 300, color: 'rgba(102,126,234,0.15)' },
        { bottom: '15%', right: '8%', size: 250, color: 'rgba(155,89,182,0.15)' },
      ].map((o, i) => (
        <Box key={i} sx={{ position: 'absolute', width: o.size, height: o.size, borderRadius: '50%',
          background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
          top: o.top, left: o.left, bottom: o.bottom, right: o.right, pointerEvents: 'none' }} />
      ))}

      <Paper elevation={0} sx={{
        width: '100%', maxWidth: 500,
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4,
        p: { xs: 3, md: 5 }, color: 'white', position: 'relative', overflow: 'hidden',
        boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${stage.glow}`,
        transition: 'box-shadow 0.6s ease',
      }}>
        {/* Borde superior coloreado */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: stage.bg, transition: 'background 0.6s ease' }} />

        {/* Título */}
        <Box sx={{ textAlign: 'center', mb: 2.5 }}>
          <Typography variant="h5" fontWeight="bold" sx={{
            background: 'linear-gradient(90deg, #a78bfa, #60a5fa, #f472b6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            🌟 Mi Avatar Matemático
          </Typography>
        </Box>

        {/* Nombre del estudiante */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3,
          background: 'rgba(255,255,255,0.05)', borderRadius: 2, py: 1, px: 2,
          border: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="body1" fontWeight={700}>
            ✨ {student.firstName} {student.lastName}
          </Typography>
          <Chip label={`${student.grade}° ${student.section}`} size="small"
            sx={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }} />
        </Box>

        {/* Avatar */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, position: 'relative' }}>
          <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%',
            background: `radial-gradient(circle, ${stage.glow} 0%, transparent 70%)`,
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
          <Box sx={{
            width: 170, height: 170, borderRadius: '50%', overflow: 'hidden',
            border: `3px solid ${stage.color}`,
            boxShadow: `0 0 30px ${stage.glow}, 0 0 60px ${stage.glow}`,
            transition: 'all 0.6s ease', position: 'relative', zIndex: 1,
          }}>
            <ImageWithFallback src={stage.image} alt={`Avatar ${stage.name}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        </Box>

        {/* Etapa */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{
            color: stage.color, textShadow: `0 0 20px ${stage.glow}`, transition: 'color 0.5s ease',
          }}>
            {stage.emoji} {stage.name}
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1.5 }}>
            <Chip icon={<EmojiEvents sx={{ color: `${stage.color} !important`, fontSize: '16px !important' }} />}
              label={`Calificación: ${stage.grade}`} size="small"
              sx={{ background: `${stage.color}22`, border: `1px solid ${stage.color}50`, color: 'white', fontWeight: 700 }} />
            <Chip icon={<AutoAwesome sx={{ color: '#a78bfa !important', fontSize: '14px !important' }} />}
              label={`${student.xp} XP`} size="small"
              sx={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', color: 'white', fontWeight: 700 }} />
          </Stack>
        </Box>

        {/* Barra de progreso */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
              Progreso hacia {nextStage ? nextStage.name : '¡Máximo nivel!'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700 }}>
              {nextStage ? `${stage.xpMax - student.xp} XP restantes` : '¡Nivel Máximo! 🎉'}
            </Typography>
          </Box>
          <Box sx={{ height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <Box sx={{
              height: '100%', width: `${progress}%`, borderRadius: 7,
              background: 'linear-gradient(90deg, #f59e0b, #f97316, #ef4444)',
              boxShadow: '0 0 10px rgba(249,115,22,0.6)',
              transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.4 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem' }}>{stage.xpMin} XP</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{progress}%</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem' }}>{stage.xpMax} XP</Typography>
          </Box>
        </Box>

        {/* Etapas mini */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 3 }}>
          {STAGES.map((s) => (
            <Box key={s.name} sx={{
              flex: 1, textAlign: 'center', p: 0.8, borderRadius: 1.5,
              background: s.name === stage.name ? `${s.color}22` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${s.name === stage.name ? s.color + '70' : 'rgba(255,255,255,0.08)'}`,
              opacity: student.xp < s.xpMin ? 0.35 : 1, transition: 'all 0.3s ease',
            }}>
              <Typography sx={{ fontSize: '1.1rem', lineHeight: 1 }}>{s.emoji}</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: s.name === stage.name ? s.color : 'rgba(255,255,255,0.4)', fontWeight: s.name === stage.name ? 700 : 400, fontSize: '0.62rem', mt: 0.2 }}>
                {s.name}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Historial de XP */}
        {student.xpLog.length > 0 && (
          <Box>
            <Button
              size="small"
              startIcon={showLog ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setShowLog(!showLog)}
              sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', textTransform: 'none', mb: 1 }}
            >
              <History sx={{ fontSize: 14, mr: 0.5 }} />
              Historial de puntos ({student.xpLog.length})
            </Button>
            <Collapse in={showLog}>
              <Box sx={{ background: 'rgba(255,255,255,0.04)', borderRadius: 2, p: 1.5, border: '1px solid rgba(255,255,255,0.07)', maxHeight: 160, overflowY: 'auto' }}>
                {student.xpLog.map((entry, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: i < student.xpLog.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>
                      {entry.date} — {entry.reason}
                    </Typography>
                    <Typography variant="caption" sx={{ color: entry.amount >= 0 ? '#4ade80' : '#f87171', fontWeight: 700, fontSize: '0.72rem' }}>
                      {entry.amount >= 0 ? '+' : ''}{entry.amount} XP
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

// ─── Tarjeta individual de estudiante (vista docente/admin) ───────────────────

function StudentCard({ student, onAddXP }: { student: StudentAvatarWithLog; onAddXP: (s: StudentAvatarWithLog) => void }) {
  const stage = getStage(student.xp);
  const progress = getProgress(student.xp, stage);

  return (
    <Paper elevation={0} sx={{
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      border: `1px solid ${stage.color}30`,
      borderRadius: 3, p: 2.5, color: 'white', position: 'relative', overflow: 'hidden',
      boxShadow: `0 8px 24px rgba(0,0,0,0.3), 0 0 16px ${stage.glow}`,
      transition: 'all 0.3s ease',
      '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 16px 40px rgba(0,0,0,0.4), 0 0 24px ${stage.glow}` },
    }}>
      {/* Borde superior */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: stage.bg }} />

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        {/* Avatar pequeño */}
        <Box sx={{
          width: 64, height: 64, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
          border: `2px solid ${stage.color}`,
          boxShadow: `0 0 12px ${stage.glow}`,
        }}>
          <ImageWithFallback src={stage.image} alt={stage.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
            <Box>
              <Typography variant="body2" fontWeight={700} sx={{ color: 'white', lineHeight: 1.2 }}>
                {student.firstName} {student.lastName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>
                {student.grade}° {student.section} · {student.email}
              </Typography>
            </Box>
            <Chip label={`${stage.emoji} ${stage.name}`} size="small" sx={{
              background: `${stage.color}22`, border: `1px solid ${stage.color}50`,
              color: stage.color, fontWeight: 700, fontSize: '0.68rem', height: 22,
            }} />
          </Box>

          {/* XP y calificación */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Chip label={`${student.xp} XP`} size="small" sx={{
              background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
              color: '#c4b5fd', fontWeight: 700, fontSize: '0.68rem', height: 20,
            }} />
            <Chip label={`Nota: ${stage.grade}`} size="small" sx={{
              background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)',
              fontSize: '0.68rem', height: 20,
            }} />
          </Box>

          {/* Barra de progreso */}
          <Box sx={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', mb: 0.4 }}>
            <Box sx={{
              height: '100%', width: `${progress}%`, borderRadius: 3,
              background: 'linear-gradient(90deg, #f59e0b, #f97316)',
              transition: 'width 0.6s ease',
            }} />
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.64rem' }}>
            {progress}% hacia {STAGES.find((s) => s.xpMin > stage.xpMin)?.name ?? 'Máximo nivel'}
          </Typography>
        </Box>
      </Box>

      {/* Botón agregar XP */}
      <Button
        variant="contained"
        size="small"
        startIcon={<Add />}
        onClick={() => onAddXP(student)}
        fullWidth
        sx={{
          mt: 1.5,
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          textTransform: 'none', fontWeight: 700, fontSize: '0.78rem',
          borderRadius: 1.5,
          '&:hover': { background: 'linear-gradient(90deg, #5a72d8, #6a3d92)', boxShadow: '0 4px 16px rgba(102,126,234,0.4)' },
        }}
      >
        Agregar Puntos XP
      </Button>
    </Paper>
  );
}

// ─── Dialog para agregar XP ────────────────────────────────────────────────────

function AddXPDialog({
  student,
  open,
  onClose,
}: {
  student: StudentAvatarWithLog | null;
  open: boolean;
  onClose: () => void;
}) {
  const { addXP } = useAvatar();
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const pts = parseInt(amount, 10);
    if (isNaN(pts) || pts === 0) { setError('Ingresa un número válido (puede ser negativo para descontar).'); return; }
    if (!student) return;
    addXP(student.id, pts, reason);
    setAmount('');
    setReason('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setAmount(''); setReason(''); setError('');
    onClose();
  };

  const quickAmounts = [5, 10, 15, 20, 25, 50];

  if (!student) return null;
  const stage = getStage(student.xp);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: {
        background: 'linear-gradient(135deg, #1a1a3e 0%, #2d2060 100%)',
        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, color: 'white',
      }}}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${stage.color}`, flexShrink: 0 }}>
            <ImageWithFallback src={stage.image} alt={stage.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'white', lineHeight: 1.2 }}>
              {student.firstName} {student.lastName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
              XP actual: {student.xp} · {stage.emoji} {stage.name}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      <DialogContent sx={{ pt: 2 }}>
        {/* Montos rápidos */}
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.68rem' }}>
          Puntos rápidos
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mb: 2 }}>
          {quickAmounts.map((q) => (
            <Button key={q} variant="outlined" size="small"
              onClick={() => setAmount(String(q))}
              sx={{
                borderColor: amount === String(q) ? '#667eea' : 'rgba(255,255,255,0.18)',
                color: amount === String(q) ? '#667eea' : 'rgba(255,255,255,0.65)',
                background: amount === String(q) ? 'rgba(102,126,234,0.15)' : 'transparent',
                fontSize: '0.75rem', minWidth: 0, px: 1.5,
                '&:hover': { borderColor: '#667eea', color: '#667eea' },
              }}>
              +{q}
            </Button>
          ))}
        </Stack>

        {/* Cantidad manual */}
        <TextField
          label="Cantidad de puntos"
          placeholder="Ej: 10 o -5"
          type="number"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setError(''); }}
          fullWidth
          size="small"
          helperText="Usa número negativo para descontar puntos"
          error={!!error}
          InputProps={{
            startAdornment: <InputAdornment position="start"><AutoAwesome sx={{ color: '#a78bfa', fontSize: 16 }} /></InputAdornment>,
          }}
          sx={darkFieldSx}
        />

        {/* Motivo */}
        <TextField
          label="Motivo (opcional)"
          placeholder="Ej: Tarea excelente, Participación en clase..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          size="small"
          sx={{ ...darkFieldSx, mt: 2 }}
          inputProps={{ maxLength: 60 }}
        />

        {error && (
          <Typography variant="caption" sx={{ color: '#f87171', mt: 0.5, display: 'block' }}>{error}</Typography>
        )}

        {/* Preview */}
        {amount && !isNaN(parseInt(amount, 10)) && parseInt(amount, 10) !== 0 && (
          <Box sx={{ mt: 2, p: 1.5, background: 'rgba(102,126,234,0.12)', borderRadius: 1.5, border: '1px solid rgba(102,126,234,0.25)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Resultado: {student.xp} XP → <strong style={{ color: '#c4b5fd' }}>{Math.max(0, student.xp + parseInt(amount, 10))} XP</strong>
              {' '}({parseInt(amount, 10) >= 0 ? `+${amount}` : amount} puntos)
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button onClick={handleClose} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} sx={{
          background: 'linear-gradient(90deg, #667eea, #764ba2)', textTransform: 'none', fontWeight: 700,
          '&:hover': { background: 'linear-gradient(90deg, #5a72d8, #6a3d92)' },
        }}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Dialog para agregar estudiante ───────────────────────────────────────────

function AddStudentDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addStudent } = useAvatar();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [grade, setGrade] = useState('1');
  const [section, setSection] = useState('A');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) { setError('El nombre y apellido son obligatorios.'); return; }
    addStudent(firstName.trim(), lastName.trim(), grade, section);
    setFirstName(''); setLastName(''); setGrade('1'); setSection('A'); setError('');
    onClose();
  };

  const handleClose = () => {
    setFirstName(''); setLastName(''); setGrade('1'); setSection('A'); setError('');
    onClose();
  };

  // Preview de email generado
  const previewEmail = firstName && lastName
    ? `${firstName.toLowerCase().replace(/\s+/g, '').substring(0, 6)}.${lastName.toLowerCase().replace(/\s+/g, '').substring(0, 6)}@colegio.edu`
    : '';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { background: 'linear-gradient(135deg, #1a1a3e 0%, #2d2060 100%)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, color: 'white' } }}>
      <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
        <PersonAdd sx={{ mr: 1, verticalAlign: 'middle', color: '#a78bfa' }} />
        Agregar Nuevo Estudiante
      </DialogTitle>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <TextField label="Nombres" value={firstName} onChange={(e) => { setFirstName(e.target.value); setError(''); }}
            fullWidth size="small" placeholder="Ej: Valeria" sx={darkFieldSx} />
          <TextField label="Apellidos" value={lastName} onChange={(e) => { setLastName(e.target.value); setError(''); }}
            fullWidth size="small" placeholder="Ej: Torres" sx={darkFieldSx} />
          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ flex: 1, ...darkFieldSx }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.45)' }}>Grado</InputLabel>
              <Select value={grade} onChange={(e) => setGrade(e.target.value)} label="Grado"
                sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' } }}>
                {['1','2','3','4','5'].map((g) => <MenuItem key={g} value={g}>{g}°</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ flex: 1, ...darkFieldSx }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.45)' }}>Sección</InputLabel>
              <Select value={section} onChange={(e) => setSection(e.target.value)} label="Sección"
                sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' } }}>
                {['A','B','C','D'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
          {previewEmail && (
            <Box sx={{ p: 1.5, background: 'rgba(255,255,255,0.05)', borderRadius: 1.5, border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', display: 'block', mb: 0.3, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Credenciales generadas automáticamente
              </Typography>
              <Typography variant="caption" sx={{ color: '#c4b5fd', display: 'block', fontSize: '0.75rem' }}>
                Email: {previewEmail}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '0.72rem' }}>
                Contraseña: {firstName ? firstName.substring(0, 3).toLowerCase() : '...'}{lastName ? lastName.substring(0, 3).toLowerCase() : '...'}123
              </Typography>
            </Box>
          )}
          {error && <Typography variant="caption" sx={{ color: '#f87171' }}>{error}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button onClick={handleClose} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} startIcon={<PersonAdd />} sx={{
          background: 'linear-gradient(90deg, #667eea, #764ba2)', textTransform: 'none', fontWeight: 700,
          '&:hover': { background: 'linear-gradient(90deg, #5a72d8, #6a3d92)' },
        }}>
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Vista docente/admin: grid de todos los estudiantes ───────────────────────

function TeacherView() {
  const { students } = useAvatar();
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('Todos');
  const [filterGrade, setFilterGrade] = useState('Todos');
  const [selectedStudent, setSelectedStudent] = useState<StudentAvatarWithLog | null>(null);
  const [xpDialogOpen, setXpDialogOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const full = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchSearch = full.includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
      const stage = getStage(s.xp);
      const matchStage = filterStage === 'Todos' || stage.name === filterStage;
      const matchGrade = filterGrade === 'Todos' || s.grade === filterGrade;
      return matchSearch && matchStage && matchGrade;
    });
  }, [students, search, filterStage, filterGrade]);

  // Estadísticas resumen
  const stats = useMemo(() => {
    const counts = { Bronce: 0, Plata: 0, Oro: 0, 'Heróico': 0 };
    students.forEach((s) => { counts[getStage(s.xp).name as keyof typeof counts]++; });
    const totalXP = students.reduce((a, s) => a + s.xp, 0);
    return { counts, totalXP, avgXP: students.length ? Math.round(totalXP / students.length) : 0 };
  }, [students]);

  const handleOpenXP = (s: StudentAvatarWithLog) => {
    setSelectedStudent(s);
    setXpDialogOpen(true);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1650 50%, #0f0c29 100%)',
      p: { xs: 2, md: 3 },
    }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{
              background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              🌟 Gestión de Avatares Matemáticos
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
              {students.length} estudiantes registrados
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setAddStudentOpen(true)}
            sx={{
              background: 'linear-gradient(90deg, #667eea, #764ba2)', textTransform: 'none', fontWeight: 700,
              borderRadius: 2,
              '&:hover': { background: 'linear-gradient(90deg, #5a72d8, #6a3d92)', transform: 'translateY(-1px)' },
            }}>
            Agregar Estudiante
          </Button>
        </Box>

        {/* Estadísticas */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2.5 }}>
          {STAGES.map((s) => (
            <Paper key={s.name} elevation={0} sx={{
              flex: '1 1 100px', minWidth: 90,
              background: `${s.color}14`, border: `1px solid ${s.color}30`,
              borderRadius: 2, p: 1.5, textAlign: 'center',
            }}>
              <Typography sx={{ fontSize: '1.4rem', lineHeight: 1 }}>{s.emoji}</Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: s.color, lineHeight: 1.2 }}>
                {stats.counts[s.name as keyof typeof stats.counts]}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem' }}>{s.name}</Typography>
            </Paper>
          ))}
          <Paper elevation={0} sx={{
            flex: '1 1 100px', minWidth: 90,
            background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: 2, p: 1.5, textAlign: 'center',
          }}>
            <AutoAwesome sx={{ color: '#a78bfa', fontSize: '1.4rem' }} />
            <Typography variant="h6" fontWeight={800} sx={{ color: '#a78bfa', lineHeight: 1.2 }}>{stats.avgXP}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem' }}>XP Promedio</Typography>
          </Paper>
        </Box>

        {/* Filtros */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: '1 1 220px', ...darkFieldSx }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} /></InputAdornment> }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={filterStage} onChange={(e) => setFilterStage(e.target.value)}
              startAdornment={<FilterList sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 16, mr: 0.5 }} />}
              sx={{ color: 'white', background: 'rgba(255,255,255,0.06)', borderRadius: 1.5, fontSize: '0.82rem',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.45)' } }}>
              <MenuItem value="Todos">Todos los niveles</MenuItem>
              {STAGES.map((s) => <MenuItem key={s.name} value={s.name}>{s.emoji} {s.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}
              sx={{ color: 'white', background: 'rgba(255,255,255,0.06)', borderRadius: 1.5, fontSize: '0.82rem',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.45)' } }}>
              <MenuItem value="Todos">Todos los grados</MenuItem>
              {['1','2','3','4','5'].map((g) => <MenuItem key={g} value={g}>{g}° grado</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
        {filtered.length < students.length && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', mt: 1, display: 'block' }}>
            Mostrando {filtered.length} de {students.length} estudiantes
          </Typography>
        )}
      </Box>

      {/* Grid de estudiantes */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.1rem' }}>No se encontraron estudiantes</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' }, gap: 2 }}>
          {filtered.map((student) => (
            <StudentCard key={student.id} student={student} onAddXP={handleOpenXP} />
          ))}
        </Box>
      )}

      <AddXPDialog student={selectedStudent} open={xpDialogOpen} onClose={() => { setXpDialogOpen(false); setSelectedStudent(null); }} />
      <AddStudentDialog open={addStudentOpen} onClose={() => setAddStudentOpen(false)} />
    </Box>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export default function AvatarMatematico() {
  const { user } = useAuth();
  const { getStudentByEmail } = useAvatar();

  // Si el usuario es estudiante, mostrar su vista personal
  if (user?.role === 'student') {
    const studentData = getStudentByEmail(user.email);
    if (studentData) return <StudentView student={studentData} />;
  }

  // Admin y docente ven el panel de gestión completo
  return <TeacherView />;
}

// ─── Estilos reutilizables para inputs oscuros ─────────────────────────────────
const darkFieldSx = {
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255,255,255,0.07)', borderRadius: 1.5, color: 'white',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused fieldset': { borderColor: 'rgba(102,126,234,0.7)', borderWidth: 1 },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#a78bfa' },
  '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' },
  '& input': { color: 'white' },
  '& input::placeholder': { color: 'rgba(255,255,255,0.25)', opacity: 1 },
};
