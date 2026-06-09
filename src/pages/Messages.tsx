import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box, Paper, Typography, List, ListItem, ListItemText,
  ListItemAvatar, Avatar, Divider, TextField, Button, Chip,
  Grid, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem
} from '@mui/material';
import { Send, Mail, MailOutline } from '@mui/icons-material';
import { supabase } from '../lib/supabase';

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [openCompose, setOpenCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({ receiver_id: '', subject: '', body: '' });
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    const [m, u] = await Promise.all([
      supabase.from('messages').select('*').or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`).order('created_at', { ascending: false }),
      supabase.from('users').select('*'),
    ]);
    if (m.data) setMessages(m.data);
    if (u.data) setUsers(u.data);
  };

  useEffect(() => { if (user?.id) fetchAll(); }, [user]);

  const handleSelectMessage = async (message: any) => {
    setSelectedMessage(message);
    if (!message.read && message.receiver_id === user?.id) {
      await supabase.from('messages').update({ read: true }).eq('id', message.id);
      setMessages(messages.map(m => m.id === message.id ? { ...m, read: true } : m));
    }
  };

  const handleSend = async () => {
    setLoading(true);
    await supabase.from('messages').insert({
      sender_id: user?.id,
      receiver_id: newMessage.receiver_id,
      subject: newMessage.subject,
      body: newMessage.body,
    });
    await fetchAll();
    setLoading(false);
    setOpenCompose(false);
    setNewMessage({ receiver_id: '', subject: '', body: '' });
  };

  const getUserName = (id: string) => {
    const u = users.find(u => u.id === id);
    return u?.name || 'Desconocido';
  };

  const unreadCount = messages.filter(m => !m.read && m.receiver_id === user?.id).length;
  const availableUsers = users.filter(u => u.id !== user?.id);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Mensajería Interna (RF08)</Typography>
          <Typography variant="body2" color="text.secondary">
            Canal privado entre actores del sistema
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Send />} onClick={() => setOpenCompose(true)}>
          Nuevo Mensaje
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">
                Bandeja de Entrada
                {unreadCount > 0 && (
                  <Chip label={unreadCount} color="error" size="small" sx={{ ml: 1 }} />
                )}
              </Typography>
            </Box>
            <List>
              {messages.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No hay mensajes" secondary="Comienza una conversación" />
                </ListItem>
              ) : messages.map((message) => (
                <Box key={message.id}>
                  <ListItem
                    button
                    onClick={() => handleSelectMessage(message)}
                    selected={selectedMessage?.id === message.id}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {!message.read && message.receiver_id === user?.id ? <Mail /> : <MailOutline />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body2"
                            fontWeight={!message.read && message.receiver_id === user?.id ? 'bold' : 'normal'}
                          >
                            {message.sender_id === user?.id
                              ? `Para: ${getUserName(message.receiver_id)}`
                              : `De: ${getUserName(message.sender_id)}`}
                          </Typography>
                          {!message.read && message.receiver_id === user?.id && (
                            <Chip label="Nuevo" color="primary" size="small" />
                          )}
                        </Box>
                      }
                      secondary={message.subject}
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedMessage ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>{selectedMessage.subject}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  De: {getUserName(selectedMessage.sender_id)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {selectedMessage.body}
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 5, textAlign: 'center' }}>
              <MailOutline sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Selecciona un mensaje para leer
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={openCompose} onClose={() => setOpenCompose(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Mensaje</DialogTitle>
        <DialogContent>
          <TextField margin="normal" fullWidth select label="Destinatario"
            value={newMessage.receiver_id}
            onChange={(e) => setNewMessage({ ...newMessage, receiver_id: e.target.value })}>
            {availableUsers.map(u => (
              <MenuItem key={u.id} value={u.id}>
                {u.name} ({u.role === 'admin' ? 'Administrador' : u.role === 'teacher' ? 'Docente' : 'Padre'})
              </MenuItem>
            ))}
          </TextField>
          <TextField margin="normal" fullWidth label="Asunto"
            value={newMessage.subject}
            onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })} />
          <TextField margin="normal" fullWidth multiline rows={6} label="Mensaje"
            value={newMessage.body}
            onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompose(false)}>Cancelar</Button>
          <Button onClick={handleSend} variant="contained" startIcon={<Send />}
            disabled={!newMessage.receiver_id || !newMessage.subject || !newMessage.body || loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}