import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('friendRequest')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.sendFriendRequests)
  creator: UserEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.receiveFriendRequests)
  receiver: UserEntity;
}
