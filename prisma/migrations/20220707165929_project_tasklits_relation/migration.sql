/*
  Warnings:

  - Added the required column `projectId` to the `TaskList` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TaskList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "TaskList_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TaskList" ("id", "name") SELECT "id", "name" FROM "TaskList";
DROP TABLE "TaskList";
ALTER TABLE "new_TaskList" RENAME TO "TaskList";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
