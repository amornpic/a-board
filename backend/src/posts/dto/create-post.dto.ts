import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  community: string;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  user_id: number;
}
