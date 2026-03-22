import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { joiValidationSchema } from './config/joi.shema';






@Module({
     

  imports: [
    
    //Para las variables de entorno

    ConfigModule.forRoot({
      isGlobal: true,
      load : [ EnvConfiguration] ,
      validationSchema: joiValidationSchema
    }),


    //conexion a la base de datos
    MongooseModule.forRoot(process.env.MONGODB!, {
      dbName: 'pokemondb'
    }),

    ServeStaticModule.forRoot({
    rootPath: join(__dirname,'..','public'),
    }), 

    // mis modulos
    PokemonModule,

    CommonModule,

    SeedModule
  ],
}) 

export class AppModule {}
