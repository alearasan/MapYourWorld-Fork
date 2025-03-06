import express, { Request, Response } from 'express';
import cors from 'cors';
import districtRoutes from './routes/district.routes';
const app = express();
const PORT = process.env.PORT || 5999;

app.use(cors());
app.use(express.json());


app.use(districtRoutes);  


// Ruta '/PEPE/Prueba' con método GET
app.get('/PEPE/Prueba', (req: Request, res: Response) => {
  res.json({ message: '¡Ruta PEPE/Prueba alcanzada!' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


