import { Repository } from 'typeorm';
import { Photo } from '../models/photo.model'; // Importa tu entidad
import { AppDataSource } from '../../../database/appDataSource'; // Importa la instancia de conexión

export default class PhotoRepository {
    private photoRepo: Repository<Photo>;

    constructor() {
        this.photoRepo = AppDataSource.getRepository(Photo);
    }

    async getAll(): Promise<Photo[]> {
        return await this.photoRepo.find();
    }

    async getById(id: string): Promise<Photo> {
        const photo = await this.photoRepo.findOneBy({ id });
        if (!photo) {
            throw new Error(`Photo with id ${id} not found`);
        }
        return photo;
    }

    async createPhoto(photoData: Omit<Photo, 'id'>): Promise<Photo> {
        const newPhoto = this.photoRepo.create(photoData);
        return await this.photoRepo.save(newPhoto);
    }

    async updatePhoto(id: string, updateData: Partial<Photo>): Promise<Photo> {
        const photo = await this.getById(id);
        Object.assign(photo, updateData);
        return await this.photoRepo.save(photo);
    }

    async deletePhoto(id: string): Promise<boolean> {
        const result = await this.photoRepo.delete(id);
        return result.affected !== 0;
    }

    // TODO: Hacer cuando esté implementada
    // async getByPoiId(poiId: string): Promise<Photo[]> {
    //     return await this.photoRepo.find({ where: { poi: { id: poiId } } });
    // }
}
