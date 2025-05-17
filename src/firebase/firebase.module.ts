import { Module, Global, DynamicModule } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseConfigService } from './firebase.config.service'
import { ConfigService } from '@nestjs/config';
import * as firebaseAdmin from 'firebase-admin';

@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {
    static forRoot(): DynamicModule {
      const firebaseConfigProvider = {
        provide: FirebaseConfigService,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const apiKey =  configService.get<string>('FIREBASE_API_KEY');
          if (!apiKey) {
            throw new Error('API key is not defined');
          }
          return new FirebaseConfigService(apiKey);
        }
      }
      const firebaseProvider ={
        provide: 'FIREBASE_APP',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          const credentials = configService.get('FIREBASE_ADMIN_CREDENTIALS');
         if (!credentials){
          throw new Error(
            'FIREBASE_ADMIN_CREDENTIALS nao funcionou'
          ) 
         }
         const serviceAccount = JSON.parse(credentials);
         firebaseAdmin.initializeApp({
           credential: firebaseAdmin.credential.cert(serviceAccount),
         });
         return firebaseAdmin
       }
        }
        return {
          module: FirebaseModule,
          providers: [firebaseConfigProvider, firebaseProvider, FirebaseService],
          exports: [firebaseConfigProvider, firebaseProvider, FirebaseService],
        }
      }
}