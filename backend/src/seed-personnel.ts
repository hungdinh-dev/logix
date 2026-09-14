import prisma from './config/prisma'
import bcrypt from 'bcryptjs'

export const DEPARTMENTS_DATA = [
  {
    id: '618154ec-78b0-433b-851b-fa57d7899f49',
    deptCode: 'EXEC',
    deptName: 'Ban Giám Đốc',
    isFactoryDept: false,
  },
  {
    id: 'a05b6316-edad-431b-b94b-c573ac9814e9',
    deptCode: 'CUA-HANG',
    deptName: 'Cửa Hàng',
    isFactoryDept: false,
  },
  {
    id: 'da12d0f2-0ac6-4f92-8a4b-4b1f00cca0c2',
    deptCode: 'SX',
    deptName: 'Sản Xuất',
    isFactoryDept: true,
  },
  {
    id: '853319e0-1f0b-446c-8c0e-f4ecc7e24a87',
    deptCode: 'VP',
    deptName: 'Văn Phòng',
    isFactoryDept: false,
  },
]

export const PERSONNEL_DATA = [
  {
    id: '9dd85232-bf93-32b1-7e2d-3aae9187b565',
    fullName: 'System Admin',
    employeeCode: 'ADMIN001',
    email: 'admin@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'EXEC',
    roleName: 'ADMIN',
    userType: 'SYSTEM_ADMIN',
  },
  {
    id: '977148c9-c7df-0491-c621-0016acb9153b',
    fullName: 'SangTQ',
    employeeCode: 'SANGTQ',
    email: 'SangTQ@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'EXEC',
    roleName: 'ADMIN',
    userType: 'EMPLOYEE',
  },
  {
    id: '0a979781-7335-944d-3124-9f4e0be36cc9',
    fullName: 'DaiLT',
    employeeCode: 'DAILT',
    email: 'DaiLT@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'PROBATION',
    deptCode: 'CUA-HANG',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: '051c248d-3b88-a960-4a35-4555c1333784',
    fullName: 'HanhTTH',
    employeeCode: 'HANHTTH',
    email: 'HanhTTH@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'VP',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: '45d2c47d-8e04-91e9-c3ea-1af629f5ce64',
    fullName: 'HaNTC',
    employeeCode: 'HANTC',
    email: 'HaNTC@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'VP',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: '34b00f1f-fec3-2dc0-6618-4dc57ec6bdca',
    fullName: 'HungDNB',
    employeeCode: 'HUNGDNB',
    email: 'HungDNB@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'VP',
    roleName: 'TRAINER',
    userType: 'EMPLOYEE',
  },
  {
    id: '68d1ceff-18ee-a7ab-5eab-758d5386fa5d',
    fullName: 'HungNDM',
    employeeCode: 'HUNGNDM',
    email: 'HungNDM@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'SX',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: '281b3d4e-00db-ebd6-dce9-899f07c11969',
    fullName: 'HungPT',
    employeeCode: 'HUNGPT',
    email: 'HungPT@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'SX',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: '21474b2d-8c5f-b441-b691-8cd68e46c9fa',
    fullName: 'HuongLTT',
    employeeCode: 'HUONGLTT',
    email: 'HuongLTT@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'CUA-HANG',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: 'bec8aa53-d433-4389-2e53-5ddaac97eaec',
    fullName: 'HuyTQ',
    employeeCode: 'HUYTQ',
    email: 'HuyTQ@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'VP',
    roleName: 'TRAINER',
    userType: 'EMPLOYEE',
  },
  {
    id: 'f7c6b399-fa8b-458d-bb21-03b5d12dba61',
    fullName: 'LongNVH',
    employeeCode: 'NV0001',
    email: 'LongNVH@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'CUA-HANG',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: 'ef7e15b5-099c-2bc4-ac01-add081a198e5',
    fullName: 'LuongTND',
    employeeCode: 'LUONGTND',
    email: 'LuongTND@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'SX',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: '41ffd02e-e6f5-07cb-1500-7ca643050bd4',
    fullName: 'NgocNTH',
    employeeCode: 'NGOCNTH',
    email: 'NgocNTH@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'VP',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: '5fcb2b51-7557-eadb-1cc2-e8ba789c714c',
    fullName: 'PhuongHTK',
    employeeCode: 'PHUONGHTK',
    email: 'PhuongHTK@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'CUA-HANG',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: '859e5617-1227-2a08-b29d-20add1a3a4a5',
    fullName: 'PhuongVT',
    employeeCode: 'PHUONGVT',
    email: 'PhuongVT@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'SX',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: 'dec648c5-c862-810c-d443-8e4a2dd06e80',
    fullName: 'ThaiTD',
    employeeCode: 'THAITD',
    email: 'ThaiTD@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'SX',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: '4c280254-0fbb-0551-a436-3b4d41fe2f90',
    fullName: 'TrangNTT',
    employeeCode: 'TRANGNTT',
    email: 'TrangNTT@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'CUA-HANG',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: '55146842-a0da-23f5-0595-92182696fab0',
    fullName: 'TrangVTH',
    employeeCode: 'TRANGVTH',
    email: 'TrangVTH@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'VP',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
  {
    id: 'fe2603c6-2e12-683c-977e-40fd8a444670',
    fullName: 'TuyetTHA',
    employeeCode: 'TUYETTHA',
    email: 'TuyetTHA@gmail.com',
    status: 'ACTIVE',
    employmentStatus: 'OFFICIAL',
    deptCode: 'CUA-HANG',
    roleName: 'STUDENT',
    userType: 'EMPLOYEE',
  },
]

export async function seedPersonnel() {
  console.log('🚀 Bắt đầu thêm/cập nhật danh sách Phòng ban & Nhân sự...')

  // 1. Ensure Roles exist
  const adminRole = await prisma.role.upsert({
    where: { roleName: 'ADMIN' },
    update: {},
    create: {
      roleName: 'ADMIN',
      displayName: 'Quản trị viên Hệ thống (Admin)',
      isSystemRole: true,
      bypassDataScope: true,
    },
  })

  const trainerRole = await prisma.role.upsert({
    where: { roleName: 'TRAINER' },
    update: {},
    create: {
      roleName: 'TRAINER',
      displayName: 'Giảng viên / Huấn luyện viên (Trainer)',
      isSystemRole: false,
      bypassDataScope: false,
    },
  })

  const studentRole = await prisma.role.upsert({
    where: { roleName: 'STUDENT' },
    update: {},
    create: {
      roleName: 'STUDENT',
      displayName: 'Học viên / Nhân sự (Learner)',
      isSystemRole: false,
      bypassDataScope: false,
    },
  })

  const roleMap: Record<string, string> = {
    ADMIN: adminRole.id,
    TRAINER: trainerRole.id,
    STUDENT: studentRole.id,
  }

  // 2. Create / Upsert Departments
  const deptMap: Record<string, string> = {}
  for (const dept of DEPARTMENTS_DATA) {
    const existing = await prisma.department.findUnique({
      where: { deptCode: dept.deptCode },
    })

    let savedDept
    if (existing) {
      savedDept = await prisma.department.update({
        where: { id: existing.id },
        data: {
          deptName: dept.deptName,
          isFactoryDept: dept.isFactoryDept,
          isActive: true,
        },
      })
    } else {
      savedDept = await prisma.department.create({
        data: {
          id: dept.id,
          deptCode: dept.deptCode,
          deptName: dept.deptName,
          isFactoryDept: dept.isFactoryDept,
          isActive: true,
        },
      })
    }
    deptMap[dept.deptCode] = savedDept.id
    console.log(`✅ Phòng ban: [${savedDept.deptCode}] ${savedDept.deptName}`)
  }

  // 3. Default Password Hash (password123)
  const passwordHash = await bcrypt.hash('password123', 10)

  // 4. Create / Upsert Users & Accounts
  let createdCount = 0
  let updatedCount = 0

  for (const person of PERSONNEL_DATA) {
    const deptId = deptMap[person.deptCode] || null
    const roleId = roleMap[person.roleName] || studentRole.id

    // Check by email or employeeCode
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: person.email },
          { employeeCode: person.employeeCode },
        ],
      },
    })

    let userId: string

    if (existingUser) {
      const updated = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          fullName: person.fullName,
          employeeCode: person.employeeCode,
          email: person.email,
          status: person.status,
          employmentStatus: person.employmentStatus,
          userType: person.userType,
          departmentId: deptId,
          isActive: true,
        },
      })
      userId = updated.id
      updatedCount++
    } else {
      const created = await prisma.user.create({
        data: {
          id: person.id,
          fullName: person.fullName,
          employeeCode: person.employeeCode,
          email: person.email,
          status: person.status,
          employmentStatus: person.employmentStatus,
          userType: person.userType,
          departmentId: deptId,
          isActive: true,
        },
      })
      userId = created.id
      createdCount++
    }

    // Upsert UserAccount
    await prisma.userAccount.upsert({
      where: { userId },
      update: {
        loginEmail: person.email,
        passwordHash,
        isLocked: false,
      },
      create: {
        userId,
        loginEmail: person.email,
        passwordHash,
        isLocked: false,
      },
    })

    // Upsert UserRole
    const existingUserRole = await prisma.userRole.findFirst({
      where: { userId, roleId },
    })
    if (!existingUserRole) {
      await prisma.userRole.create({
        data: {
          userId,
          roleId,
          isActive: true,
        },
      })
    }

    console.log(
      `👤 [${person.employeeCode}] ${person.fullName} (${person.email}) -> Role: ${person.roleName}, Dept: ${person.deptCode}, Status: ${person.employmentStatus}`
    )
  }

  console.log(`\n🎉 Hoàn thành! Đã tạo mới: ${createdCount}, Cập nhật: ${updatedCount} tài khoản nhân sự.`)
}

if (require.main === module) {
  seedPersonnel()
    .catch((e) => {
      console.error('❌ Lỗi khi thêm nhân sự:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
