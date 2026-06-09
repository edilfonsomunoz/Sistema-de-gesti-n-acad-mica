import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, TextField, MenuItem,
  Grid, Card, CardContent
} from '@mui/material';
import { CheckCircle, Cancel, Schedule, EventAvailable } from '@mui/icons-material';
import { supabase } from '../../lib/supabase';

export default function Attendance() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('');

  const fetchAll = async () => {
    const [a, s, c] = await Promise.all([
      supabase.from('attendance').select('*'),
      supabase.from('students').select('*'),
      supabase.from('courses').select('*'),
    ]);
    if (a.data) setAttendance(a.data);
    if (s.data) setStudents(s.data);
    if (c.data) {
      setCourses(c.data);
      if (!selectedCourse && c.data.length > 0) setSelectedCourse(c.data[0].id);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleMark = async (studentId: string, status: string) => {
    const existing = attendance.find(
      a => a.student_id === studentId && a.course_id === selectedCourse && a.date === selectedDate
    );
    if (existing) {
      await supabase.from('attendance').update({ status }).eq('id', existing.id);
    } else {
      await supabase.from('attendance').insert({
        student_id: studentId,
        course_id: selectedCourse,
        date: selectedDate,
        status,
        notes: ''
      });
    }
    await fetchAll();
  };

  const getStatus = (studentId: string) => {
    const r = attendance.find(
      a => a.student_id === studentId && a.course_id === selectedCourse && a.date === selectedDate
    );
    return r?.status || null;
  };

  const getStatusColor = (status: string | null): any => {
    const colors: any = { present: 'success', absent: 'error', late: 'warning', excused: 'info' };
    return status ? colors[status] : 'default';
  };

  const getStatusLabel = (status: string | null) => {
    const labels: any = { present: 'Presente', absent: 'Ausente', late: 'Tardanza', excused: 'Justificado' };
    return status ? labels[status] : 'Sin marcar';
  };

  const course = courses.find(c => c.id === selectedCourse);
  const studentsInCourse = students.filter(s => s.grade === course?.grade && s.section === course?.section);

  const stats = {
    present: attendance.filter(a => a.date === selectedDate && a.course_id === selectedCourse && a.status === 'present').length,
    absent: attendance.filter(a => a.date === selectedDate && a.course_id === selectedCourse && a.status === 'absent').length,
    late: attendance.filter(a => a.date === selectedDate && a.course_id === selectedCourse && a.status === 'late').length,
    total: studentsInCourse.length,
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Control de Asistencia (RF05)</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Notificación a padres | Compatible con dispositivos móviles
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          { label: 'Presentes', value: stats.present, icon: <CheckCircle color="success" sx={{ fontSize: 40 }} />, },
          { label: 'Ausentes', value: stats.absent, icon: <Cancel color="error" sx={{ fontSize: 40 }} />, },
          { label: 'Tardanzas', value: stats.late, icon: <Schedule color="warning" sx={{ fontSize: 40 }} />, },
          { label: 'Total', value: stats.total, icon: <EventAvailable color="primary" sx={{ fontSize: 40 }} />, },
        ].map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="overline">{stat.label}</Typography>
                    <Typography variant="h4">{stat.value}</Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Fecha" type="date" InputLabelProps={{ shrink: true }}
              value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Curso" value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}>
              {courses.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.name} ({c.grade}° {c.section})</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Grado</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentsInCourse.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary">No hay estudiantes en este curso</Typography>
                </TableCell>
              </TableRow>
            ) : studentsInCourse.map((student) => {
              const status = getStatus(student.id);
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {student.first_name} {student.last_name}
                    </Typography>
                  </TableCell>
                  <TableCell>{student.grade}° {student.section}</TableCell>
                  <TableCell>
                    <Chip label={getStatusLabel(status)} color={getStatusColor(status)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {(['present', 'absent', 'late'] as const).map((s) => (
                        <Button key={s} size="small"
                          variant={status === s ? 'contained' : 'outlined'}
                          color={s === 'present' ? 'success' : s === 'absent' ? 'error' : 'warning'}
                          onClick={() => handleMark(student.id, s)}>
                          {s === 'present' ? 'Presente' : s === 'absent' ? 'Ausente' : 'Tarde'}
                        </Button>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}