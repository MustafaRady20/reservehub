import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class GetUserDto {
    @IsMongoId()
    @IsNotEmpty()
    _id:Types.ObjectId
}