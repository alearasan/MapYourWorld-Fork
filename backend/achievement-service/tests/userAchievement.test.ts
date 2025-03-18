import { createUserAchievement, getAchievementsByUser, getUsersByAchievement } from "../services/userAchievement.service";
import { UserAchievementRepository } from "../repositories/userAchievement.repository";
import { Role } from "../../auth-service/src/models/user.model";
import { PlanType } from "../../payment-service/models/subscription.model";

jest.mock('../repositories/userAchievement.repository', () => {
    const mockRepo = {
        createUserAchievement:jest.fn(),
        getAchievementsByUserId: jest.fn(),
        getUsersByAchievementId:jest.fn()

      };
      return {
        UserAchievementRepository: jest.fn().mockImplementation(() => mockRepo)
      };
});

describe("Pruebas de userAchiements", () => {
  let repoInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();
        // Se obtiene la instancia del repositorio simulado
        const UserAchievementRepositoryMock  = UserAchievementRepository as jest.Mock;
        // Crear una nueva instancia del mock antes de cada test
        new UserAchievementRepositoryMock();
        repoInstance = UserAchievementRepositoryMock.mock.results[0].value;
    });


  describe("createUserAchievement", () => {
    it("debe crear un nuevo usuario-logro", async () => {



        const userData = {
            id: 'user1',  // Asegúrate de que el id esté presente
            email: 'newuser@example.com',
            password: 'Password1!',
            role: Role.USER,
            is_active: true,  // Añadir propiedad is_active
            sentFriendRequests: [],  // Añadir sentFriendRequests
            receivedFriendRequests: [],  // Añadir receivedFriendRequests
            maps_joined: [],  // Añadir maps_joined
            profile: { 
                id: 'profile1', 
                username: 'newuser', 
                firstName: 'New', 
                lastName: 'User' 
            },
            subscription:{
              id:"suscripcion1",
              plan: PlanType.FREE,
              startDate: new Date('2024-01-01'),
              endDate: new Date('2024-12-31'),
              is_active: true,
              autoRenew: false,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-03-18'),   
            }
        } as any;
        userData.subscription.user = userData;

    
    
          const exampleAchievement = 
            { id: "101", name: "Primer Logro", description: "Descripción del primer logro", points: 10, iconUrl: "http://example.com/icon1.png" }

      const mockAchievementData = { user: userData, achievement: exampleAchievement, dateEarned: new Date() };
      const mockCreatedAchievement = { ...mockAchievementData, id: "789" };

      repoInstance.createUserAchievement = jest.fn().mockResolvedValue(mockCreatedAchievement);
      
      const result = await createUserAchievement(mockAchievementData, "456");

      expect(repoInstance.createUserAchievement).toHaveBeenCalledWith(mockAchievementData, "456");
      expect(result).toEqual(mockCreatedAchievement);
    });


  });

  describe("getAchievementsByUser", () => {
    it("debe obtener los logros de un usuario", async () => {
      const mockAchievements = [{ id: "1", user: { id: "123" }, achievement: { id: "456" } }];
      repoInstance.getAchievementsByUserId = jest.fn().mockResolvedValue(mockAchievements);
      
      const result = await getAchievementsByUser("123");
      
      expect(repoInstance.getAchievementsByUserId).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockAchievements);
    });
  });

  describe("getUsersByAchievement", () => {
    it("debe obtener los usuarios que consiguieron un logro", async () => {
      const mockUsers = [{ id: "123", name: "Usuario 1" }];
      repoInstance.getUsersByAchievementId = jest.fn().mockResolvedValue(mockUsers);
      
      const result = await getUsersByAchievement("456");
      
      expect(repoInstance.getUsersByAchievementId).toHaveBeenCalledWith("456");
      expect(result).toEqual(mockUsers);
    });
  });
});
