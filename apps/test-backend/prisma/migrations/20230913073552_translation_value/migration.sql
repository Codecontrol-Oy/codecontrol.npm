-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Translation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL DEFAULT '',
    "languageId" INTEGER NOT NULL,
    "namespaceId" INTEGER NOT NULL,
    CONSTRAINT "Translation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Translation_namespaceId_fkey" FOREIGN KEY ("namespaceId") REFERENCES "Namespace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Translation" ("id", "key", "languageId", "namespaceId") SELECT "id", "key", "languageId", "namespaceId" FROM "Translation";
DROP TABLE "Translation";
ALTER TABLE "new_Translation" RENAME TO "Translation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
