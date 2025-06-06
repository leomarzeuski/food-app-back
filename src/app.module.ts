import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { UserModule } from './modules/user/user.module';
import { AddressModule } from './modules/address/address.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { RatingModule } from './modules/rating/rating.module';
import { OrderModule } from './modules/order/order.module';
import { MenuItemsModule } from './modules/menu-items/menu-items.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    UserModule,
    RestaurantsModule,
    AddressModule,
    RatingModule,
    OrderModule,
    MenuItemsModule,
    AuthModule,
  ],
})
export class AppModule {}