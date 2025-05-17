import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RatingModule } from './rating/rating.module';
import { OrderModule } from './order/order.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [UserModule, RestaurantsModule, RatingModule, OrderModule, MenuItemsModule, AddressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
