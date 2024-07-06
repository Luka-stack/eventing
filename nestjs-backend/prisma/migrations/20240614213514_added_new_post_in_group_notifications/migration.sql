-- CreateTable
CREATE TABLE "UserGroupNotifications" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "UserGroupNotifications_pkey" PRIMARY KEY ("userId","groupId")
);
