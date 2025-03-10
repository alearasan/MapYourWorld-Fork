const { spawn } = require("child_process");

//Cargar la BD


spawn("npx ts-node map-service/src/mocks/district_create.ts", { cwd: "backend/map-service/src", shell: true, stdio: "inherit" })

process.on("close", (code) => {
    console.log(`[Process exited with code] ${code}`);
  });


spawn("npx ts-node backend_endpoint.ts", { cwd: "backend", shell: true, stdio: "ignore" });


spawn("npm start", { cwd: "frontend/mobile", shell: true, stdio: "inherit" });

