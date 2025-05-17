import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { UserModule } from './modules/user/user.module';
import { AddressModule } from './modules/address/address.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { RatingModule } from './modules/rating/rating.module';
import { OrderModule } from './modules/order/order.module';
import { MenuItemsModule } from './modules/menu-items/menu-items.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FirebaseModule,
    UserModule,
    RestaurantsModule,
    AddressModule,
    RatingModule,
    OrderModule,
    MenuItemsModule,
  ],
})
export class AppModule {}