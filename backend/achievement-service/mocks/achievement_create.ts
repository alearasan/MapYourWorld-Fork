    import { createAchievement } from "../services/achievement.service";
    import { Achievement } from "../models/achievement.model";
    import { AppDataSource } from "../../database/appDataSource";
    export async function createAchievements() {
    try{
        if (!AppDataSource.isInitialized) {
            console.log("🔄 Inicializando la base de datos...");
            await AppDataSource.initialize();
            console.log("✅ Base de datos inicializada.");
        }
            
        const existingAchievements = await AppDataSource.getRepository(Achievement).count();
        if (existingAchievements > 0) {
            console.log("⚠️ Los logros ya han sido creados. No se insertarán duplicados.");
            return;
        }
        const explorador_novato:Omit<Achievement, 'id'>= {
            name: "Explorador Novato",
            description: "Crea tu primer punto de interés.",
            points: 10,
            iconUrl:"https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg"  //TODO cambiar foto al logro
        }
        await createAchievement(explorador_novato);

        const cartografo_aficionado:Omit<Achievement, 'id'>= {
            name: "Cartógrafo Aficionado ",
            description: "Crea 10 puntos de interés.",
            points: 50,
            iconUrl:"https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg"  //TODO cambiar foto al logro
        }
        await createAchievement(cartografo_aficionado);
        const maestro_del_mapa:Omit<Achievement, 'id'>= {
            name: "Maestro del Mapa",
            description: "Crea 50 puntos de interés.",
            points: 250,
            iconUrl:"https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg"  //TODO cambiar foto al logro
        }
        await createAchievement(maestro_del_mapa);
        const conector_social:Omit<Achievement, 'id'>= {
            name: "Conector Social",
            description: "Haz tu primer amigo.",
            points: 15,
            iconUrl:"https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg"  //TODO cambiar foto al logro
        }
        await createAchievement(conector_social);
        const circulo_de_amigos:Omit<Achievement, 'id'>= {
            name: "Círculo de Amigos",
            description: "Haz 10 amigos.",
            points: 75,
            iconUrl:"https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg"  //TODO cambiar foto al logro
        }
        await createAchievement(circulo_de_amigos);
        const red_social:Omit<Achievement, 'id'>= {
            name: "Red Social",
            description: "Haz 50 amigos.",
            points: 400,
            iconUrl:"https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg"  //TODO cambiar foto al logro
        }
        await createAchievement(red_social);
        const primeros_pasos:Omit<Achievement, 'id'>= {
            name: "Primeros pasos",
            description: "Acumula 1 kilómetro de distancia.",
            points: 20,
            iconUrl:"https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg"  //TODO cambiar foto al logro
        }
        await createAchievement(primeros_pasos);
        const maratonista_urbano:Omit<Achievement, 'id'>= {
            name: "Maratonista Urbano",
            description: "Acumula 50 kilómetros de distancia.",
            points: 150,
            iconUrl:"https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg"  //TODO cambiar foto al logro
        }
        await createAchievement(maratonista_urbano);
        const explorador_incansable:Omit<Achievement, 'id'>= {
            name: "Explorador Incansable",
            description: "Acumula 200 kilómetros de distancia.",
            points: 750,
            iconUrl:"https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg"  //TODO cambiar foto al logro
        }
        await createAchievement(explorador_incansable);
        const racha_inicial:Omit<Achievement, 'id'>= {
            name: "Racha Inicial",
            description: "Inicia sesión 3 días consecutivos.",
            points: 25,
            iconUrl:"https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg"  //TODO cambiar foto al logro
        }
        await createAchievement(racha_inicial);
        const racha_semanal:Omit<Achievement, 'id'>= {
            name: "Racha Semanal",
            description: "Inicia sesión 7 días consecutivos.",
            points: 100,
            iconUrl:"https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg"  //TODO cambiar foto al logro
        }
        await createAchievement(racha_semanal);
        const racha_mensual:Omit<Achievement, 'id'>= {
            name: "Racha Mensual",
            description: "Inicia sesión 30 días consecutivos.",
            points: 500,
            iconUrl:"https://static.vecteezy.com/system/resources/previews/016/916/479/non_2x/placeholder-icon-design-free-vector.jpg"  //TODO cambiar foto al logro
        }
        await createAchievement(racha_mensual);
    }catch(error){
        console.error("❌ Error al crear los logros:", error);
    }
    }