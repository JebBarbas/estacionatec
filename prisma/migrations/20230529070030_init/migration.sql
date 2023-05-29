-- CreateTable
CREATE TABLE "Rol" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "permisosPremium" BOOLEAN NOT NULL,
    "permisosAdmin" BOOLEAN NOT NULL,
    "permisosGuardia" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "control" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidoPaterno" TEXT NOT NULL,
    "apellidoMaterno" TEXT,
    "telefono" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rolId" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" TEXT NOT NULL,
    "matricula" VARCHAR(7) NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "agno" VARCHAR(4) NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propietarioId" TEXT NOT NULL,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Autorizacion" (
    "id" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,

    CONSTRAINT "Autorizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estacionamiento" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "patron" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Estacionamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cajon" (
    "id" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "disponible" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "estacionamientoId" TEXT NOT NULL,

    CONSTRAINT "Cajon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrada" (
    "id" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "autorizacionId" TEXT NOT NULL,
    "cajonId" TEXT NOT NULL,

    CONSTRAINT "Entrada_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_control_key" ON "Usuario"("control");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_matricula_key" ON "Vehiculo"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Estacionamiento_slug_key" ON "Estacionamiento"("slug");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autorizacion" ADD CONSTRAINT "Autorizacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autorizacion" ADD CONSTRAINT "Autorizacion_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cajon" ADD CONSTRAINT "Cajon_estacionamientoId_fkey" FOREIGN KEY ("estacionamientoId") REFERENCES "Estacionamiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_autorizacionId_fkey" FOREIGN KEY ("autorizacionId") REFERENCES "Autorizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_cajonId_fkey" FOREIGN KEY ("cajonId") REFERENCES "Cajon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
