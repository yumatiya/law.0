    import { PrismaClient, UserRole } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding learning platform database...')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test users for each role
  const users = [
    {
      email: 'student@test.com',
      name: 'Test Student',
      role: UserRole.STUDENT,
      password: 'password123',
    },
    {
      email: 'school@test.com',
      name: 'Test School Admin',
      role: UserRole.SCHOOL_ADMIN,
      password: 'password123',
    },
    {
      email: 'college@test.com',
      name: 'Test College Admin',
      role: UserRole.COLLEGE_ADMIN,
      password: 'password123',
    },
    {
      email: 'lawyer@test.com',
      name: 'Test Lawyer',
      role: UserRole.LAWYER,
      password: 'password123',
    },
    {
      email: 'admin@test.com',
      name: 'Test Super Admin',
      role: UserRole.SUPER_ADMIN,
      password: 'password123',
    },
  ]

  for (const userData of users) {
    const hashedPassword = await hashPassword(userData.password)

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: hashedPassword,
        isVerified: true,
      },
    })

    console.log(`✅ Created user: ${user.email} (${user.role})`)

    // Create related records based on role
    if (userData.role === UserRole.STUDENT) {
      await prisma.student.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          dateOfBirth: new Date('2000-01-01'),
          address: '123 Student St',
          city: 'Student City',
          state: 'SC',
          zipCode: '12345',
          gpa: 3.5,
          graduationYear: 2024,
        },
      })
    } else if (userData.role === UserRole.SCHOOL_ADMIN) {
      // Create a school first
      const school = await prisma.school.upsert({
        where: { name: 'Test High School' },
        update: {},
        create: {
          name: 'Test High School',
          address: '456 School Ave',
          city: 'School City',
          state: 'SC',
          zipCode: '67890',
          phone: '555-0101',
          email: 'admin@testschool.edu',
        },
      })

      await prisma.schoolAdmin.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          schoolId: school.id,
          position: 'Principal',
        },
      })
    } else if (userData.role === UserRole.COLLEGE_ADMIN) {
      // Create a college first
      const college = await prisma.college.upsert({
        where: { name: 'Test University' },
        update: {},
        create: {
          name: 'Test University',
          address: '789 College Blvd',
          city: 'College City',
          state: 'CC',
          zipCode: '13579',
          phone: '555-0202',
          email: 'admin@testcollege.edu',
          acceptanceRate: 75.0,
          tuitionCost: 25000,
          studentCount: 10000,
          ranking: 50,
        },
      })

      await prisma.collegeAdmin.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          collegeId: college.id,
          position: 'Dean',
        },
      })
    } else if (userData.role === UserRole.LAWYER) {
      await prisma.lawyer.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          licenseNumber: 'LAW123456',
          barAdmission: 'State Bar',
          specialty: 'General Practice',
          experience: 5,
          hourlyRate: 150.00,
        },
      })
    }
  }

  console.log('🎉 Database seeded successfully!')
  console.log('\n📋 Test Accounts:')
  console.log('Student: student@test.com / password123')
  console.log('School Admin: school@test.com / password123')
  console.log('College Admin: college@test.com / password123')
  console.log('Lawyer: lawyer@test.com / password123')
  console.log('Super Admin: admin@test.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

