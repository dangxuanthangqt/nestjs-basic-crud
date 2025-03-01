import { Expose, Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class PostRequestDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}

export class AuthorInPostResponseDto {
  @Expose()
  name: string;
}

export class PostResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => AuthorInPostResponseDto)
  author: AuthorInPostResponseDto;

  constructor(partial: Partial<PostResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PostsResponseDto {
  @Expose()
  @Type(() => PostResponseDto)
  posts: PostResponseDto[];

  constructor(partial: Partial<PostsResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UpdatePostRequestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content: string;
}

export class UpdatePostResponseDto extends PostResponseDto {}
