import { createFriend, listFriends, findFriendById, listSearchUser, updateFriendStatus } from '../services/friend.service';
import { FriendStatus, Friend, RequestType } from '../models/friend.model';
import { User } from '../../../auth-service/src/models/user.model';
import { AppDataSource } from '../../../database/appDataSource';
import FriendRepository from '../repositories/friend.repository';
import { create } from 'domain';

// Creamos un helper para generar datos válidos de amistad
const createValidFriendData = (overrides: Partial<Omit<Friend, 'id'>> = {}): Omit<Friend, 'id'> => ({
    requester: { id: 'user1' } as User,
    recipient: { id: 'user2' } as User,
    status: FriendStatus.PENDING,
    requestType: RequestType.FRIEND,
    map: {
      id: 'map1',
      name: 'Default Map',
      description: 'Mapa para test',
      createdAt: new Date(),
      is_colaborative: false,
      users_joined: [],
      user_created: { id: 'user1' } as User,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});

jest.mock('../repositories/friend.repository', () => {
    const mockRepo = {
        findExistingFriendship: jest.fn(),
        createFriend: jest.fn(),
        updateFriendStatus: jest.fn(),
        findAllByIdAndStatus: jest.fn(),
        getFriendById: jest.fn(),
        findAllUsersByName: jest.fn(),
    };
    
    const MockFriendRepository = jest.fn().mockImplementation(function() {
        return mockRepo;
    });
    
    return {
        __esModule: true,
        default: MockFriendRepository
    };
});


describe('Friend Service', () => {
    let repoInstance: any;
    let errorSpy: jest.SpyInstance;
    let userRepo: any;

    beforeAll(() => {
        errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterAll(() => {
        errorSpy.mockRestore();
    });
    beforeEach(() => {
        jest.clearAllMocks();
        const FriendRepositoryMock = FriendRepository as jest.Mock;
        new FriendRepositoryMock();
        repoInstance = FriendRepositoryMock.mock.results[0].value;

        userRepo = { findOne: jest.fn() };
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(userRepo);
    });

    describe('createFriend', () => {
        it('debe crear una nueva solicitud de amistad', async () => {
            const validFriendData = createValidFriendData();
            
            userRepo.findOne.mockResolvedValueOnce(validFriendData.requester);
            userRepo.findOne.mockResolvedValueOnce(validFriendData.recipient);

            repoInstance.findExistingFriendship.mockResolvedValue(null);
            const newFriend: Friend = { id: 'friend1', ...validFriendData };
            repoInstance.createFriend.mockResolvedValue(newFriend);

            const res = await createFriend(validFriendData);
            expect(repoInstance.createFriend).toHaveBeenCalledWith(validFriendData);
            expect(res).toEqual(newFriend);
        });
        
        it('debe lanzar error si faltan datos requeridos', async () => {

            const invalidData = {
              requester: undefined,
              recipient: undefined,
              status: undefined,

              createdAt: new Date(),
              updatedAt: new Date(),
            };
          
            await expect(createFriend(invalidData as any)).rejects.toThrow(
              "Los datos de receptor, solicitante y estado de la petición son necesarios."
            );
          });

        it('debe lanzar error si el receptor y el solicitante son iguales', async () => {
            const friendData = createValidFriendData({
                requester: { id: 'user1' } as User,
                recipient: { id: 'user1' } as User,
            });
            await expect(createFriend(friendData)).rejects.toThrow(
                "El receptor y el solicitante deben ser distintos."
            );
        });

        it('debe lanzar error si el usuario solicitante no existe', async () => {
            const validFriendData = createValidFriendData();
            userRepo.findOne.mockResolvedValueOnce(null);
            await expect(createFriend(validFriendData)).rejects.toThrow(
                `Usuario solicitante con ID ${validFriendData.requester.id} no encontrado`
            );
        });

        it('debe lanzar error si el usuario receptor no existe', async () => {
            const validFriendData = createValidFriendData();
            userRepo.findOne.mockResolvedValueOnce(validFriendData.requester);
            userRepo.findOne.mockResolvedValueOnce(null);
            await expect(createFriend(validFriendData)).rejects.toThrow(
                `Usuario receptor con ID ${validFriendData.recipient.id} no encontrado`
            );
        });

        it('debe retornar error de solicitud pendiente si ya existe una amistad pendiente', async () => {
            const validFriendData = createValidFriendData();
            userRepo.findOne.mockResolvedValueOnce(validFriendData.requester);
            userRepo.findOne.mockResolvedValueOnce(validFriendData.recipient);
            repoInstance.findExistingFriendship.mockResolvedValue({ status: FriendStatus.PENDING });

            const res = await createFriend(validFriendData);
            expect(res).toEqual({
                success: false,
                message: "Ya existe una solicitud de amistad pendiente entre estos usuarios."
            });
        });

        it('debe retornar error de usuarios ya amigos si ya existe una amistad aceptada', async () => {
            const validFriendData = createValidFriendData();
            userRepo.findOne.mockResolvedValueOnce(validFriendData.requester);
            userRepo.findOne.mockResolvedValueOnce(validFriendData.recipient);
            repoInstance.findExistingFriendship.mockResolvedValue({ status: FriendStatus.ACCEPTED });

            const res = await createFriend(validFriendData);
            expect(res).toEqual({
                success: false,
                message: "Estos usuarios ya son amigos."
            });
        });

        it('debe retornar error de bloqueo si ya existe una amistad bloqueada', async () => {
            const validFriendData = createValidFriendData();
            userRepo.findOne.mockResolvedValueOnce(validFriendData.requester);
            userRepo.findOne.mockResolvedValueOnce(validFriendData.recipient);
            repoInstance.findExistingFriendship.mockResolvedValue({ status: FriendStatus.BLOCKED });

            const res = await createFriend(validFriendData);
            expect(res).toEqual({
                success: false,
                message: "No se puede enviar solicitud porque uno de los usuarios ha bloqueado la relación."
            });
        });

        it('debe actualizar la solicitud a pendiente si la amistad estaba en estado eliminado', async () => {
            const validFriendData = createValidFriendData();
            userRepo.findOne.mockResolvedValueOnce(validFriendData.requester);
            userRepo.findOne.mockResolvedValueOnce(validFriendData.recipient);
            const existingFriendship = { id: 'friend1', status: FriendStatus.DELETED };
            repoInstance.findExistingFriendship.mockResolvedValue(existingFriendship);

            const updatedFriend = { id: 'friend1', status: FriendStatus.PENDING };
            repoInstance.updateFriendStatus.mockResolvedValue(updatedFriend);

            const res = await createFriend(validFriendData);
            expect(repoInstance.updateFriendStatus).toHaveBeenCalledWith(existingFriendship.id, FriendStatus.PENDING);
            expect(res).toEqual(updatedFriend);
        });
    });

    describe('listFriends', () => {
        it('debe retornar una lista de solicitudes de amistad según el estado y usuario', async () => {
          const dummyFriends: Friend[] = [
            {
              id: 'friend1',
              requester: { id: 'user1' } as User,
              recipient: { id: 'user2' } as User,
              status: FriendStatus.PENDING,
              requestType: RequestType.FRIEND,
              map: {
                id: 'map1',
                name: 'Default Map',
                description: 'Mapa para test',
                createdAt: new Date(),
                is_colaborative: false,
                users_joined: [],
                user_created: { id: 'user1' } as User,
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'friend2',
              requester: { id: 'user1' } as User,
              recipient: { id: 'user3' } as User,
              status: FriendStatus.PENDING,
              requestType: RequestType.FRIEND,
              map: {
                id: 'map1',
                name: 'Default Map',
                description: 'Mapa para test',
                createdAt: new Date(),
                is_colaborative: false,
                users_joined: [],
                user_created: { id: 'user1' } as User,
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ];
          repoInstance.findAllByIdAndStatus.mockResolvedValue(dummyFriends);
          const result = await listFriends(FriendStatus.PENDING, 'user1');
          expect(repoInstance.findAllByIdAndStatus).toHaveBeenCalledWith('user1', FriendStatus.PENDING);
          expect(result).toEqual(dummyFriends);
        });

        it('debe lanzar error si ocurre un problema al buscar las solicitudes', async () => {
          repoInstance.findAllByIdAndStatus.mockRejectedValue(new Error('Database error'));
          await expect(listFriends(FriendStatus.PENDING, 'user1')).rejects.toThrow('Database error');
        });
      });

      describe('findFriendById', () => {
        it('debe retornar la solicitud de amistad si se encuentra', async () => {
          const friend: Friend = {
            id: 'friend1',
              requester: { id: 'user1' } as User,
              recipient: { id: 'user2' } as User,
              status: FriendStatus.PENDING,
              requestType: RequestType.FRIEND,
              map: {
                id: 'map1',
                name: 'Default Map',
                description: 'Mapa para test',
                createdAt: new Date(),
                is_colaborative: false,
                users_joined: [],
                user_created: { id: 'user1' } as User,
              },
              createdAt: new Date(),
              updatedAt: new Date(),
          };
          repoInstance.getFriendById.mockResolvedValue(friend);
          const result = await findFriendById('friend1');
          expect(repoInstance.getFriendById).toHaveBeenCalledWith('friend1');
          expect(result).toEqual(friend);
        });
    
        it('debe lanzar error si no se encuentra la solicitud de amistad', async () => {
          repoInstance.getFriendById.mockResolvedValue(null);
          await expect(findFriendById('friend1')).rejects.toThrow('Solicitud de amistad con ID friend1 no encontrada');
        });
      });

      describe('listSearchUser', () => {
        it('debe retornar una lista de usuarios que coinciden con el criterio de búsqueda', async () => {
          const dummyUsers: User[] = [{ id: 'user1' } as User, { id: 'user2' } as User];
          repoInstance.findAllUsersByName.mockResolvedValue(dummyUsers);
          const result = await listSearchUser('usuario');
          expect(repoInstance.findAllUsersByName).toHaveBeenCalledWith('usuario');
          expect(result).toEqual(dummyUsers);
        });
      });
      

      describe('updateFriendStatus', () => {
        it('debe actualizar a ACCEPTED y retornar mensaje de éxito', async () => {
          const updatedFriend = { id: 'friend1', status: FriendStatus.ACCEPTED };
          repoInstance.updateFriendStatus.mockResolvedValue(updatedFriend);
          const result = await updateFriendStatus('friend1', FriendStatus.ACCEPTED);
          expect(repoInstance.updateFriendStatus).toHaveBeenCalledWith('friend1', FriendStatus.ACCEPTED);
          expect(result).toEqual({
            success: true,
            message: 'Solicitud de amistad aceptada correctamente',
          });
        });
    
        it('debe actualizar a BLOCKED y retornar mensaje de éxito', async () => {
          const updatedFriend = { id: 'friend1', status: FriendStatus.BLOCKED };
          repoInstance.updateFriendStatus.mockResolvedValue(updatedFriend);
          const result = await updateFriendStatus('friend1', FriendStatus.BLOCKED);
          expect(repoInstance.updateFriendStatus).toHaveBeenCalledWith('friend1', FriendStatus.BLOCKED);
          expect(result).toEqual({
            success: true,
            message: 'Solicitud de amistad bloqueada correctamente',
          });
        });
    
        it('debe actualizar a DELETED y retornar mensaje de éxito', async () => {
          const updatedFriend = { id: 'friend1', status: FriendStatus.DELETED };
          repoInstance.updateFriendStatus.mockResolvedValue(updatedFriend);
          const result = await updateFriendStatus('friend1', FriendStatus.DELETED);
          expect(repoInstance.updateFriendStatus).toHaveBeenCalledWith('friend1', FriendStatus.DELETED);
          expect(result).toEqual({
            success: true,
            message: 'Solicitud de amistad eliminada correctamente',
          });
        });
    
        it('debe lanzar error si la actualización a ACCEPTED no es correcta', async () => {

          const updatedFriend = { id: 'friend1', status: FriendStatus.PENDING };
          repoInstance.updateFriendStatus.mockResolvedValue(updatedFriend);
          await expect(updateFriendStatus('friend1', FriendStatus.ACCEPTED)).rejects.toThrow(
            'Error al actualizar el estado de la solicitud de amistad'
          );
        });
    
        it('debe lanzar error si la actualización a BLOCKED no es correcta', async () => {
          const updatedFriend = { id: 'friend1', status: FriendStatus.PENDING };
          repoInstance.updateFriendStatus.mockResolvedValue(updatedFriend);
          await expect(updateFriendStatus('friend1', FriendStatus.BLOCKED)).rejects.toThrow(
            'Error al actualizar el estado de la solicitud de amistad'
          );
        });
    
        it('debe lanzar error si la actualización a DELETED no es correcta', async () => {
          const updatedFriend = { id: 'friend1', status: FriendStatus.PENDING };
          repoInstance.updateFriendStatus.mockResolvedValue(updatedFriend);
          await expect(updateFriendStatus('friend1', FriendStatus.DELETED)).rejects.toThrow(
            'Error al actualizar el estado de la solicitud de amistad'
          );
        });
    
        it('debe lanzar error para un estado no soportado', async () => {
          const updatedFriend = { id: 'friend1', status: FriendStatus.PENDING };
          repoInstance.updateFriendStatus.mockResolvedValue(updatedFriend);
          await expect(updateFriendStatus('friend1', FriendStatus.PENDING)).rejects.toThrow(
            'Error al actualizar el estado de la solicitud de amistad'
          );
        });
      });
});
