# 1. Base image
FROM node:24-alpine

# 2. Instalar pnpm globalmente
RUN npm install -g pnpm

# 3. Directorio de trabajo dentro del contenedor
WORKDIR /app

# 4. Copiamos los archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# 5. Instalamos dependencias con pnpm
RUN pnpm install --frozen-lockfile

# 6. Copiamos todo el contenido de la raíz al contenedor
# Esto incluye tu server.ts que está en la raíz
COPY . .

# 7. Exponemos el puerto
EXPOSE 3000

# 8. Comando para arrancar
# Asumiendo que tu script "dev" usa ts-node o similar sobre server.ts
CMD ["pnpm", "run", "dev"]