import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

 


@Injectable()
export class PokemonService {

  //creamos una dependencia para traernos el limit de las env 
  private defaultLimit : number | undefined

  //creamos el constructor para traernos el modelo e inyectarlo
  constructor(
    @InjectModel( Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>,
    private readonly configService : ConfigService
  ){
    
    this.defaultLimit = configService.get<number>('defaultlimit')
    console.log(this.defaultLimit)
    
  }
 
  // CREAMOS LA LOGICA PARA CREAR POKEMON
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name= createPokemonDto.name.toLocaleLowerCase()
    // para grabarlo en la base de datos, insertamos el modelo
    // usamos un try/catch para la validacion
    try {
      const pokemon = await this.pokemonModel.create (createPokemonDto)
      return pokemon;
    
    } catch (error) {
      this.handleErrorException(error)
    }
    
  }


  findAll(pagination:PaginationDto){
    // hacemos una destructuracion con los valores iniciales
    const {limit= this.defaultLimit , offset=0} = pagination
    
    return this.pokemonModel.find()
      .limit(limit!)
      .skip(offset)
      .sort({  // para que empiece de manera ascendente segun su no
        no:1
      })
      .select('-__v') // para quitar el dato de la version
  }

  async findOne(term: string) {
    //para verificar que pokemon tiene que tener las entidades
    let pokemon : Pokemon | null = null
    //identificamos por el no
    if( !isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no:term})
    }
    //identificamos por el _id de Mongo
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term)
    }
    //identificamos por el name
    if(!pokemon) {
      pokemon = await this.pokemonModel.findOne({name:term.toLowerCase})
    }


    if(!pokemon) throw new NotFoundException(`Pokemon with id, name or no ${term}, not found`)


    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      //la busqueda en un solo metodo
      const pokemon = await this.findOne(term)

      //pasar el buscador a minusculas
      if(updatePokemonDto.name) 

      updatePokemonDto.name = updatePokemonDto.name?.toLowerCase()

      //acutalizamos la data
      await pokemon.updateOne(updatePokemonDto, {new:true})

      return {...pokemon.toJSON(), ...updatePokemonDto}
    } catch (error) {
      this.handleErrorException(error)
    }
    
    
  }

  async remove(id: string) {
    // localizamos por el id
    // const pokemon = await this.findOne(id)
    // await pokemon.deleteOne()
    // const result =  await this.pokemonModel.findByIdAndDelete(id)
    // VALIDACION Y ELIMINACION
    const {deletedCount} = await this.pokemonModel.deleteOne({_id : id})
    if(deletedCount === 0) {
      throw new BadRequestException(`Pokemon whit id "${id}" not found `)
    }

    return

  }


  //para los errores, nos permite tener centralizado todos los errores excepciones no controladas
  private handleErrorException (error:any) {
    if(error.code === 11000){
        throw new BadRequestException(`Pokemon exists in db ${JSON.stringify( error.keyValue)}`)
      }
      console.log(error)
      throw new InternalServerErrorException(`Can't update Pokemon - Check server logs `)
  }
}
