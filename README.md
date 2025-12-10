# 🐺 Los Hombres Lobo de Castronegro - Desafío

- **Autores:** Marta Frontón, Álvaro Martín y Alfredo Carrero.
- **Nombre del grupo**: Los del Fondo, fondo.

Bienvenido al repositorio de la adaptación web del clásico juego de cartas **"Los Hombres Lobo de Castronegro"**. Este proyecto es una aplicación full-stack que permite jugar partidas en tiempo real, gestionando la lógica del juego, las fases (día/noche) y las interacciones entre jugadores.

## 📋 Descripción del Proyecto

El objetivo de esta aplicación es digitalizar la experiencia del juego de mesa, permitiendo a los usuarios registrarse, crear y unirse a partidas y jugar con los siguientes roles implementados:

- 🐺 **Lobos:** Se despiertan por la noche para eliminar a un aldeano.
- 👩🏼‍🤝‍🧑🏻 **Aldeanos:** Deben deducir quiénes son los lobos y votarlos durante el día.
- 👧 **Niña:** Puede espiar (con riesgo) durante el turno de los lobos.
- 🔮 **Vidente:** Puede descubrir la verdadera identidad de un jugador cada noche.
- 🧙‍♀️ **Bruja:** Tiene dos pociones (una para revivir y otra para matar) que puede usar una vez por partida.

## 🚀 Tecnologías Utilizadas

El proyecto utiliza una arquitectura de microservicios contenerizada con Docker.

- **Backend:** [Laravel](https://laravel.com/) (API REST).
- **Frontend:** [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/) (Vanilla, sin framework).
- **Base de Datos:** MySQL 8.0.
- **Tiempo Real:** Websockets.
- **Infraestructura:** Docker & Nginx.
- **Testing:** PHPUnit (Backend).

## 🐳 Estructura de Contenedores

Basado en la configuración de Docker, el proyecto levanta los siguientes servicios:

| Servicio     | Contenedor    | Puerto Local | Descripción                                 |
| :----------- | :------------ | :----------- | :------------------------------------------ |
| **Proxy**    | `nginx_proxy` | `80`         | Punto de entrada principal (Reverse Proxy). |
| **Frontend** | `ts_frontend` | `5173`       | Servidor de desarrollo Vite + TS.           |
| **Backend**  | `laravel_app` | `8000`       | Servidor de aplicación Laravel.             |
| **Database** | `mysql_db`    | `3307`       | Base de datos MySQL.                        |
| **DB Admin** | `adminer`     | `8082`       | Interfaz web para gestionar la BBDD.        |

## 🛠️ Instalación y Despliegue

Sigue estos pasos para descargar y ejecutar el proyecto en tu máquina local.

### Prerrequisitos

- Tener instalado [Docker](https://www.docker.com/) y Docker Compose.
- Tener instalado Git(opcional si descargas el proyecto).

### Paso 1: Clonar el repositorio

Abre tu terminal y ejecuta:

```bash
git clone <URL_DE_TU_REPOSITORIO>
cd desafio-hombres-lobo
```

O descarga desde nuestro repositorio el raw

### Paso 2: Configuración de Entorno

Antes de levantar los contenedores, asegúrate de configurar las variables de entorno. Normalmente deberás duplicar el archivo de ejemplo:

```bash
cp .env.example .env
```

_(Asegúrate de que las credenciales de base de datos en el .env coincidan con las definidas en el docker-compose.yml)_.

### Paso 3: Levantar los contenedores

Tienes dos opciones, o bien ejecutar el init.bat o desde terminal poner el siguiente comando:

```bash
docker compose up -d --build
```

Esto descargará las imágenes de Node, PHP, Nginx y MySQL y levantará los servicios.

### 🎮 Cómo Usar

Una vez completados los pasos anteriores, puedes acceder a la aplicación:

- **Aplicación Web:** Abre tu navegador en http://localhost (o el puerto configurado en nginx).

- **Frontend Directo (Dev):** http://localhost:5173

- **Gestión de Base de Datos (Adminer):** http://localhost:8082 (Sistema: MySQL, Servidor: mysql_db, Usuario/Pass: ver .env).

### ✅ Testing

El proyecto cuenta con tests automatizados para asegurar la lógica del backend. Para ejecutarlos, utiliza el siguiente comando:

```bash
docker compose exec laravel_app php artisan test
```

### 🤝 Contribución

Si deseas contribuir, por favor abre un Pull Request o crea un Issue para discutir los cambios propuestos.

---

_Proyecto realizado como desafío técnico._
README.md
5 KB
