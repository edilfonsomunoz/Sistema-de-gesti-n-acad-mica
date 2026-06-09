import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import { supabase } from '../../lib/supabase';

export default function Grades() {
  const [grades, setGrades] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    const [g, s, c] = await Promise.all([
      supabase.from('grades').select('*'),
      supabase.from('students').select('*'),
      supabase.from('courses').select('*'),
    ]);
    if (g.data) setGrades(g.data);
    if (s.data) setStudents(s.data);
    if (c.data) setCourses(c.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleOpen = (grade?: any) => {
    setEditingGrade(grade || {
      student_id: '', course_id: '', period: 'Bimestre 1',
      score: 0, comments: '', date: new Date().toISOString().split('T')[0]
    });
    setOpen(true);
  };

  const handleClose = () => { setOpen(false); setEditingGrade(null); };

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      student_id: editingGrade.student_id,
      course_id: editingGrade.course_id,
      period: editingGrade.period,
      score: editingGrade.score,
      comments: editingGrade.comments,
      date: editingGrade.date,
    };
    if (editingGrade.id) {
      await supabase.from('grades').update(payload).eq('id', editingGrade.id);
    } else {
      await supabase.from('grades').insert(payload);
    }
    await fetchAll();
    setLoading(false);
    handleClose();
  };

  const getStudentName = (id: string) => {
    const s = students.find(s => s.id === id);
    return s ? `${s.first_name} ${s.last_name}` : 'N/A';
  };

  const getCourseName = (id: string) => {
    const c = courses.find(c => c.id === id);
    return c?.name || 'N/A';
  };

  const getScoreColor = (score: number) => {
    if (score >= 18) return 'success';
    if (score >= 14) return 'primary';
    if (score >= 11) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Registro de Calificaciones (RF04)</Typography>
          <Typography variant="body2" color="text.secondary">
            Validación de rango (0-20) | Historial completo
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Nueva Calificación
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Período</TableCell>
              <TableCell>Nota</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Comentarios</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">No hay calificaciones registradas</Typography>
                </TableCell>
              </TableRow>
            ) : grades.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell>{getStudentName(grade.student_id)}</TableCell>
                <TableCell>{getCourseName(grade.course_id)}</TableCell>
                <TableCell>{grade.period}</TableCell>
                <TableCell>
                  <Chip label={grade.score} color={getScoreColor(grade.score)} size="small" />
                </TableCell>
                <TableCell>{new Date(grade.date).toLocaleDateString()}</TableCell>
                <TableCell>{grade.comments || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(grade)}><Edit /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGrade?.id ? 'Editar Calificación' : 'Nueva Calificación'}</DialogTitle>
        <DialogContent>
          <TextField margin="normal" fullWidth select label="Estudiante"
            value={editingGrade?.student_id || ''}
            onChange={(e) => setEditingGrade({ ...editingGrade, student_id: e.target.value })}>
            {students.map(s => (
              <MenuItem key={s.id} value={s.id}>
                {s.first_name} {s.last_name} ({s.grade}° {s.section})
              </MenuItem>
            ))}
          </TextField>
          <TextField margin="normal" fullWidth select label="Curso"
            value={editingGrade?.course_id || ''}
            onChange={(e) => setEditingGrade({ ...editingGrade, course_id: e.target.value })}>
            {courses.length === 0
              ? <MenuItem disabled>No hay cursos — agrégalos en Supabase</MenuItem>
              : courses.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)
            }
          </TextField>
          <TextField margin="normal" fullWidth select label="Período"
            value={editingGrade?.period || 'Bimestre 1'}
            onChange={(e) => setEditingGrade({ ...editingGrade, period: e.target.value })}>
            {['Bimestre 1','Bimestre 2','Bimestre 3','Bimestre 4'].map(p => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>
          <TextField margin="normal" fullWidth label="Nota (0-20)" type="number"
            inputProps={{ min: 0, max: 20 }}
            value={editingGrade?.score || 0}
            onChange={(e) => setEditingGrade({ ...editingGrade, score: Math.min(20, Math.max(0, Number(e.target.value))) })} />
          <TextField margin="normal" fullWidth label="Fecha" type="date"
            InputLabelProps={{ shrink: true }} value={editingGrade?.date || ''}
            onChange={(e) => setEditingGrade({ ...editingGrade, date: e.target.value })} />
          <TextField margin="normal" fullWidth multiline rows={3} label="Comentarios"
            value={editingGrade?.comments || ''}
            onChange={(e) => setEditingGrade({ ...editingGrade, comments: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}