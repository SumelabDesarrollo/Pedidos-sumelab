# Usar una imagen de Node.js para construir la aplicación
FROM node:19 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente de la aplicación
COPY . .

# Compilar la aplicación Angular
RUN npm run build --prod

# Usar una imagen de Nginx para servir la aplicación
FROM nginx:alpine

# Copiar los archivos compilados al directorio de Nginx
COPY --from=build /app/dist/sistema-pedidos-sumelab /usr/share/nginx/html

# Copiar el archivo de configuración de Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf


# Exponer el puerto 80
EXPOSE 80

# Comando para correr Nginx
CMD ["nginx", "-g", "daemon off;"]
