import { EntityRepository, Repository } from 'typeorm';
import { Friend, FriendStatus } from '../models/friend.model';
import { User } from '../../../auth-service/src/models/user.model';

@EntityRepository(Friend)
export class FriendRepository extends Repository<Friend> {
  /**
   * Encuentra todas las relaciones de amistad por userId y estado.
   */
  async findAllByIdAndStatus(userId: string, status: FriendStatus): Promise<Friend[]> {
    return this.createQueryBuilder('friend')
      .where('(friend.requesterId = :userId OR friend.recipientId = :userId)', { userId })
      .andWhere('friend.status = :status', { status })
      .leftJoinAndSelect('friend.requester', 'requester')
      .leftJoinAndSelect('friend.recipient', 'recipient')
      .getMany();
  }

  /**
   * Encuentra todos los usuarios cuyo nombre contenga el string dado.
   */

  /**
   * Crea una nueva relación de amistad.
   */
  async createFriend(friend: Friend): Promise<Friend> {
    return this.save(friend);
  }

  /**
   * Actualiza una relación de amistad.
   */
  async updateFriend(friend: Friend): Promise<Friend> {
    return this.save(friend);
  }

  /**
   * Elimina una relación de amistad.
   */
  async deleteFriend(id: string): Promise<void> {
    await this.delete(id);
  }
}

@EntityRepository(User)
export class UserFriendRepository extends Repository<User> {
    async findAllUsersByName(name: string): Promise<User[]> {
        return this.createQueryBuilder('user')
          .where('user.name LIKE :name', { name: `%${name}%` })
          .getMany();
      }
}
