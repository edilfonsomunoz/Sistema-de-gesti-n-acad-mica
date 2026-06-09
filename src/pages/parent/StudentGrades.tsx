import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Grid,
  LinearProgress
} from '@mui/material';
import { TrendingUp, Grade as GradeIcon } from '@mui/icons-material';
import { mockGrades, mockStudents, mockCourses } from '../../data/mockData';

export default function StudentGrades() {
  const { user } = useAuth();
  const myChildren = mockStudents.filter(s => s.parentId === user?.id);
  const [selectedStudent, setSelectedStudent] = useState(myChildren[0]?.id || '');

  const studentGrades = mockGrades.filter(g => g.studentId === selectedStudent);

  const getCourseName = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    return course?.name || 'N/A';
  };

  const getScoreColor = (score: number) => {
    if (score >= 18) return 'success';
    if (score >= 14) return 'primary';
    if (score >= 11) return 'warning';
    return 'error';
  };

  const calculateAverage = () => {
    if (studentGrades.length === 0) return 0;
    const sum = studentGrades.reduce((acc, g) => acc + g.score, 0);
    return (sum / studentGrades.length).toFixed(2);
  };

  const getPerformanceMessage = (avg: number) => {
    if (avg >= 18) return 'Excelente rendimiento';
    if (avg >= 14) return 'Buen rendimiento';
    if (avg >= 11) return 'Rendimiento regular';
    return 'Necesita mejorar';
  };

  const average = Number(calculateAverage());
  const student = myChildren.find(s => s.id === selectedStudent);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Consulta de Notas (RF11)
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Vista de solo lectura por estudiante
      </Typography>

      {myChildren.length > 1 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            select
            label="Seleccionar Hijo/a"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            {myChildren.map(child => (
              <MenuItem key={child.id} value={child.id}>
                {child.firstName} {child.lastName} ({child.grade}° {child.section})
              </MenuItem>
            ))}
          </TextField>
        </Paper>
      )}

      {student && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <GradeIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                    <Box>
                      <Typography color="text.secondary" variant="overline">
                        Promedio General
                      </Typography>
                      <Typography variant="h3" component="div">
                        {average}
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(average / 20) * 100}
                    sx={{ mb: 1, height: 8, borderRadius: 4 }}
                    color={getScoreColor(average)}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {getPerformanceMessage(average)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp color="success" sx={{ mr: 1, fontSize: 32 }} />
                    <Box>
                      <Typography color="text.secondary" variant="overline">
                        Información del Estudiante
                      </Typography>
                      <Typography variant="h6" component="div">
                        {student.firstName} {student.lastName}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Grado: {student.grade}° {student.section}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    DNI: {student.dni}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estado: <Chip label="Activo" color="success" size="small" />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Curso</TableCell>
                  <TableCell>Período</TableCell>
                  <TableCell>Nota</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Comentarios</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentGrades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        No hay calificaciones registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  studentGrades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {getCourseName(grade.courseId)}
                        </Typography>
                      </TableCell>
                      <TableCell>{grade.period}</TableCell>
                      <TableCell>
                        <Chip
                          label={grade.score}
                          color={getScoreColor(grade.score)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(grade.date).toLocaleDateString()}</TableCell>
                      <TableCell>{grade.comments || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
