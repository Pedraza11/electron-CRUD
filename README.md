# electron-CRUD
--COMANDOS NECESARIOS PARA INICIAR EL PROYECTO--



npm init -y



npm install electron electron-builder --save-dev



npm install sqlite3 knex



npm install electron-reload


--EJECUCION--


npm run start  


---COMO HACERLO .EXE---
1. Instalar dependencias necesarias
Asegúrate de tener Electron y Electron Builder instalados en tu proyecto. Si no lo has hecho, usa los siguientes comandos:

npm install electron --save-dev
npm install electron-builder --save-dev


2. Configurar package.json
En el archivo package.json de tu proyecto, debes incluir una sección de scripts para compilar el ejecutable y una sección de build para configurar el comportamiento del archivo resultante.

Ejemplo básico:

json
Copiar código
{
  "name": "mi-aplicacion-electron",
  "version": "1.0.0",
  "description": "Descripción de la aplicación",
  "main": "src/main.js",
  "scripts": {
    "start": "electron .",
    "dist": "electron-builder"
  },
  "devDependencies": {
    "electron": "^24.0.0",
    "electron-builder": "^24.0.0"
  },
  "build": {
    "appId": "com.miapp.electron",
    "productName": "Mi Aplicación Electron",
    "files": [
      "**/*"
    ],
    "directories": {
      "output": "dist"
    },
    "mac": {
      "category": "public.app-category.productivity"
    },
    "win": {
      "target": "nsis"
    }
  }
}
files: Incluye todos los archivos de tu aplicación que deseas empaquetar.
output: La carpeta donde se guardará el ejecutable.
win: Especifica cómo se empaquetará para Windows, en este caso con el instalador NSIS.
mac: Configuración para macOS (opcional si solo te interesa Windows, por ejemplo).


3. Crear el ejecutable
Ahora, con la configuración lista, ejecuta el siguiente comando en tu terminal para crear el instalador/autónomo:

npm run dist
