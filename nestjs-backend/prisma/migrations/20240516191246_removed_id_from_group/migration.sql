/*
  Warnings:

  - The primary key for the `Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Group` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GroupToPost" DROP CONSTRAINT "_GroupToPost_A_fkey";

-- AlterTable
ALTER TABLE "Group" DROP CONSTRAINT "Group_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Group_pkey" PRIMARY KEY ("name");

-- AddForeignKey
ALTER TABLE "_GroupToPost" ADD CONSTRAINT "_GroupToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("name") ON DELETE CASCADE ON UPDATE CASCADE;
