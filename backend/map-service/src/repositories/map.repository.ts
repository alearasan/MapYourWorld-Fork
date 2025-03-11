import { Repository } from 'typeorm';
import { Map } from '../models/map.model'; // Importa tu entidad
import { AppDataSource } from '../../../database/appDataSource'; // Importa la instancia de conexión
import { User } from '../../../auth-service/src/models/user.model';

export default class MapRepository {
    private mapRepo: Repository<Map>;
    private userRepo: Repository<User>;

    constructor() {
        this.mapRepo = AppDataSource.getRepository(Map);
        this.userRepo = AppDataSource.getRepository(User);
    }

    async createMap(mapData: Omit<Map, 'id'>, userId: string): Promise<Map> {
        const map = this.mapRepo.create(mapData);

        if (!map) {
            throw new Error(`Mapa no enviado correctamente`);
        }

        const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['maps_joined'] });
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }

        map.user_created = user;
        return await this.mapRepo.save(map);
    }

    async createMapColaborativo(mapData: Omit<Map, 'id'>, userId: string): Promise<Map> {
        const map = this.mapRepo.create(mapData);
        map.is_colaborative = true;
        if (!map) {
            throw new Error("Mapa no enviado correctamente");
        }


        const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['maps_joined'] });
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        map.user_created = user;
        const lista_usuarios_unidos = []
        lista_usuarios_unidos.push(user);
        map.users_joined = lista_usuarios_unidos;
         await this.mapRepo.save(map);

        
        const lista_mapas_unidos = []
        lista_mapas_unidos.push(map);
        user.maps_joined = lista_mapas_unidos;
        await this.userRepo.save(user);
        
        return map
    }


    async getMapById(mapId: string): Promise<Map> {
        const map = await this.mapRepo.findOne({ where: { id: mapId }, relations: ['users_joined'] });
        if (!map) {
            throw new Error(`District with id ${mapId} not found`);
        }
        return map;
    }

    async getUsersOnMapById(mapId: string): Promise<User[]> {
        const map = await this.mapRepo.findOne({ where: { id: mapId }, relations: ['users_joined'] });
        if (!map) {
            throw new Error(`Mapa con id ${mapId} no encontrado`);
        }

        const users = map.users_joined;
        if (!users) {
            throw new Error(`No hay usuarios en el mapa con id ${mapId}`);
        }
        return users;
    }


    async updateMap(mapId: string, mapData: Partial<Map>): Promise<Map> {
        const map = await this.getMapById(mapId);
        Object.assign(map, mapData);
        return await this.mapRepo.save(map);
    }

    async deleteMap(mapId: string): Promise<void> {
        const map = await this.getMapById(mapId);
        await this.mapRepo.remove(map);
    }


}
