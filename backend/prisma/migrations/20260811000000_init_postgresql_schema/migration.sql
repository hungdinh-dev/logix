-- CreateTable
CREATE TABLE "auth_users" (
    "id" TEXT NOT NULL,
    "employeeCode" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userType" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "employmentStatus" TEXT NOT NULL DEFAULT 'PROBATION',
    "storeId" TEXT,
    "departmentId" TEXT,
    "positionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_user_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginEmail" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "refreshToken" TEXT,
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_user_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_roles" (
    "id" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "isSystemRole" BOOLEAN NOT NULL DEFAULT false,
    "bypassDataScope" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_permissions" (
    "id" TEXT NOT NULL,
    "permissionCode" TEXT NOT NULL,
    "permissionName" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "auth_user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_stores" (
    "id" TEXT NOT NULL,
    "storeCode" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'MIEN_NAM',
    "storeType" TEXT NOT NULL DEFAULT 'RETAIL_STORE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_departments" (
    "id" TEXT NOT NULL,
    "deptCode" TEXT NOT NULL,
    "deptName" TEXT NOT NULL,
    "isFactoryDept" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_positions" (
    "id" TEXT NOT NULL,
    "positionCode" TEXT NOT NULL,
    "positionName" TEXT NOT NULL,
    "levelRank" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crs_categories" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crs_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crs_courses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "categoryId" TEXT NOT NULL,
    "courseType" TEXT NOT NULL DEFAULT 'STANDARD',
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "durationDays" INTEGER DEFAULT 30,
    "passScore" INTEGER NOT NULL DEFAULT 80,
    "isCommercial" BOOLEAN NOT NULL DEFAULT false,
    "isInternal" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crs_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crs_modules" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crs_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crs_lessons" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lessonType" TEXT NOT NULL,
    "videoUrl" TEXT,
    "documentUrl" TEXT,
    "bodyHtml" TEXT,
    "checklistItems" TEXT,
    "sopCode" TEXT,
    "sopType" TEXT,
    "requiresSignature" BOOLEAN NOT NULL DEFAULT false,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "allowDownload" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crs_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enr_course_enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "enrollmentSource" TEXT NOT NULL DEFAULT 'MANUAL',
    "status" TEXT NOT NULL DEFAULT 'ENROLLED',
    "dueDate" TIMESTAMP(3),
    "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enr_course_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enr_lesson_progress" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "lastPositionSeconds" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enr_lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_users_employeeCode_key" ON "auth_users"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "auth_users_email_key" ON "auth_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_accounts_userId_key" ON "auth_user_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_accounts_loginEmail_key" ON "auth_user_accounts"("loginEmail");

-- CreateIndex
CREATE UNIQUE INDEX "auth_roles_roleName_key" ON "auth_roles"("roleName");

-- CreateIndex
CREATE UNIQUE INDEX "auth_permissions_permissionCode_key" ON "auth_permissions"("permissionCode");

-- CreateIndex
CREATE UNIQUE INDEX "auth_role_permissions_roleId_permissionId_key" ON "auth_role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "org_stores_storeCode_key" ON "org_stores"("storeCode");

-- CreateIndex
CREATE UNIQUE INDEX "org_departments_deptCode_key" ON "org_departments"("deptCode");

-- CreateIndex
CREATE UNIQUE INDEX "org_positions_positionCode_key" ON "org_positions"("positionCode");

-- CreateIndex
CREATE UNIQUE INDEX "crs_categories_code_key" ON "crs_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "crs_courses_code_key" ON "crs_courses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "crs_courses_slug_key" ON "crs_courses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "enr_course_enrollments_userId_courseId_key" ON "enr_course_enrollments"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "enr_lesson_progress_userId_lessonId_key" ON "enr_lesson_progress"("userId", "lessonId");

-- AddForeignKey
ALTER TABLE "auth_users" ADD CONSTRAINT "auth_users_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "org_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_users" ADD CONSTRAINT "auth_users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "org_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_users" ADD CONSTRAINT "auth_users_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "org_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_user_accounts" ADD CONSTRAINT "auth_user_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_user_roles" ADD CONSTRAINT "auth_user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_user_roles" ADD CONSTRAINT "auth_user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "auth_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_role_permissions" ADD CONSTRAINT "auth_role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "auth_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_role_permissions" ADD CONSTRAINT "auth_role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "auth_permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crs_courses" ADD CONSTRAINT "crs_courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "crs_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crs_modules" ADD CONSTRAINT "crs_modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "crs_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crs_lessons" ADD CONSTRAINT "crs_lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "crs_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enr_course_enrollments" ADD CONSTRAINT "enr_course_enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enr_course_enrollments" ADD CONSTRAINT "enr_course_enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "crs_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enr_lesson_progress" ADD CONSTRAINT "enr_lesson_progress_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enr_course_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enr_lesson_progress" ADD CONSTRAINT "enr_lesson_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enr_lesson_progress" ADD CONSTRAINT "enr_lesson_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "crs_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

