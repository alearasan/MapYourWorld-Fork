import {uploadPhotoToPoi,findPhotoById,findAllPhotos,updatePhoto,deletePhoto,getPhotosByPoiId} from '../services/photo.service';
import {PhotoRepository} from '../repositories/photo.repository';
import { Photo } from '../models/photo.model';
// Mock the UserStatRepository
jest.mock('../repositories/photo.repository', () => {
    const mockRepo = {
      getAll: jest.fn(),
      getById: jest.fn(),
      createPhoto: jest.fn(),
      updatePhoto: jest.fn(),
      deletePhoto: jest.fn(),
      getByPoiId: jest.fn(),
    };
    return {
        PhotoRepository: jest.fn().mockImplementation(() => mockRepo)
    };
  });

  describe('Photo Service Tests', () => {
      let repoInstance: any;
      let originalConsoleError: any;
    
      beforeEach(() => {
        jest.clearAllMocks();
        // Guardar la implementación original de console.error
        originalConsoleError = console.error;
        // Reemplazar console.error con un mock vacío
        console.error = jest.fn();
        
        // Get the mocked repository instance
        const PhotoRepositoryMock = PhotoRepository as jest.Mock;
        // Create a new instance of the mock before each test
        new PhotoRepositoryMock();
        repoInstance = PhotoRepositoryMock.mock.results[0].value;
      });
    
      afterEach(() => {
        // Restaurar la implementación original de console.error
        console.error = originalConsoleError;
      });

      describe('findAllPhotos', () => {
            it('should return all photos', async () => {
              const mockPhotos = [
                { id: '1', poi: {}, image: 10, uploadDate: new Date(), caption: 'caption', createdAt: new Date(),updatedAt: new Date() },
                { id: '2', poi: {}, image: 20, uploadDate: new Date(), caption: 'caption', createdAt: new Date(),updatedAt: new Date() }
              ];
              repoInstance.getAll.mockResolvedValue(mockPhotos);
        
              const result = await findAllPhotos();
        
              expect(repoInstance.getAll).toHaveBeenCalled();
              expect(result).toEqual(mockPhotos);
            });
        
            it('should throw an error when repository fails', async () => {
              repoInstance.findAll.mockRejectedValue(new Error('Database error'));
        
              await expect(findAllPhotos()).rejects.toThrow('Could not fetch photos');
            });
          });
          
    });