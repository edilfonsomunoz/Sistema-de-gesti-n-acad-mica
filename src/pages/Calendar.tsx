import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import { Add, Event, School, BeachAccess, Group } from '@mui/icons-material';
import { mockCalendarEvents } from '../data/mockData';

export default function Calendar() {
  const [events, setEvents] = useState(mockCalendarEvents);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'other' as 'exam' | 'holiday' | 'meeting' | 'other'
  });

  const handleSave = () => {
    setEvents([...events, { ...newEvent, id: `e${Date.now()}` }]);
    setOpen(false);
    setNewEvent({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'other'
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return <Event color="error" />;
      case 'holiday':
        return <BeachAccess color="success" />;
      case 'meeting':
        return <Group color="primary" />;
      default:
        return <School color="action" />;
    }
  };

  const getEventColor = (type: string) => {
    const colors = {
      exam: 'error',
      holiday: 'success',
      meeting: 'primary',
      other: 'default'
    };
    return colors[type as keyof typeof colors] as any;
  };

  const getEventTypeLabel = (type: string) => {
    const labels = {
      exam: 'Examen',
      holiday: 'Feriado',
      meeting: 'Reunión',
      other: 'Otro'
    };
    return labels[type as keyof typeof labels];
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingEvents = sortedEvents.filter(e => new Date(e.date) >= new Date());
  const pastEvents = sortedEvents.filter(e => new Date(e.date) < new Date());

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Calendario Académico (RF09)</Typography>
          <Typography variant="body2" color="text.secondary">
            Publicación y notificación de eventos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Nuevo Evento
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Event sx={{ mr: 1 }} />
              Próximos Eventos
            </Typography>
            <List>
              {upcomingEvents.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No hay eventos próximos"
                    secondary="Agrega eventos al calendario"
                  />
                </ListItem>
              ) : (
                upcomingEvents.map((event) => (
                  <ListItem key={event.id}>
                    <ListItemIcon>
                      {getEventIcon(event.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="bold">
                            {event.title}
                          </Typography>
                          <Chip
                            label={getEventTypeLabel(event.type)}
                            size="small"
                            color={getEventColor(event.type)}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {event.description}
                          </Typography>
                          <Typography variant="caption" color="primary">
                            📅 {new Date(event.date).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Event sx={{ mr: 1 }} />
              Eventos Pasados
            </Typography>
            <List>
              {pastEvents.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No hay eventos pasados"
                  />
                </ListItem>
              ) : (
                pastEvents.map((event) => (
                  <ListItem key={event.id}>
                    <ListItemIcon>
                      {getEventIcon(event.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" color="text.secondary">
                            {event.title}
                          </Typography>
                          <Chip
                            label={getEventTypeLabel(event.type)}
                            size="small"
                            color={getEventColor(event.type)}
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {event.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            📅 {new Date(event.date).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Evento</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Título del Evento"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={3}
            label="Descripción"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Fecha"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            select
            label="Tipo de Evento"
            value={newEvent.type}
            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
          >
            <MenuItem value="exam">Examen</MenuItem>
            <MenuItem value="holiday">Feriado</MenuItem>
            <MenuItem value="meeting">Reunión</MenuItem>
            <MenuItem value="other">Otro</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!newEvent.title || !newEvent.date}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
