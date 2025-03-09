import { Repository } from 'typeorm';
import { Map } from '../models/map.model'; // Importa tu entidad
import { AppDataSource } from '../../../database/appDataSource'; // Importa la instancia de conexión

export default class MapRepository {
    private mapRepo: Repository<Map>;

    constructor() {
        this.mapRepo = AppDataSource.getRepository(Map);
    }

    async createMap(mapData: Omit<Map, 'id'>): Promise<Map> {
        const map = this.mapRepo.create(mapData);
        return await this.mapRepo.save(map);
    }
 
    async getMapById(mapId: string): Promise<Map> {
        const map = await this.mapRepo.findOneBy({ id: mapId });
        if (!map) {
            throw new Error(`District with id ${mapId} not found`);
        }
        return map;
    }


    async updateMap(mapId: string, mapData: Partial<Map>): Promise<Map> {
        const map = await this.getMapById(mapId);
        Object.assign(map, mapData);
        return await this.mapRepo.save(map);
    }


}
