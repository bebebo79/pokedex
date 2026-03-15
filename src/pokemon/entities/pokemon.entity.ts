import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class Pokemon extends Document {

    // id: string no hace falta porque Mongo me lo da
    @Prop({
        unique: true,
        index : true
    })
    name:string;

    @Prop({
        unique: true,
        index: true
    })
    no: number;
}

// exportamos el schema
export const PokemonSchema =  SchemaFactory.createForClass(Pokemon)