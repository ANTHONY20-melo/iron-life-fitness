import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const PASSWORDS = {
  admin: bcrypt.hashSync('admin123', 10),
  trainer: bcrypt.hashSync('trainer123', 10),
  student: bcrypt.hashSync('student123', 10),
}

const TRAINER_NAMES = [
  { full: 'Rafael Oliveira', cref: 'CREF 12345-G/SP', specialty: 'Musculação e Funcional', phone: '(11) 99001-1001' },
  { full: 'Camila Santos', cref: 'CREF 12346-G/SP', specialty: 'Pilates e Alongamento', phone: '(11) 99001-1002' },
  { full: 'Diego Ferreira', cref: 'CREF 12347-G/SP', specialty: 'CrossFit e HIIT', phone: '(11) 99001-1003' },
]

const STUDENT_DATA = [
  { full: 'Lucas Silva', gender: 'MALE' as const, goal: 'Ganhar massa muscular', weight: 78, height: 178 },
  { full: 'Maria Oliveira', gender: 'FEMALE' as const, goal: 'Perder peso', weight: 65, height: 163 },
  { full: 'Pedro Costa', gender: 'MALE' as const, goal: 'Definir o corpo', weight: 82, height: 175 },
  { full: 'Ana Souza', gender: 'FEMALE' as const, goal: 'Melhorar resistência', weight: 58, height: 160 },
  { full: 'Gabriel Lima', gender: 'MALE' as const, goal: 'Ganhar força', weight: 90, height: 182 },
  { full: 'Juliana Almeida', gender: 'FEMALE' as const, goal: 'Tonificar músculos', weight: 55, height: 158 },
  { full: 'Ricardo Pereira', gender: 'MALE' as const, goal: 'Reabilitação pós-lesão', weight: 75, height: 172 },
  { full: 'Fernanda Ribeiro', gender: 'FEMALE' as const, goal: 'Condicionamento geral', weight: 62, height: 165 },
  { full: 'Thiago Martins', gender: 'MALE' as const, goal: 'Competição fitness', weight: 85, height: 177 },
  { full: 'Beatriz Araújo', gender: 'FEMALE' as const, goal: 'Ganhar massa magra', weight: 53, height: 155 },
  { full: 'Felipe Rodrigues', gender: 'MALE' as const, goal: 'Perder barriga', weight: 92, height: 180 },
  { full: 'Amanda Barbosa', gender: 'FEMALE' as const, goal: 'Melhorar postura', weight: 60, height: 162 },
  { full: 'Bruno Carvalho', gender: 'MALE' as const, goal: 'Ganhar peso saudável', weight: 68, height: 176 },
  { full: 'Patrícia Mendes', gender: 'FEMALE' as const, goal: 'Manter forma física', weight: 57, height: 160 },
  { full: 'Rafael Fernandes', gender: 'MALE' as const, goal: 'Performance esportiva', weight: 78, height: 179 },
  { full: 'Camila Rocha', gender: 'FEMALE' as const, goal: 'Ganhar definicao muscular', weight: 56, height: 159 },
  { full: 'Marcos Gomes', gender: 'MALE' as const, goal: 'Saúde geral', weight: 88, height: 174 },
  { full: 'Isabela Nunes', gender: 'FEMALE' as const, goal: 'Perder gordura', weight: 67, height: 164 },
  { full: 'Vinicius Teixeira', gender: 'MALE' as const, goal: 'Triathlon', weight: 74, height: 181 },
  { full: 'Larissa Campos', gender: 'FEMALE' as const, goal: 'Flexibilidade', weight: 52, height: 156 },
]

const PLANS = [
  {
    name: 'Básico',
    description: 'Acesso à musculação e esteiras',
    price: 89.90,
    duration: 30,
    features: ['Musculação', 'Esteiras', 'Vestiário', 'Água'],
  },
  {
    name: 'Premium',
    description: 'Acesso completo + 2 aulas por semana',
    price: 149.90,
    duration: 30,
    features: ['Musculação', 'Esteiras', 'Área funcional', '2 aulas grupais/semanais', 'Vestiário', 'Água', 'Toalha'],
  },
  {
    name: 'Black',
    description: 'Acesso ilimitado + personal + avaliação',
    price: 249.90,
    duration: 30,
    features: ['Tudo do Premium', 'Acesso ilimitado aulas', '1 personal/semana', 'Avaliação física mensal', 'Sauna', 'Estacionamento', 'Nutricionista'],
  },
]

const EXERCISES = [
  { name: 'Supino Reto', muscleGroup: 'Peito', equipment: 'Barra', difficulty: 2 },
  { name: 'Supino Inclinado', muscleGroup: 'Peito', equipment: 'Halteres', difficulty: 2 },
  { name: 'Crucifixo', muscleGroup: 'Peito', equipment: 'Halteres', difficulty: 1 },
  { name: 'Crossover', muscleGroup: 'Peito', equipment: 'Polia', difficulty: 2 },
  { name: 'Supino Máquina', muscleGroup: 'Peito', equipment: 'Máquina', difficulty: 1 },
  { name: 'Tríceps Pulley', muscleGroup: 'Tríceps', equipment: 'Polia', difficulty: 1 },
  { name: 'Tríceps Testa', muscleGroup: 'Tríceps', equipment: 'Barra', difficulty: 2 },
  { name: 'Mergulho', muscleGroup: 'Tríceps', equipment: 'Peso corporal', difficulty: 3 },
  { name: 'Puxada Frontal', muscleGroup: 'Costas', equipment: 'Polia', difficulty: 1 },
  { name: 'Remada Curvada', muscleGroup: 'Costas', equipment: 'Barra', difficulty: 2 },
  { name: 'Remada Unilateral', muscleGroup: 'Costas', equipment: 'Haltere', difficulty: 2 },
  { name: 'Puxada Cavalinho', muscleGroup: 'Costas', equipment: 'Polia', difficulty: 1 },
  { name: 'Bíceps Rosca Direta', muscleGroup: 'Bíceps', equipment: 'Barra', difficulty: 1 },
  { name: 'Bíceps Rosca Alternada', muscleGroup: 'Bíceps', equipment: 'Halteres', difficulty: 1 },
  { name: 'Bíceps Martelo', muscleGroup: 'Bíceps', equipment: 'Halteres', difficulty: 1 },
  { name: 'Agachamento Livre', muscleGroup: 'Pernas', equipment: 'Barra', difficulty: 3 },
  { name: 'Leg Press', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 1 },
  { name: 'Cadeira Extensora', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 1 },
  { name: 'Cadeira Flexora', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 1 },
  { name: 'Panturrilha em Pé', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 1 },
  { name: 'Stiff', muscleGroup: 'Pernas', equipment: 'Barra', difficulty: 2 },
  { name: 'Agachamento Hack', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 2 },
  { name: 'Desenvolvimento', muscleGroup: 'Ombros', equipment: 'Halteres', difficulty: 2 },
  { name: 'Elevação Lateral', muscleGroup: 'Ombros', equipment: 'Halteres', difficulty: 1 },
  { name: 'Elevação Frontal', muscleGroup: 'Ombros', equipment: 'Halteres', difficulty: 1 },
  { name: 'Encolhimento', muscleGroup: 'Trapézio', equipment: 'Halteres', difficulty: 1 },
  { name: 'Abdominal Crunch', muscleGroup: 'Abdômen', equipment: 'Peso corporal', difficulty: 1 },
  { name: 'Abdominal Infra', muscleGroup: 'Abdômen', equipment: 'Peso corporal', difficulty: 2 },
  { name: 'Prancha', muscleGroup: 'Abdômen', equipment: 'Peso corporal', difficulty: 2 },
  { name: 'Bicicleta', muscleGroup: 'Cardio', equipment: 'Bicicleta ergométrica', difficulty: 1 },
]

const WORKOUT_TEMPLATES = [
  { name: 'A - Peito e Tríceps', description: 'Treino focado em peito e tríceps', dayOfWeek: 1, exerciseIndices: [0, 1, 2, 3, 5, 6, 7] },
  { name: 'B - Costas e Bíceps', description: 'Treino focado em costas e bíceps', dayOfWeek: 3, exerciseIndices: [8, 9, 10, 11, 12, 13, 14] },
  { name: 'C - Pernas', description: 'Treino completo de pernas', dayOfWeek: 2, exerciseIndices: [15, 16, 17, 18, 19, 20, 21] },
  { name: 'D - Ombros e Trapézio', description: 'Treino de ombros e trapézio', dayOfWeek: 4, exerciseIndices: [22, 23, 24, 25] },
  { name: 'E - Abdômen e Cardio', description: 'Treino de abdômen e cardio', dayOfWeek: 5, exerciseIndices: [26, 27, 28, 29] },
]

const ACHIEVEMENTS = [
  { name: 'Primeiro Treino', description: 'Complete seu primeiro treino', icon: '🏋️', category: 'WORKOUT' as const, points: 10, requirement: 1 },
  { name: 'Treino Semanal', description: 'Complete 7 treinos', icon: '💪', category: 'WORKOUT' as const, points: 20, requirement: 7 },
  { name: 'Maratonista', description: 'Complete 50 treinos', icon: '🔥', category: 'WORKOUT' as const, points: 50, requirement: 50 },
  { name: 'Lenda do Ferro', description: 'Complete 100 treinos', icon: '🏆', category: 'WORKOUT' as const, points: 100, requirement: 100 },
  { name: 'Fiel ao Treino', description: 'Check-in 30 vezes', icon: '📍', category: 'FREQUENCY' as const, points: 30, requirement: 30 },
  { name: 'Sempre Presente', description: 'Check-in 100 vezes', icon: '⭐', category: 'FREQUENCY' as const, points: 75, requirement: 100 },
  { name: 'Sequência de 3', description: '3 dias seguidos treinando', icon: '🔥', category: 'STREAK' as const, points: 15, requirement: 3 },
  { name: 'Sequência de 7', description: '7 dias seguidos treinando', icon: '⚡', category: 'STREAK' as const, points: 40, requirement: 7 },
  { name: 'Primeira Avaliação', description: 'Realize sua primeira avaliação física', icon: '📊', category: 'ASSESSMENT' as const, points: 15, requirement: 1 },
  { name: 'Progresso Mensal', description: 'Realize 3 avaliações', icon: '📈', category: 'ASSESSMENT' as const, points: 30, requirement: 3 },
  { name: 'Nível Intermediário', description: 'Alcance 100 pontos', icon: '🌟', category: 'MILESTONE' as const, points: 25, requirement: 100 },
  { name: 'Nível Avançado', description: 'Alcance 300 pontos', icon: '💎', category: 'MILESTONE' as const, points: 50, requirement: 300 },
  { name: 'Nível Expert', description: 'Alcance 600 pontos', icon: '👑', category: 'MILESTONE' as const, points: 100, requirement: 600 },
  { name: 'Nível Lenda', description: 'Alcance 1000 pontos', icon: '🏅', category: 'SPECIAL' as const, points: 200, requirement: 1000 },
]

function randomPastDate(daysBack: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack))
  d.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0)
  return d
}

function futureDate(daysAhead: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d
}

async function main() {
  console.log('🌱 Seeding database...')

  // ─── UNIT ─────────────────────────────────────────────
  let unit = await prisma.unit.findFirst({
    where: { email: 'matriz@ironlifefitness.com.br' },
  })

  if (!unit) {
    unit = await prisma.unit.create({
      data: {
        name: 'Iron Life Fitness - Matriz',
        address: 'Rua das Rosas, 123 - Centro - São Paulo/SP',
        phone: '(11) 3000-1234',
        email: 'matriz@ironlifefitness.com.br',
      },
    })
    console.log(`  ✅ Unit: ${unit.name}`)
  } else {
    console.log(`  ℹ️  Unit já existe: ${unit.name}`)
  }

  // ─── ADMIN ────────────────────────────────────────────
  let admin = await prisma.user.findUnique({
    where: { email: 'admin@ironlife.com' },
  })

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@ironlife.com',
        password: PASSWORDS.admin,
        role: 'ADMIN',
      },
    })

    await prisma.unitAdmin.create({
      data: { userId: admin.id, unitId: unit.id },
    })
    console.log(`  ✅ Admin: ${admin.email}`)
  } else {
    // Garantir que o admin tem acesso à unit
    const existingUnitAdmin = await prisma.unitAdmin.findUnique({
      where: { userId_unitId: { userId: admin.id, unitId: unit.id } },
    })
    if (!existingUnitAdmin) {
      await prisma.unitAdmin.create({
        data: { userId: admin.id, unitId: unit.id },
      })
    }
    console.log(`  ℹ️  Admin já existe: ${admin.email}`)
  }

  // ─── TRAINERS ─────────────────────────────────────────
  const trainerUsers = []
  for (let i = 0; i < TRAINER_NAMES.length; i++) {
    let trainerUser = await prisma.user.findUnique({
      where: { email: `trainer${i + 1}@ironlife.com` },
    })
    if (!trainerUser) {
      trainerUser = await prisma.user.create({
        data: {
          email: `trainer${i + 1}@ironlife.com`,
          password: PASSWORDS.trainer,
          role: 'TRAINER',
        },
      })
    }
    trainerUsers.push(trainerUser)
  }

  const trainers = await Promise.all(
    trainerUsers.map((user, i) =>
      prisma.trainer.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          unitId: unit.id,
          fullName: TRAINER_NAMES[i].full,
          cref: TRAINER_NAMES[i].cref,
          specialty: TRAINER_NAMES[i].specialty,
          phone: TRAINER_NAMES[i].phone,
          bio: `Personal trainer especializado em ${TRAINER_NAMES[i].specialty.toLowerCase()}.`,
        },
        update: {
          unitId: unit.id,
          fullName: TRAINER_NAMES[i].full,
          cref: TRAINER_NAMES[i].cref,
          specialty: TRAINER_NAMES[i].specialty,
          phone: TRAINER_NAMES[i].phone,
          bio: `Personal trainer especializado em ${TRAINER_NAMES[i].specialty.toLowerCase()}.`,
        },
      })
    )
  )
  console.log(`  ✅ Trainers: ${trainers.map((t) => t.fullName).join(', ')}`)

  // ─── STUDENTS ─────────────────────────────────────────
  const studentUsers = []
  for (let i = 0; i < STUDENT_DATA.length; i++) {
    let studentUser = await prisma.user.findUnique({
      where: { email: `student${i + 1}@ironlife.com` },
    })
    if (!studentUser) {
      studentUser = await prisma.user.create({
        data: {
          email: `student${i + 1}@ironlife.com`,
          password: PASSWORDS.student,
          role: 'STUDENT',
        },
      })
    }
    studentUsers.push(studentUser)
  }

  const students = await Promise.all(
    studentUsers.map((user, i) => {
      const s = STUDENT_DATA[i]
      const trainerId = trainers[i % trainers.length].id
      return prisma.student.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          unitId: unit.id,
          trainerId,
          fullName: s.full,
          cpf: `${String(100 + i).padStart(3, '0')}.456.789-${String(i + 10).padStart(2, '0')}`,
          phone: `(11) 9${String(9000 + i).padStart(4, '0')}-${String(1000 + i * 11).padStart(4, '0')}`,
          birthDate: new Date(1990 + (i % 15), (i * 3) % 12, (i * 7) % 28 + 1),
          gender: s.gender,
          weight: s.weight,
          height: s.height,
          bodyFatPercent: 15 + (i % 15),
          muscleMass: 30 + (i % 20),
          goal: s.goal,
          points: i * 50,
          level: i < 5 ? 'INICIANTE' : i < 12 ? 'INTERMEDIARIO' : 'AVANCADO',
        },
        update: {
          unitId: unit.id,
          trainerId,
          fullName: s.full,
          cpf: `${String(100 + i).padStart(3, '0')}.456.789-${String(i + 10).padStart(2, '0')}`,
          phone: `(11) 9${String(9000 + i).padStart(4, '0')}-${String(1000 + i * 11).padStart(4, '0')}`,
          birthDate: new Date(1990 + (i % 15), (i * 3) % 12, (i * 7) % 28 + 1),
          gender: s.gender,
          weight: s.weight,
          height: s.height,
          bodyFatPercent: 15 + (i % 15),
          muscleMass: 30 + (i % 20),
          goal: s.goal,
          points: i * 50,
          level: i < 5 ? 'INICIANTE' : i < 12 ? 'INTERMEDIARIO' : 'AVANCADO',
        },
      })
    })
  )
  console.log(`  ✅ Students: ${students.length} created`)

  // ─── PLANS ────────────────────────────────────────────
  const plans = await Promise.all(
    PLANS.map((p) =>
      prisma.plan.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          duration: p.duration,
          features: p.features,
          unitId: unit.id,
        },
      })
    )
  )
  console.log(`  ✅ Plans: ${plans.map((p) => p.name).join(', ')}`)

  // ─── SUBSCRIPTIONS ────────────────────────────────────
  const subscriptions = await Promise.all(
    students.map((s, i) => {
      const planIndex = i < 8 ? 0 : i < 15 ? 1 : 2
      const statuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'OVERDUE', 'ACTIVE', 'ACTIVE', 'SUSPENDED'] as const
      return prisma.subscription.create({
        data: {
          studentId: s.id,
          planId: plans[planIndex].id,
          unitId: unit.id,
          status: statuses[i % statuses.length],
          startDate: randomPastDate(60),
          endDate: futureDate(30),
        },
      })
    })
  )
  console.log(`  ✅ Subscriptions: ${subscriptions.length} created`)

  // ─── EXERCISES ────────────────────────────────────────
  const exercises = await Promise.all(
    EXERCISES.map((e) =>
      prisma.exercise.create({
        data: {
          name: e.name,
          muscleGroup: e.muscleGroup,
          equipment: e.equipment,
          difficulty: e.difficulty,
        },
      })
    )
  )
  console.log(`  ✅ Exercises: ${exercises.length} created`)

  // ─── WORKOUTS ─────────────────────────────────────────
  const workouts = await Promise.all(
    WORKOUT_TEMPLATES.map((template) =>
      prisma.workout.create({
        data: {
          name: template.name,
          description: template.description,
          dayOfWeek: template.dayOfWeek,
          trainerId: trainers[0].id,
        },
      })
    )
  )

  for (const workout of workouts) {
    const template = WORKOUT_TEMPLATES.find((t) => t.name === workout.name)!
    await Promise.all(
      template.exerciseIndices.map((exIdx, order) =>
        prisma.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId: exercises[exIdx].id,
            order: order + 1,
            sets: 3 + (order % 2),
            reps: order % 3 === 0 ? 'até a falha' : '10-12',
            restSeconds: 60 + order * 15,
          },
        })
      )
    )
  }
  console.log(`  ✅ Workouts: ${workouts.length} created with exercises`)

  // ─── WORKOUT ASSIGNMENTS ──────────────────────────────
  const assignments = []
  for (let i = 0; i < students.length; i++) {
    const workoutCount = 2 + (i % 2)
    for (let j = 0; j < workoutCount; j++) {
      const workoutIdx = (i + j) % workouts.length
      const assignment = await prisma.workoutAssignment.create({
        data: {
          studentId: students[i].id,
          workoutId: workouts[workoutIdx].id,
          startDate: randomPastDate(30),
        },
      })
      assignments.push(assignment)
    }
  }
  console.log(`  ✅ Assignments: ${assignments.length} created`)

  // ─── WORKOUT SESSIONS & COMPLETIONS ───────────────────
  let totalSessions = 0
  for (let i = 0; i < Math.min(assignments.length, 30); i++) {
    const sessionCount = 1 + (i % 4)
    for (let s = 0; s < sessionCount; s++) {
      const session = await prisma.workoutSession.create({
        data: {
          assignmentId: assignments[i].id,
          date: randomPastDate(14),
          duration: 45 + Math.floor(Math.random() * 45),
          completed: true,
          calories: 200 + Math.floor(Math.random() * 400),
        },
      })
      totalSessions++

      const workoutExercises = await prisma.workoutExercise.findMany({
        where: { workoutId: assignments[i].workoutId },
        orderBy: { order: 'asc' },
      })

      for (const we of workoutExercises) {
        await prisma.exerciseCompletion.create({
          data: {
            sessionId: session.id,
            exerciseId: we.id,
            completed: true,
            setsDone: we.sets,
            repsDone: we.reps,
            weightUsed: 20 + Math.floor(Math.random() * 60),
          },
        })
      }
    }
  }
  console.log(`  ✅ Sessions: ${totalSessions} with completions`)

  // ─── EVALUATIONS ──────────────────────────────────────
  let evalCount = 0
  for (let i = 0; i < 15; i++) {
    const student = students[i]
    const evalDate = randomPastDate(90)

    await prisma.evaluation.create({
      data: {
        studentId: student.id,
        trainerId: trainers[i % trainers.length].id,
        date: evalDate,
        weight: Number(student.weight) + (Math.random() * 4 - 2),
        height: student.height,
        bodyFatPercent: Number(student.bodyFatPercent) + (Math.random() * 3 - 1.5),
        muscleMass: Number(student.muscleMass) + (Math.random() * 2 - 1),
        visceralFat: 5 + Math.floor(Math.random() * 15),
        basalMetabolism: 1400 + Math.floor(Math.random() * 600),
        bmi: Number(((Number(student.weight) + (Math.random() * 4 - 2)) / Math.pow(Number(student.height) / 100, 2)).toFixed(2)),
        observations: i % 3 === 0 ? 'Aluno demonstrou boa evolução' : null,
        measurements: {
          create: {
            arm: 30 + Math.floor(Math.random() * 15),
            chest: 85 + Math.floor(Math.random() * 25),
            waist: 70 + Math.floor(Math.random() * 25),
            hip: 90 + Math.floor(Math.random() * 20),
            thigh: 50 + Math.floor(Math.random() * 15),
            calf: 35 + Math.floor(Math.random() * 8),
          },
        },
      },
    })
    evalCount++
  }
  console.log(`  ✅ Evaluations: ${evalCount} with measurements`)

  // ─── CHECK-INS ────────────────────────────────────────
  let checkinCount = 0
  for (const student of students) {
    const count = 5 + Math.floor(Math.random() * 20)
    for (let i = 0; i < count; i++) {
      await prisma.checkIn.create({
        data: {
          studentId: student.id,
          unitId: unit.id,
          date: randomPastDate(30),
          method: (['QR_CODE', 'APP', 'STUDENT_CODE', 'MANUAL'] as const)[i % 4],
        },
      })
      checkinCount++
    }
  }
  console.log(`  ✅ Check-ins: ${checkinCount} created`)

  // ─── APPOINTMENTS ─────────────────────────────────────
  const appointmentTypes = ['PERSONAL_TRAINING', 'PHYSICAL_ASSESSMENT', 'CONSULTATION', 'GROUP_CLASS'] as const
  let apptCount = 0
  for (let i = 0; i < 20; i++) {
    const student = students[i % students.length]
    await prisma.appointment.create({
      data: {
        studentId: student.id,
        unitId: unit.id,
        title: `${appointmentTypes[i % 4].replace(/_/g, ' ').toLowerCase()} - ${student.fullName}`,
        type: appointmentTypes[i % 4],
        date: i < 10 ? futureDate(i + 1) : randomPastDate(10),
        duration: i % 3 === 0 ? 60 : i % 3 === 1 ? 45 : 30,
        status: i < 10 ? 'SCHEDULED' : i % 5 === 0 ? 'CANCELLED' : 'COMPLETED',
      },
    })
    apptCount++
  }
  console.log(`  ✅ Appointments: ${apptCount} created`)

  // ─── PAYMENTS ─────────────────────────────────────────
  const methods: Array<string | null> = ['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH', null]
  let paymentCount = 0
  for (let i = 0; i < subscriptions.length; i++) {
    const sub = subscriptions[i]
    const months = 2 + (i % 3)

    for (let m = 0; m < months; m++) {
      const dueDate = new Date()
      dueDate.setMonth(dueDate.getMonth() - (months - 1 - m))
      dueDate.setDate(5)

      const isPaid = i % 5 !== 0 || m < months - 1
      const isOverdue = !isPaid && dueDate < new Date()

      await prisma.payment.create({
        data: {
          subscriptionId: sub.id,
          amount: Number(plans[i < 8 ? 0 : i < 15 ? 1 : 2].price),
          status: isPaid ? 'PAID' : isOverdue ? 'OVERDUE' : 'PENDING',
          method: isPaid ? methods[i % methods.length]! : null,
          dueDate,
          paidDate: isPaid ? dueDate : null,
        },
      })
      paymentCount++
    }
  }
  console.log(`  ✅ Payments: ${paymentCount} created`)

  // ─── ACHIEVEMENTS ─────────────────────────────────────
  const achievements = await Promise.all(
    ACHIEVEMENTS.map((a) =>
      prisma.achievement.create({
        data: {
          name: a.name,
          description: a.description,
          icon: a.icon,
          category: a.category,
          points: a.points,
          requirement: a.requirement,
        },
      })
    )
  )
  console.log(`  ✅ Achievements: ${achievements.length} created`)

  // Unlock some achievements for first students
  for (let i = 0; i < 10; i++) {
    const achIdx = i % achievements.length
    try {
      await prisma.studentAchievement.create({
        data: {
          studentId: students[i].id,
          achievementId: achievements[achIdx].id,
        },
      })
    } catch {
      // Skip duplicate
    }
  }
  console.log(`  ✅ Student achievements unlocked for first 10 students`)

  // ─── RANKINGS ─────────────────────────────────────────
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const sortedStudents = [...students].sort((a, b) => b.points - a.points)
  for (let i = 0; i < sortedStudents.length; i++) {
    const student = sortedStudents[i]
    let level = 'INICIANTE'
    if (student.points >= 1000) level = 'LENDA'
    else if (student.points >= 600) level = 'EXPERT'
    else if (student.points >= 300) level = 'AVANCADO'
    else if (student.points >= 100) level = 'INTERMEDIARIO'

    await prisma.ranking.create({
      data: {
        studentId: student.id,
        totalPoints: student.points,
        currentLevel: level,
        month,
        year,
        position: i + 1,
      },
    })
  }
  console.log(`  ✅ Rankings: ${sortedStudents.length} positions assigned`)

  // ─── NOTIFICATIONS ────────────────────────────────────
  let notifCount = 0
  const notifTemplates = [
    { title: 'Bem-vindo ao Iron Life!', message: 'Sua conta foi criada com sucesso. Bora treinar!', type: 'GENERAL' as const },
    { title: 'Lembrete de treino', message: 'Você tem um treino agendado para hoje. Não esqueça!', type: 'WORKOUT_REMINDER' as const },
    { title: 'Pagamento próximo', message: 'Sua mensalidade vence em 3 dias. Verifique seus pagamentos.', type: 'PAYMENT_DUE' as const },
    { title: 'Avaliação agendada', message: 'Sua avaliação física está marcada para amanhã às 10h.', type: 'ASSESSMENT_SCHEDULED' as const },
    { title: 'Parabéns!', message: 'Você completou 10 treinos este mês. Continue assim!', type: 'ACHIEVEMENT_UNLOCKED' as const },
  ]

  for (let i = 0; i < 5; i++) {
    for (const template of notifTemplates) {
      await prisma.notification.create({
        data: {
          userId: studentUsers[i].id,
          title: template.title,
          message: template.message,
          type: template.type,
          isRead: i > 2,
        },
      })
      notifCount++
    }
  }
  console.log(`  ✅ Notifications: ${notifCount} created`)

  // ─── STUDENT QR CODES ─────────────────────────────────
  for (let i = 0; i < students.length; i++) {
    const studentCode = `IL${String(i + 1).padStart(4, '0')}`
    const qrCode = `ironlife://student/${studentCode}`
    await prisma.student.update({
      where: { id: students[i].id },
      data: { studentCode, qrCode },
    })
  }
  console.log(`  ✅ Student QR codes assigned`)

  console.log('\n🎉 Seed completed successfully!')
  console.log('─── Login credentials ───')
  console.log('Admin:   admin@ironlife.com / admin123')
  console.log('Trainer: trainer1@ironlife.com / trainer123')
  console.log('Student: student1@ironlife.com / student123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
