import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

import { AxiosAdapter } from 'src/common/adapters/axios-adapter';


@Injectable()
export class SeedService {
    

    // nos traemos el constuctor de Pokemo
    constructor(
        @InjectModel( Pokemon.name)
        private readonly pokemonModel : Model<Pokemon>,

        private readonly http : AxiosAdapter
      ){}
    
    // el metodo que creamos para ejecutar nuestra semilla  
    async executeSeed(){
        //antes de traer datos reseteamos los datos de nuestra base de datos para evitar duplicados
        await this.pokemonModel.deleteMany({})

        // nos traemos la data de la api
        const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

        // para inyectar multiples registros y no ir uno por uno
        const pokemonToInsert : {name:string, no: number}[] = []
        
        // extraemos de la data lo que necesitamos ( name y no, que esta en la url)
        data.results.forEach( ({name, url})=>{
            const segmentos = url.split('/')
            const no = +segmentos[segmentos.length -2]

            //esta seria la insercion del Modelo inyectado uno por uno
            // const pokemon = await this.pokemonModel.create ({name, no})

            //inyectomos en el array los datos de la api
            pokemonToInsert.push({name, no})
        })

        // insertamos en la base de datos el array completo
        await this.pokemonModel.insertMany(pokemonToInsert)

        // lo que retorna el postman
        return " Seed executed "
    }
}
