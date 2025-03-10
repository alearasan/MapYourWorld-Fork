const { spawn, execSync, exec } = require("child_process");


function killProcess(port) {
  return new Promise((resolve) => {
      exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
          if (err || !stdout.trim()) {
              console.log(`⚠️ No había procesos en el puerto ${port}.`);
              return resolve();
          }

          const lines = stdout.trim().split("\n");
          const pids = new Set(lines.map(line => line.trim().split(/\s+/).pop()));

          pids.forEach(pid => {
              exec(`taskkill /F /PID ${pid}`, (killErr, killStdout, killStderr) => {
                  if (killErr) {
                      console.error(`❌ No se pudo cerrar el proceso ${pid}: ${killStderr || killErr.message}`);
                  } else {
                      console.log(`✅ Proceso ${pid} en el puerto ${port} cerrado.`);
                  }
                  resolve();
              });
          });
      });
  });
}


killProcess(3000);
killProcess(8081);

spawn("npx ts-node map-service/src/mocks/district_create.ts", { cwd: "backend/map-service/src", shell: true, stdio: "inherit" })

process.on("close", (code) => {
    console.log(`[Process exited with code] ${code}`);
  });


spawn("npx ts-node backend_endpoint.ts", { cwd: "backend", shell: true, stdio: "ignore" });


spawn("npm start", { cwd: "frontend/mobile", shell: true, stdio: "inherit" });

