import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Grid, Card, CardContent,
  List, ListItem, ListItemText, ListItemIcon, Divider
} from '@mui/material';
import { PictureAsPdf, TableChart, Assessment, Download } from '@mui/icons-material';
import { supabase } from '../../lib/supabase';

export default function Reports() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    averageGrade: '0.00',
    attendanceRate: '0.0'
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [students, grades, attendance] = await Promise.all([
        supabase.from('students').select('*'),
        supabase.from('grades').select('score'),
        supabase.from('attendance').select('status'),
      ]);

      const s = students.data || [];
      const g = grades.data || [];
      const a = attendance.data || [];

      const avgGrade = g.length > 0
        ? (g.reduce((acc, x) => acc + x.score, 0) / g.length).toFixed(2)
        : '0.00';

      const attendanceRate = a.length > 0
        ? ((a.filter(x => x.status === 'present').length / a.length) * 100).toFixed(1)
        : '0.0';

      setStats({
        totalStudents: s.length,
        activeStudents: s.filter(x => x.status === 'active').length,
        averageGrade: avgGrade,
        attendanceRate: attendanceRate,
      });
    };

    fetchStats();
  }, []);

  const handleGenerateReport = (reportType: string) => {
    alert(`Generando reporte: ${reportType}\n\nEn producción, este reporte se exportaría a PDF o Excel.`);
  };

  const statCards = [
    { label: 'Total Estudiantes', value: stats.totalStudents },
    { label: 'Estudiantes Activos', value: stats.activeStudents },
    { label: 'Promedio General', value: stats.averageGrade },
    { label: 'Asistencia', value: `${stats.attendanceRate}%` },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Generación de Reportes (RF06)</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Exportación PDF/Excel | Exactitud 100%
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="overline">{stat.label}</Typography>
                <Typography variant="h3">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Reportes Académicos</Typography>
            <List>
              <ListItem>
                <ListItemIcon><PictureAsPdf color="error" /></ListItemIcon>
                <ListItemText primary="Reporte de Calificaciones" secondary="Calificaciones por estudiante y curso" />
                <Button variant="outlined" size="small" startIcon={<Download />}
                  onClick={() => handleGenerateReport('Calificaciones')}>PDF</Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon><TableChart color="success" /></ListItemIcon>
                <ListItemText primary="Reporte de Asistencia" secondary="Registro de asistencia por período" />
                <Button variant="outlined" size="small" startIcon={<Download />}
                  onClick={() => handleGenerateReport('Asistencia')}>Excel</Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon><Assessment color="primary" /></ListItemIcon>
                <ListItemText primary="Estadísticas del Bimestre" secondary="Análisis completo del período académico" />
                <Button variant="outlined" size="small" startIcon={<Download />}
                  onClick={() => handleGenerateReport('Estadísticas Bimestre')}>PDF</Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Reportes Administrativos</Typography>
            <List>
              <ListItem>
                <ListItemIcon><PictureAsPdf color="error" /></ListItemIcon>
                <ListItemText primary="Listado de Estudiantes" secondary="Nómina completa de estudiantes matriculados" />
                <Button variant="outlined" size="small" startIcon={<Download />}
                  onClick={() => handleGenerateReport('Listado Estudiantes')}>PDF</Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon><TableChart color="success" /></ListItemIcon>
                <ListItemText primary="Reporte de Matrículas" secondary="Matrículas procesadas por período" />
                <Button variant="outlined" size="small" startIcon={<Download />}
                  onClick={() => handleGenerateReport('Matrículas')}>Excel</Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon><Assessment color="primary" /></ListItemIcon>
                <ListItemText primary="Reporte de Usuarios" secondary="Lista de usuarios del sistema por rol" />
                <Button variant="outlined" size="small" startIcon={<Download />}
                  onClick={() => handleGenerateReport('Usuarios')}>PDF</Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}