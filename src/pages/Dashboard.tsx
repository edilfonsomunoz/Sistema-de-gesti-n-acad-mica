import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  People,
  School,
  Grade,
  EventNote,
  TrendingUp,
  CheckCircle,
  TaskAlt,
  Pending,
  NotificationsActive
} from '@mui/icons-material';
import { mockStudents, mockCourses, mockGrades, mockAttendance } from '../data/mockData';

export default function Dashboard() {
  const { user } = useAuth();

  const StatCard = ({ title, value, icon, gradient, iconBg }: any) => (
    <Card
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 28px rgba(102,126,234,0.3)'
        }
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 1
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: iconBg,
              width: 56,
              height: 56,
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          opacity: 0.1,
          background: 'radial-gradient(circle at top right, rgba(255,255,255,0.4), transparent)'
        }}
      />
    </Card>
  );

  const renderAdminDashboard = () => (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5
          }}
        >
          Bienvenido, {user?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Panel de control del administrador
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Estudiantes"
            value={mockStudents.length}
            icon={<People sx={{ fontSize: 28 }} />}
            gradient={['#667eea', '#764ba2']}
            iconBg="rgba(255,255,255,0.2)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cursos Activos"
            value={mockCourses.length}
            icon={<School sx={{ fontSize: 28 }} />}
            gradient={['#4facfe', '#00f2fe']}
            iconBg="rgba(255,255,255,0.2)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Calificaciones"
            value={mockGrades.length}
            icon={<Grade sx={{ fontSize: 28 }} />}
            gradient={['#fa709a', '#fee140']}
            iconBg="rgba(255,255,255,0.2)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Asistencias Hoy"
            value={mockAttendance.filter(a => a.status === 'present').length}
            icon={<EventNote sx={{ fontSize: 28 }} />}
            gradient={['#30cfd0', '#330867']}
            iconBg="rgba(255,255,255,0.2)"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <People sx={{ color: '#667eea' }} />
              Estudiantes Recientes
            </Typography>
            {mockStudents.slice(0, 3).map((student, index) => (
              <Box
                key={student.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: index < 2 ? 2.5 : 0,
                  p: 1.5,
                  borderRadius: 2,
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'rgba(102,126,234,0.04)'
                  }
                }}
              >
                <Avatar
                  sx={{
                    mr: 2,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    fontWeight: 700
                  }}
                >
                  {student.firstName[0]}{student.lastName[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.25 }}>
                    {student.firstName} {student.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={`${student.grade}° ${student.section}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: 'rgba(102,126,234,0.1)',
                        color: '#667eea',
                        fontWeight: 600
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      DNI: {student.dni}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <NotificationsActive sx={{ color: '#764ba2' }} />
              Actividad Reciente
            </Typography>
            <Box
              sx={{
                mb: 2.5,
                p: 1.5,
                borderRadius: 2,
                background: 'rgba(76,175,80,0.05)',
                borderLeft: '3px solid #4caf50'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TaskAlt sx={{ color: '#4caf50', fontSize: 20, mt: 0.2 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                    Matrícula procesada para Juan Martínez
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hace 2 horas
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                mb: 2.5,
                p: 1.5,
                borderRadius: 2,
                background: 'rgba(33,150,243,0.05)',
                borderLeft: '3px solid #2196f3'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Grade sx={{ color: '#2196f3', fontSize: 20, mt: 0.2 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                    Reporte generado: Estadísticas del Bimestre 1
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hace 5 horas
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'rgba(102,126,234,0.05)',
                borderLeft: '3px solid #667eea'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <People sx={{ color: '#667eea', fontSize: 20, mt: 0.2 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                    Nuevo usuario registrado: Carlos Ramírez
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hace 1 día
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  const renderTeacherDashboard = () => (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5
          }}
        >
          Bienvenido, Profesor {user?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Panel de control del docente
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mis Cursos"
            value={mockCourses.filter(c => c.teacherId === user?.id).length}
            icon={<School sx={{ fontSize: 28 }} />}
            gradient={['#667eea', '#764ba2']}
            iconBg="rgba(255,255,255,0.2)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Estudiantes"
            value={mockStudents.length}
            icon={<People sx={{ fontSize: 28 }} />}
            gradient={['#4facfe', '#00f2fe']}
            iconBg="rgba(255,255,255,0.2)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Asistencia Hoy"
            value="95%"
            icon={<CheckCircle sx={{ fontSize: 28 }} />}
            gradient={['#43e97b', '#38f9d7']}
            iconBg="rgba(255,255,255,0.2)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Promedio General"
            value="17.2"
            icon={<TrendingUp sx={{ fontSize: 28 }} />}
            gradient={['#fa709a', '#fee140']}
            iconBg="rgba(255,255,255,0.2)"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <School sx={{ color: '#667eea' }} />
              Mis Cursos
            </Typography>
            {mockCourses.map((course, index) => (
              <Box
                key={course.id}
                sx={{
                  mb: index < mockCourses.length - 1 ? 2.5 : 0,
                  p: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(102,126,234,0.05), rgba(118,75,162,0.05))',
                  border: '1px solid rgba(102,126,234,0.15)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5, color: '#667eea' }}>
                  {course.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={`${course.grade}° ${course.section}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      bgcolor: 'rgba(102,126,234,0.15)',
                      color: '#667eea',
                      fontWeight: 600
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {course.schedule}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Pending sx={{ color: '#764ba2' }} />
              Tareas Pendientes
            </Typography>
            <Box
              sx={{
                mb: 2.5,
                p: 1.5,
                borderRadius: 2,
                background: 'rgba(244,67,54,0.05)',
                borderLeft: '3px solid #f44336'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Grade sx={{ color: '#f44336', fontSize: 20, mt: 0.2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                    Registrar calificaciones de Matemáticas
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Vencimiento: 20 de Mayo
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                mb: 2.5,
                p: 1.5,
                borderRadius: 2,
                background: 'rgba(255,152,0,0.05)',
                borderLeft: '3px solid #ff9800'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <EventNote sx={{ color: '#ff9800', fontSize: 20, mt: 0.2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                    Completar asistencia del día
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pendiente
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'rgba(102,126,234,0.05)',
                borderLeft: '3px solid #667eea'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <NotificationsActive sx={{ color: '#667eea', fontSize: 20, mt: 0.2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                    Responder mensaje de padre de familia
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    2 mensajes sin leer
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  const renderParentDashboard = () => {
    const myChildren = mockStudents.filter(s => s.parentId === user?.id);

    return (
      <>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5
            }}
          >
            Bienvenido, {user?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Panel de seguimiento académico
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Mis Hijos"
              value={myChildren.length}
              icon={<People sx={{ fontSize: 28 }} />}
              gradient={['#667eea', '#764ba2']}
              iconBg="rgba(255,255,255,0.2)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Promedio General"
              value="17.0"
              icon={<Grade sx={{ fontSize: 28 }} />}
              gradient={['#43e97b', '#38f9d7']}
              iconBg="rgba(255,255,255,0.2)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Asistencia"
              value="98%"
              icon={<CheckCircle sx={{ fontSize: 28 }} />}
              gradient={['#4facfe', '#00f2fe']}
              iconBg="rgba(255,255,255,0.2)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Mensajes"
              value="2"
              icon={<EventNote sx={{ fontSize: 28 }} />}
              gradient={['#fa709a', '#fee140']}
              iconBg="rgba(255,255,255,0.2)"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <People sx={{ color: '#667eea' }} />
                Mis Hijos
              </Typography>
              {myChildren.map((student, index) => (
                <Box
                  key={student.id}
                  sx={{
                    mb: index < myChildren.length - 1 ? 2.5 : 0,
                    p: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, rgba(102,126,234,0.05), rgba(118,75,162,0.05))',
                    border: '1px solid rgba(102,126,234,0.15)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        mr: 2,
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        fontWeight: 700
                      }}
                    >
                      {student.firstName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.25 }}>
                        {student.firstName} {student.lastName}
                      </Typography>
                      <Chip
                        label={`${student.grade}° ${student.section}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          bgcolor: 'rgba(102,126,234,0.15)',
                          color: '#667eea',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <EventNote sx={{ color: '#764ba2' }} />
                Próximos Eventos
              </Typography>
              <Box
                sx={{
                  mb: 2.5,
                  p: 1.5,
                  borderRadius: 2,
                  background: 'rgba(244,67,54,0.05)',
                  borderLeft: '3px solid #f44336'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Grade sx={{ color: '#f44336', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                      Examen de Matemáticas
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      20 de Mayo, 2025
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  mb: 2.5,
                  p: 1.5,
                  borderRadius: 2,
                  background: 'rgba(33,150,243,0.05)',
                  borderLeft: '3px solid #2196f3'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <People sx={{ color: '#2196f3', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                      Reunión de padres
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      18 de Mayo, 2025
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: 'rgba(102,126,234,0.05)',
                  borderLeft: '3px solid #667eea'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <NotificationsActive sx={{ color: '#667eea', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                      Nuevo mensaje del profesor
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hace 1 día
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <Box>
      {user?.role === 'admin' && renderAdminDashboard()}
      {user?.role === 'teacher' && renderTeacherDashboard()}
      {user?.role === 'parent' && renderParentDashboard()}
    </Box>
  );
}
