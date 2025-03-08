const { exec } = require("child_process");

const startBackend = exec("cd backend && npx ts-node backend_endpoint.ts");
const startFrontend = exec("cd frontend &&  cd mobile && npm start");

// Redirigir la salida de los procesos a la consola principal
startBackend.stdout.on("data", (data) => console.log(`[Backend] ${data}`));
startBackend.stderr.on("data", (data) => console.error(`[Backend Error] ${data}`));

startFrontend.stdout.on("data", (data) => console.log(`[Frontend] ${data}`));
startFrontend.stderr.on("data", (data) => console.error(`[Frontend Error] ${data}`));
