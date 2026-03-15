import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator"

export class CreatePokemonDto {
    // las propiedades de no
   @IsInt()
   @IsPositive()
   @Min(1) 
   no: number

   // las propiedades del name
   @IsString()
   @MinLength(1)
    name: string

}
