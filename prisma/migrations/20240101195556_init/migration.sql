-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "autoRoleEnabled" BOOLEAN NOT NULL DEFAULT false,
    "autoRole" TEXT,
    "welcomeMessageEnabled" BOOLEAN NOT NULL DEFAULT false,
    "welcomeMessage" TEXT NOT NULL DEFAULT 'Welkom op {{server}}, {{naam}}',
    "welcomeMessageChannel" TEXT,
    "goodbyeMessageEnabled" BOOLEAN NOT NULL DEFAULT false,
    "goodbyeMessage" TEXT NOT NULL DEFAULT 'Vaarwel, {{naam}}',
    "goodbyeMessageChannel" TEXT,
    "memesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "memesChannel" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "messages" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
