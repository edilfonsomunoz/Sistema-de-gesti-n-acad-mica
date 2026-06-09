// Datos iniciales de los 30 estudiantes para el sistema de Avatar Matemático.
// La contraseña sigue el patrón: 3 letras del nombre + 3 letras del apellido + "123".

export interface StudentAvatar {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  grade: string;
  section: string;
  xp: number;
}

export const initialStudents: StudentAvatar[] = [
  { id: 'av1',  firstName: 'Valeria',  lastName: 'Torres',    email: 'valeria.torres@colegio.edu',    password: 'valtor123', grade: '1', section: 'A', xp: 285 },
  { id: 'av2',  firstName: 'Luis',     lastName: 'Quispe',    email: 'luis.quispe@colegio.edu',       password: 'luiqui123', grade: '1', section: 'A', xp: 140 },
  { id: 'av3',  firstName: 'María',    lastName: 'Condori',   email: 'maria.condori@colegio.edu',     password: 'marcon123', grade: '1', section: 'A', xp: 60  },
  { id: 'av4',  firstName: 'Carlos',   lastName: 'Mamani',    email: 'carlos.mamani@colegio.edu',     password: 'carmam123', grade: '1', section: 'A', xp: 410 },
  { id: 'av5',  firstName: 'Ana',      lastName: 'Flores',    email: 'ana.flores@colegio.edu',        password: 'anaflo123', grade: '1', section: 'A', xp: 195 },
  { id: 'av6',  firstName: 'Pedro',    lastName: 'Huanca',    email: 'pedro.huanca@colegio.edu',      password: 'pedhuan123', grade: '1', section: 'B', xp: 320 },
  { id: 'av7',  firstName: 'Rosa',     lastName: 'Ccama',     email: 'rosa.ccama@colegio.edu',        password: 'roscc123', grade: '1', section: 'B', xp: 75  },
  { id: 'av8',  firstName: 'Diego',    lastName: 'Apaza',     email: 'diego.apaza@colegio.edu',       password: 'dieapa123', grade: '1', section: 'B', xp: 255 },
  { id: 'av9',  firstName: 'Lucía',    lastName: 'Cusi',      email: 'lucia.cusi@colegio.edu',        password: 'luccus123', grade: '1', section: 'B', xp: 120 },
  { id: 'av10', firstName: 'Miguel',   lastName: 'Larico',    email: 'miguel.larico@colegio.edu',     password: 'miglar123', grade: '2', section: 'A', xp: 450 },
  { id: 'av11', firstName: 'Carmen',   lastName: 'Ticona',    email: 'carmen.ticona@colegio.edu',     password: 'cartic123', grade: '2', section: 'A', xp: 30  },
  { id: 'av12', firstName: 'José',     lastName: 'Pari',      email: 'jose.pari@colegio.edu',         password: 'jospar123', grade: '2', section: 'A', xp: 175 },
  { id: 'av13', firstName: 'Sandra',   lastName: 'Chura',     email: 'sandra.chura@colegio.edu',      password: 'sanchu123', grade: '2', section: 'A', xp: 90  },
  { id: 'av14', firstName: 'Eduardo',  lastName: 'Coaquira',  email: 'eduardo.coaquira@colegio.edu',  password: 'educoq123', grade: '2', section: 'B', xp: 390 },
  { id: 'av15', firstName: 'Patricia', lastName: 'Callo',     email: 'patricia.callo@colegio.edu',    password: 'patcal123', grade: '2', section: 'B', xp: 210 },
  { id: 'av16', firstName: 'Roberto',  lastName: 'Huayhua',   email: 'roberto.huayhua@colegio.edu',   password: 'robhua123', grade: '2', section: 'B', xp: 50  },
  { id: 'av17', firstName: 'Gloria',   lastName: 'Turpo',     email: 'gloria.turpo@colegio.edu',      password: 'glotup123', grade: '2', section: 'B', xp: 310 },
  { id: 'av18', firstName: 'Felipe',   lastName: 'Puma',      email: 'felipe.puma@colegio.edu',       password: 'felpum123', grade: '3', section: 'A', xp: 130 },
  { id: 'av19', firstName: 'Teresa',   lastName: 'Vilca',     email: 'teresa.vilca@colegio.edu',      password: 'tervil123', grade: '3', section: 'A', xp: 270 },
  { id: 'av20', firstName: 'Andrés',   lastName: 'Cáceres',   email: 'andres.caceres@colegio.edu',    password: 'andcac123', grade: '3', section: 'A', xp: 480 },
  { id: 'av21', firstName: 'Elena',    lastName: 'Pilco',     email: 'elena.pilco@colegio.edu',       password: 'elephi123', grade: '3', section: 'A', xp: 160 },
  { id: 'av22', firstName: 'Marco',    lastName: 'Ramos',     email: 'marco.ramos@colegio.edu',       password: 'marram123', grade: '3', section: 'B', xp: 85  },
  { id: 'av23', firstName: 'Julia',    lastName: 'Cruz',      email: 'julia.cruz@colegio.edu',        password: 'julcru123', grade: '3', section: 'B', xp: 340 },
  { id: 'av24', firstName: 'Alberto',  lastName: 'Hancco',    email: 'alberto.hancco@colegio.edu',    password: 'albhan123', grade: '3', section: 'B', xp: 20  },
  { id: 'av25', firstName: 'Yesenia',  lastName: 'Inca',      email: 'yesenia.inca@colegio.edu',      password: 'yesinc123', grade: '3', section: 'B', xp: 235 },
  { id: 'av26', firstName: 'Oswaldo',  lastName: 'Sanca',     email: 'oswaldo.sanca@colegio.edu',     password: 'oswsan123', grade: '4', section: 'A', xp: 420 },
  { id: 'av27', firstName: 'Beatriz',  lastName: 'Molina',    email: 'beatriz.molina@colegio.edu',    password: 'beamol123', grade: '4', section: 'A', xp: 110 },
  { id: 'av28', firstName: 'Héctor',   lastName: 'Maquera',   email: 'hector.maquera@colegio.edu',    password: 'hecmaq123', grade: '4', section: 'A', xp: 295 },
  { id: 'av29', firstName: 'Claudia',  lastName: 'Zapana',    email: 'claudia.zapana@colegio.edu',    password: 'clazap123', grade: '4', section: 'B', xp: 155 },
  { id: 'av30', firstName: 'Néstor',   lastName: 'Quispe',    email: 'nestor.quispe@colegio.edu',     password: 'nesqui123', grade: '4', section: 'B', xp: 370 },
];
