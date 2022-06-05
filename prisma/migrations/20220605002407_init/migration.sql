-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagOnLink" (
    "tagId" INTEGER NOT NULL,
    "linkId" INTEGER NOT NULL,

    CONSTRAINT "TagOnLink_pkey" PRIMARY KEY ("linkId","tagId")
);

-- AddForeignKey
ALTER TABLE "TagOnLink" ADD CONSTRAINT "TagOnLink_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnLink" ADD CONSTRAINT "TagOnLink_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
