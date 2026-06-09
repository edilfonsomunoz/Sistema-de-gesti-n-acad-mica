import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { StudentAvatar, initialStudents } from '../data/avatarData';

const STORAGE_KEY = 'sga_avatar_students';

interface XPLogEntry {
  date: string;
  amount: number;
  reason: string;
}

export interface StudentAvatarWithLog extends StudentAvatar {
  xpLog: XPLogEntry[];
}

interface AvatarContextType {
  students: StudentAvatarWithLog[];
  addXP: (studentId: string, amount: number, reason: string) => void;
  addStudent: (firstName: string, lastName: string, grade: string, section: string) => void;
  resetStudentXP: (studentId: string) => void;
  getStudentByEmail: (email: string) => StudentAvatarWithLog | undefined;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

function loadStudents(): StudentAvatarWithLog[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // si el JSON está corrupto, reiniciar con datos iniciales
  }
  return initialStudents.map((s) => ({ ...s, xpLog: [] }));
}

function saveStudents(students: StudentAvatarWithLog[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// Genera email y contraseña automáticos para nuevos estudiantes
function generateCredentials(firstName: string, lastName: string, existingEmails: string[]) {
  const base = `${firstName.toLowerCase().replace(/\s+/g, '').substring(0, 6)}.${lastName.toLowerCase().replace(/\s+/g, '').substring(0, 6)}`;
  let email = `${base}@colegio.edu`;
  let counter = 2;
  while (existingEmails.includes(email)) {
    email = `${base}${counter}@colegio.edu`;
    counter++;
  }
  const pass = `${firstName.substring(0, 3).toLowerCase()}${lastName.substring(0, 3).toLowerCase()}123`;
  return { email, password: pass };
}

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<StudentAvatarWithLog[]>(loadStudents);

  const persist = useCallback((updated: StudentAvatarWithLog[]) => {
    setStudents(updated);
    saveStudents(updated);
  }, []);

  const addXP = useCallback(
    (studentId: string, amount: number, reason: string) => {
      const updated = students.map((s) => {
        if (s.id !== studentId) return s;
        const newXP = Math.max(0, s.xp + amount);
        const logEntry: XPLogEntry = {
          date: new Date().toLocaleDateString('es-PE'),
          amount,
          reason: reason.trim() || (amount > 0 ? 'Puntos agregados' : 'Puntos descontados'),
        };
        return { ...s, xp: newXP, xpLog: [logEntry, ...s.xpLog].slice(0, 20) };
      });
      persist(updated);
    },
    [students, persist]
  );

  const addStudent = useCallback(
    (firstName: string, lastName: string, grade: string, section: string) => {
      const existingEmails = students.map((s) => s.email);
      const { email, password } = generateCredentials(firstName, lastName, existingEmails);
      const newId = `av${Date.now()}`;
      const newStudent: StudentAvatarWithLog = {
        id: newId,
        firstName,
        lastName,
        email,
        password,
        grade,
        section,
        xp: 0,
        xpLog: [],
      };
      persist([...students, newStudent]);
    },
    [students, persist]
  );

  const resetStudentXP = useCallback(
    (studentId: string) => {
      const updated = students.map((s) =>
        s.id === studentId ? { ...s, xp: 0, xpLog: [] } : s
      );
      persist(updated);
    },
    [students, persist]
  );

  const getStudentByEmail = useCallback(
    (email: string) => students.find((s) => s.email === email),
    [students]
  );

  return (
    <AvatarContext.Provider value={{ students, addXP, addStudent, resetStudentXP, getStudentByEmail }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error('useAvatar must be used within AvatarProvider');
  return ctx;
}
