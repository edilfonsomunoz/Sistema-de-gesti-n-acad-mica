// Mock data for SGA (Sistema de Gestión Académica)
import { initialStudents } from './avatarData';

export type UserRole = 'admin' | 'teacher' | 'parent' | 'student';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  dateOfBirth: string;
  grade: string;
  section: string;
  parentId: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
}

export interface Course {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  grade: string;
  section: string;
  schedule: string;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  period: string;
  score: number;
  comments?: string;
  date: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'exam' | 'holiday' | 'meeting' | 'other';
}

// Mock users (password is same as email for demo)
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@colegio.edu',
    password: 'admin123',
    role: 'admin',
    name: 'María González',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    email: 'docente@colegio.edu',
    password: 'docente123',
    role: 'teacher',
    name: 'Carlos Ramírez',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    email: 'padre@email.com',
    password: 'padre123',
    role: 'parent',
    name: 'Ana Martínez',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  // 30 cuentas de estudiantes generadas desde avatarData
  ...initialStudents.map((s) => ({
    id: s.id,
    email: s.email,
    password: s.password,
    role: 'student' as UserRole,
    name: `${s.firstName} ${s.lastName}`,
  })),
];

export const mockStudents: Student[] = [
  {
    id: 's1',
    firstName: 'Juan',
    lastName: 'Martínez',
    dni: '12345678',
    dateOfBirth: '2010-05-15',
    grade: '1',
    section: 'A',
    parentId: '3',
    enrollmentDate: '2024-03-01',
    status: 'active'
  },
  {
    id: 's2',
    firstName: 'Sofía',
    lastName: 'López',
    dni: '23456789',
    dateOfBirth: '2010-08-22',
    grade: '1',
    section: 'A',
    parentId: '3',
    enrollmentDate: '2024-03-01',
    status: 'active'
  },
  {
    id: 's3',
    firstName: 'Diego',
    lastName: 'Fernández',
    dni: '34567890',
    dateOfBirth: '2009-11-10',
    grade: '2',
    section: 'B',
    parentId: '3',
    enrollmentDate: '2024-03-01',
    status: 'active'
  }
];

export const mockCourses: Course[] = [
  {
    id: 'c1',
    name: 'Matemáticas',
    code: 'MAT-101',
    teacherId: '2',
    grade: '1',
    section: 'A',
    schedule: 'Lunes y Miércoles 8:00-10:00'
  },
  {
    id: 'c2',
    name: 'Comunicación',
    code: 'COM-101',
    teacherId: '2',
    grade: '1',
    section: 'A',
    schedule: 'Martes y Jueves 8:00-10:00'
  },
  {
    id: 'c3',
    name: 'Ciencias Naturales',
    code: 'CIE-101',
    teacherId: '2',
    grade: '1',
    section: 'A',
    schedule: 'Viernes 8:00-11:00'
  }
];

export const mockGrades: Grade[] = [
  {
    id: 'g1',
    studentId: 's1',
    courseId: 'c1',
    period: 'Bimestre 1',
    score: 18,
    comments: 'Excelente participación',
    date: '2025-04-10'
  },
  {
    id: 'g2',
    studentId: 's1',
    courseId: 'c2',
    period: 'Bimestre 1',
    score: 16,
    comments: 'Buen desempeño',
    date: '2025-04-12'
  },
  {
    id: 'g3',
    studentId: 's1',
    courseId: 'c3',
    period: 'Bimestre 1',
    score: 17,
    date: '2025-04-14'
  }
];

export const mockAttendance: Attendance[] = [
  {
    id: 'a1',
    studentId: 's1',
    courseId: 'c1',
    date: '2025-05-15',
    status: 'present'
  },
  {
    id: 'a2',
    studentId: 's1',
    courseId: 'c2',
    date: '2025-05-15',
    status: 'present'
  },
  {
    id: 'a3',
    studentId: 's2',
    courseId: 'c1',
    date: '2025-05-15',
    status: 'late',
    notes: 'Llegó 10 minutos tarde'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    fromId: '2',
    toId: '3',
    subject: 'Reunión de padres',
    content: 'Estimada Sra. Martínez, le informamos que tendremos una reunión de padres el próximo viernes.',
    date: '2025-05-10T10:00:00',
    read: false
  }
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Examen de Matemáticas',
    description: 'Evaluación del primer bimestre',
    date: '2025-05-20',
    type: 'exam'
  },
  {
    id: 'e2',
    title: 'Día del Trabajo',
    description: 'Feriado nacional',
    date: '2025-05-01',
    type: 'holiday'
  },
  {
    id: 'e3',
    title: 'Reunión de docentes',
    description: 'Planificación académica',
    date: '2025-05-18',
    type: 'meeting'
  }
];
