# Usa una imagen base de Node.js ligera (Alpine)
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de manifiesto e instala las dependencias
# Esta separación permite que Docker cachee las dependencias y sea más rápido en despliegues futuros
COPY package*.json ./
RUN npm install --omit=dev

# Copia el resto de tu código
COPY . .

# Expone el puerto 8080, que configuramos en server.js
EXPOSE 8080

# Comando para iniciar tu aplicación
CMD ["node", "server.js"]