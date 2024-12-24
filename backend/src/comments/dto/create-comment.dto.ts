import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
    @IsNotEmpty()
    massage: string;

    @IsNotEmpty()
    post_id: number;
  
    @IsNotEmpty()
    user_id: number;
}
