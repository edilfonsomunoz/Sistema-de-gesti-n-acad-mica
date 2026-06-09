import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid
} from '@mui/material';
import { Add, Edit, Visibility } from '@mui/icons-material';
import { supabase } from '../../lib/supabase';

export default function Enrollment() {
  const [students, setStudents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    const { data, error } = await supabase.from('students').select('*');
    if (!error && data) setStudents(data);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleOpen = (student?: any) => {
    setEditingStudent(student || {
      first_name: '', last_name: '', dni: '',
      date_of_birth: '', grade: '1', section: 'A',
      enrollment_date: new Date().toISOString().split('T')[0],
      status: 'active'
    });
    setOpen(true);
  };

  const handleClose = () => { setOpen(false); setEditingStudent(null); };

  const handleSave = async () => {
    setLoading(true);
    if (editingStudent.id) {
      await supabase.from('students').update({
        first_name: editingStudent.first_name,
        last_name: editingStudent.last_name,
        dni: editingStudent.dni,
        date_of_birth: editingStudent.date_of_birth,
        grade: editingStudent.grade,
        section: editingStudent.section,
        status: editingStudent.status,
      }).eq('id', editingStudent.id);
    } else {
      await supabase.from('students').insert({
        first_name: editingStudent.first_name,
        last_name: editingStudent.last_name,
        dni: editingStudent.dni,
        date_of_birth: editingStudent.date_of_birth,
        grade: editingStudent.grade,
        section: editingStudent.section,
        enrollment_date: editingStudent.enrollment_date,
        status: editingStudent.status,
      });
    }
    await fetchStudents();
    setLoading(false);
    handleClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Matrícula de Estudiantes (RF03)</Typography>
          <Typography variant="body2" color="text.secondary">
            Proceso de matrícula &lt; 3 minutos | Sin duplicados
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Nueva Matrícula
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Fecha Nacimiento</TableCell>
              <TableCell>Grado</TableCell>
              <TableCell>Sección</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">No hay estudiantes registrados</Typography>
                </TableCell>
              </TableRow>
            ) : students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {student.first_name} {student.last_name}
                  </Typography>
                </TableCell>
                <TableCell>{student.dni}</TableCell>
                <TableCell>{student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{student.grade}°</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>
                  <Chip
                    label={student.status === 'active' ? 'Activo' : 'Inactivo'}
                    color={student.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(student)}><Edit /></IconButton>
                  <IconButton size="small"><Visibility /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingStudent?.id ? 'Editar Matrícula' : 'Nueva Matrícula'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nombres" value={editingStudent?.first_name || ''}
                onChange={(e) => setEditingStudent({ ...editingStudent, first_name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Apellidos" value={editingStudent?.last_name || ''}
                onChange={(e) => setEditingStudent({ ...editingStudent, last_name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="DNI" value={editingStudent?.dni || ''}
                onChange={(e) => setEditingStudent({ ...editingStudent, dni: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Fecha de Nacimiento" type="date"
                InputLabelProps={{ shrink: true }} value={editingStudent?.date_of_birth || ''}
                onChange={(e) => setEditingStudent({ ...editingStudent, date_of_birth: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth select label="Grado" value={editingStudent?.grade || '1'}
                onChange={(e) => setEditingStudent({ ...editingStudent, grade: e.target.value })}>
                {[1,2,3,4,5].map(g => <MenuItem key={g} value={String(g)}>{g}°</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth select label="Sección" value={editingStudent?.section || 'A'}
                onChange={(e) => setEditingStudent({ ...editingStudent, section: e.target.value })}>
                {['A','B','C'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth select label="Estado" value={editingStudent?.status || 'active'}
                onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value })}>
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Matrícula'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}