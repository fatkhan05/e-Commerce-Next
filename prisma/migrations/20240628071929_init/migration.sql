-- CreateTable
CREATE TABLE "Caterogy" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "bannerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Caterogy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Caterogy_storeId_idx" ON "Caterogy"("storeId");

-- CreateIndex
CREATE INDEX "Caterogy_bannerId_idx" ON "Caterogy"("bannerId");

-- AddForeignKey
ALTER TABLE "Caterogy" ADD CONSTRAINT "Caterogy_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caterogy" ADD CONSTRAINT "Caterogy_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
