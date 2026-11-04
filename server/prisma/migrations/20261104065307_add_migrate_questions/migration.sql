-- CreateTable
CREATE TABLE "MigrateQuestions" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "url" TEXT NOT NULL,
    "platform" TEXT,
    "difficulty" TEXT,
    "remark" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MigrateQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MigrateQuestions_userId_idx" ON "MigrateQuestions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MigrateQuestions_userId_url_key" ON "MigrateQuestions"("userId", "url");

-- AddForeignKey
ALTER TABLE "MigrateQuestions" ADD CONSTRAINT "MigrateQuestions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
