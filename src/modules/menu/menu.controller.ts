// menu.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './schemas/menu.schema';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenus(): Promise<Menu[]> {
    return this.menuService.getHierarchicalMenu();
  }

  @Post('add')
  async create(@Body() menuData: { key:string; code: string; parentCode: string; name: string; path: string; icon: string; landing: number; showMenu:number }){
    // console.log(menuData)
    return this.menuService.addMenu(menuData);
  }
  // @Post('add')
  // async create(@Body() menuData: {  menuCode: string; parentCode: string; menuName: string; path: string; icon: string;  landing: number; showMenu:number }){
  //   console.log(menuData)
  //   return this.menuService.addMenu(menuData);
  // }
}
 