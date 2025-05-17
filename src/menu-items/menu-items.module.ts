import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';

@Module({
  providers: [MenuItemsService]
})
export class MenuItemsModule {}
