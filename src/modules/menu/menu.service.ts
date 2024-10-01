// menu.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Menu, MenuDocument } from './schemas/menu.schema';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private readonly menuModel: Model<MenuDocument>) { }

  // Hàm để lấy menu theo cấu trúc phân cấp
  async getHierarchicalMenu(): Promise<Menu[]> {
    const menus = await this.menuModel.find().sort({ ordinal: 1 }).exec();

    // Tạo cấu trúc phân cấp
    const menuMap = new Map();
    menus.forEach(menu => {
      menu.children = [];
      menuMap.set(menu.code, menu);
    });

    const hierarchicalMenu = [];
    menus.forEach(menu => {
      if (menu.parentCode) {
        const parent = menuMap.get(menu.parentCode);
        if (parent) {
          parent.children.push(menu);
        }
      } else {
        hierarchicalMenu.push(menu);
      }
    });

    return hierarchicalMenu;
  }


  async addMenu(menuData: { key:string; code: string; parentCode: string; name: string; path: string; icon: string; landing: number; showMenu: number; }) {

    // Kiểm tra xem mã code đã tồn tại chưa
    const existingMenu = await this.menuModel.findOne({ code: menuData.code }).exec();
    if (existingMenu) {
      throw new Error(`Menu with code "${menuData.code}" already exists.`);
    }

    // Dữ liệu mặc định cho các children khi thêm mới
    const defaultChildrenData = [
      {
        key: "news",
        code: "news",
        name: "News",
        parentCode: menuData.code,
        path: `/news`,
        icon: "OpenAIOutlined",
        landing: 0,
        showMenu: 1,
        children: []
      },
      {
        key: "onAir",
        code: "onAir",
        name: "On air",
        parentCode: menuData.code,
        path: `${menuData.path}/onair`,
        icon: "OpenAIOutlined",
        landing: 0,
        showMenu: 1,
        children: [
          {
            code: "tvBr",
            name: "TV放送",
            parentCode: "onAir",
            path: ``,
            icon: "",
            landing: 1,
            showMenu: 0,
            children: []
          },
          {
            code: "OnDi",
            name: "ネット配信",
            parentCode: "onAir",
            path: ``,
            icon: "",
            landing: 1,
            showMenu: 0,
            children: []
          },
        ]
      },
      {
        "key": "staffCast",
        "code": "staffCast",
        "name": "Staff - Cast",
        "parentCode": menuData.code,
        "path": `${menuData.path}/staff-cast`,
        "icon": "OpenAIOutlined",
        "landing": 0,
        "showMenu": 1,
        "children": [
        ]
      },
      {
        "key": "story",
        "code": "story",
        "name": "Story",
        "parentCode": menuData.code,
        "path": `${menuData.path}/story`,
        "icon": "OpenAIOutlined",
        "landing": 0,
        "showMenu": 1,
        "children": []
      },

    ];

    // Tạo mới menu với dữ liệu đã nhận từ controller
    const newMenu = {
      key: menuData.key,
      code: menuData.code,
      parentCode: menuData.parentCode,
      name: menuData.name,
      path: menuData.path,
      icon: menuData.icon,
      landing: menuData.landing,
      showMenu: menuData.showMenu,
      children: defaultChildrenData // Thêm children vào menu
    };

    // Tạo mới menu
    const createdMenu = new this.menuModel(newMenu);
    return createdMenu.save();
  }


}
