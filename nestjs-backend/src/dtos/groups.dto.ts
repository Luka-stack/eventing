import { Exclude, Expose, Transform } from 'class-transformer';

export class GroupsDto {
  @Exclude()
  subscribers: any;

  @Expose()
  @Transform(({ obj }) => obj.subscribers.length > 0)
  subscribed: boolean;
}
