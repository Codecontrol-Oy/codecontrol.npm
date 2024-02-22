-- CreateTable
CREATE TABLE "Language" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Namespace" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "languageId" INTEGER NOT NULL,
    "namespaceId" INTEGER NOT NULL,
    CONSTRAINT "Translation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Translation_namespaceId_fkey" FOREIGN KEY ("namespaceId") REFERENCES "Namespace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Namespace_name_key" ON "Namespace"("name");
