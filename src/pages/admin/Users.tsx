import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { supabase } from '../../lib/supabase';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('*').order('name');
    if (data) setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpen = (user?: any) => {
    setEditingUser(user || { email: '', password: '', role: 'teacher', name: '' });
    setOpen(true);
  };

  const handleClose = () => { setOpen(false); setEditingUser(null); };

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
      ...(editingUser.password && { password: editingUser.password }),
    };
    if (editingUser.id) {
      await supabase.from('users').update(payload).eq('id', editingUser.id);
    } else {
      await supabase.from('users').insert(payload);
    }
    await fetchUsers();
    setLoading(false);
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      await supabase.from('users').delete().eq('id', id);
      await fetchUsers();
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: any = { admin: 'Administrador', teacher: 'Docente', parent: 'Padre/Tutor' };
    return labels[role] || role;
  };

  const getRoleColor = (role: string): any => {
    const colors: any = { admin: 'error', teacher: 'primary', parent: 'success' };
    return colors[role] || 'default';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Usuarios (RF02)</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Nuevo Usuario
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo Electrónico</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary">No hay usuarios registrados</Typography>
                </TableCell>
              </TableRow>
            ) : users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip label={getRoleLabel(user.role)} color={getRoleColor(user.role)} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(user)}><Edit /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser?.id ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
        <DialogContent>
          <TextField margin="normal" fullWidth label="Nombre Completo"
            value={editingUser?.name || ''}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
          <TextField margin="normal" fullWidth label="Correo Electrónico" type="email"
            value={editingUser?.email || ''}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
          <TextField margin="normal" fullWidth label="Contraseña" type="password"
            placeholder={editingUser?.id ? 'Dejar vacío para no cambiar' : ''}
            value={editingUser?.password || ''}
            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} />
          <TextField margin="normal" fullWidth select label="Rol"
            value={editingUser?.role || 'teacher'}
            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="teacher">Docente</MenuItem>
            <MenuItem value="parent">Padre/Tutor</MenuItem>
          </TextField>
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