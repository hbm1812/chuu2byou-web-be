import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from '../users/schemas/users.schemas';
import { AuthGuard } from '@nestjs/passport';
import { GlobalMenu, GlobalMenuDocument } from './schemas/menu.schema';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,@InjectModel(GlobalMenu.name) private readonly menuModel: Model<GlobalMenuDocument>
  ) { }

  async login(username: string, password: string): Promise<{ token: string }> {
    // Tìm người dùng trong cơ sở dữ liệu dựa trên tên đăng nhập
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Username does not exists');
    }

    // Kiểm tra mật khẩu có khớp hay không
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Wrong password');
    }

    // Tạo JWT token
    const payload = { userId: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token };
  }

  // Hàm profile lấy thông tin người dùng
  async profile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password'); // Không trả về trường password

    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    return user;
  }


// Hàm để lấy menu theo cấu trúc phân cấp với tìm kiếm và phân trang
async getHierarchicalGlobalMenu(page: number, size: number, key: string, name: string): Promise<{ data: GlobalMenu[], total: number, totalPage: number }> {
  const skip = page * size;

  // Tạo bộ lọc tìm kiếm
  const filter: any = {};
  if (key) {
      filter.key = { $regex: key, $options: 'i' };
  }
  if (name) {
      filter.name = { $regex: name, $options: 'i' };
  }

  // Tính tổng số bản ghi phù hợp với bộ lọc
  const total = await this.menuModel.countDocuments(filter).exec();

  // Tính tổng số trang
  const totalPage = Math.ceil(total / size);

  // Lấy tất cả dữ liệu (không phân trang) để đảm bảo rằng bạn có thể xây dựng đầy đủ cấu trúc phân cấp
  const allMenus = await this.menuModel.find().sort({ ordinal: 1 }).exec();

  // Tạo cấu trúc phân cấp
  const menuMap = new Map();
  allMenus.forEach(menu => {
      menu.children = [];
      menuMap.set(menu.code, menu);
  });

  const hierarchicalMenu = [];
  allMenus.forEach(menu => {
      if (menu.parentCode) {
          const parent = menuMap.get(menu.parentCode);
          if (parent) {
              parent.children.push(menu);
          }
      } else {
          hierarchicalMenu.push(menu);
      }
  });

  // Sau khi có cấu trúc phân cấp, lấy các phần tử trong phạm vi trang và kích thước
  const paginatedMenu = hierarchicalMenu.slice(skip, skip + size);

  // Trả về kết quả theo định dạng yêu cầu
  return {
      data: paginatedMenu,
      total,
      totalPage,
  };
}



    
async addGlobalMenu(menuData: { key: string; code: string; parentCode: string; name: string; path: string; icon: string; landing: number; showMenu: number; children: GlobalMenu[] }) {
  // Kiểm tra xem mã code đã tồn tại chưa
  const existingMenu = await this.menuModel.findOne({ code: menuData.code }).exec();
  if (existingMenu) {
    throw new Error(`Menu with code "${menuData.code}" already exists.`);
  }

  // Tạo mới menu với dữ liệu đã nhận từ controller
  const newMenu = new this.menuModel({
    key: menuData.key,
    code: menuData.code,
    parentCode: menuData.parentCode,
    name: menuData.name,
    path: menuData.path,
    icon: menuData.icon,
    landing: menuData.landing,
    showMenu: menuData.showMenu,
    children: menuData.children // Thêm dữ liệu children từ menuData
  });

  // Lưu menu mới
  return newMenu.save();
}

  
async updateGlobalMenu(body: { key: string; code: string; parentCode: string; name: string; path: string; icon: string; landing: number; showMenu: number; children: GlobalMenu[] }, _id: string): Promise<GlobalMenu | null> {
  // Kiểm tra xem `newsCode` đã tồn tại chưa, ngoại trừ bản ghi hiện tại
  const existingNews = await this.menuModel.findOne({ code: body.code, _id: { $ne: _id } }).exec();

  if (existingNews) {
      // Nếu tồn tại, ném lỗi
      throw new ConflictException('Code already exists');
  }

  // Cập nhật bản ghi
  const data = await this.menuModel.findByIdAndUpdate(_id, body, { new: true }).exec();
  if (!data) {
      throw new NotFoundException(`No record found with ID: ${_id}`);
  }
  return data;
}
  


  // Hàm tìm kiếm chi tiết theo ID
  async getGlobalMenuById(_id): Promise<GlobalMenu> {
    const data = await this.menuModel.findById(_id).exec();
    if (!data) {
        throw new NotFoundException(`No record found with ID: ${_id}`);
    }
    return data;
}


async deleteGlobalMenu(_id: string): Promise<string> {
  // Tìm và xóa bản ghi
  const data = await this.menuModel.findByIdAndDelete(_id).exec();

  // Kiểm tra kết quả xóa
  if (!data) {
      // Nếu không tìm thấy bản ghi để xóa, ném lỗi
      throw new NotFoundException('News type not found');
  }

  // Nếu xóa thành công, trả về thông báo thành công
  return 'Delete successful!';
}

  // getMenuWeb2() {
  //   const menuWeb2 = [{
  //     "key": "home",
  //     "code": "home",
  //     "name": "Home",
  //     "parentCode": null,
  //     "path": "",
  //     "ordinal": 1,
  //     "icon": "SettingOutlined",
  //     "landing": 0, // bấm nhảy đến vị trị trong trang (1 là ở lại, 0 là nhảy trang)
  //     "showMenu": 1,// show menu (1 là show, 0 là ẩn)
  //     "children": [
  //       {
  //         "key": "news",
  //         "code": "news",
  //         "name": "News",
  //         "parentCode": "home",
  //         "path": "/news",
  //         "ordinal": 1,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //           {
  //             "key": "BTCN",
  //             "code": "BTCN",
  //             "name": "放送時間変更のお知らせ",
  //             "parentCode": "news",
  //             "path": "/news/1",
  //             "ordinal": 1,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": []
  //           },
  //           {
  //             "key": "MI",
  //             "code": "MI",
  //             "name": "メディア情報",
  //             "parentCode": "news",
  //             "path": "/news/2",
  //             "ordinal": 2,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": []
  //           }
  //         ]
  //       },
  //       {
  //         "key": "introduction",
  //         "code": "introduction",
  //         "name": "Introduction",
  //         "parentCode": "home",
  //         "path": "",
  //         "ordinal": 2,
  //         "icon": "OpenAIOutlined",
  //         "landing": 1,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },
  //       {
  //         "key": "story",
  //         "code": "story",
  //         "name": "Story",
  //         "parentCode": "home",
  //         "path": "",
  //         "ordinal": 3,
  //         "icon": "OpenAIOutlined",
  //         "landing": 1,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },
  //       {
  //         "key": "staffCast",
  //         "code": "staffCast",
  //         "name": "Staff - Cast",
  //         "parentCode": "home",
  //         "path": "",
  //         "ordinal": 4,
  //         "icon": "OpenAIOutlined",
  //         "landing": 1,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },
  //       {
  //         "key": "character",
  //         "code": "character",
  //         "name": "Character",
  //         "parentCode": "home",
  //         "path": "",
  //         "ordinal": 5,
  //         "icon": "OpenAIOutlined",
  //         "landing": 1,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },
  //       {
  //         "key": "ticket",
  //         "code": "ticket",
  //         "name": "Ticket",
  //         "parentCode": "home",
  //         "path": "",
  //         "ordinal": 6,
  //         "icon": "OpenAIOutlined",
  //         "landing": 1,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },
  //       {
  //         "key": "goods",
  //         "code": "goods",
  //         "name": "Goods",
  //         "parentCode": "home",
  //         "path": "",
  //         "ordinal": 7,
  //         "icon": "OpenAIOutlined",
  //         "landing": 1,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },
  //       {
  //         "key": "movie",
  //         "code": "movie",
  //         "name": "Movie",
  //         "parentCode": "home",
  //         "path": "",
  //         "ordinal": 8,
  //         "icon": "OpenAIOutlined",
  //         "landing": 1,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },
  //       {
  //         "key": "theater",
  //         "code": "theater",
  //         "name": "Theater",
  //         "parentCode": "home",
  //         "path": "/theater",
  //         "ordinal": 9,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },
  //       {
  //         "key": "bluRayDvd",
  //         "code": "bluRayDvd",
  //         "name": "Blu-ray&DVD",
  //         "parentCode": "home",
  //         "path": "/product/blueRayDvd",
  //         "ordinal": 10,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },
  //       {
  //         "key": "cd",
  //         "code": "cd",
  //         "name": "CD",
  //         "parentCode": "home",
  //         "path": "/product/cd",
  //         "ordinal": 11,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },
  //       {
  //         "key": "gallery",
  //         "code": "gallery",
  //         "name": "Gallery",
  //         "parentCode": "home",
  //         "path": "/gallery",
  //         "ordinal": 12,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 0,
  //         "children": [
  //           {
  //             "key": "keyVisual",
  //             "code": "keyVisual",
  //             "name": "キービジュアル",
  //             "parentCode": "Gallery",
  //             "path": "/gallery/keyVisual",
  //             "ordinal": 12,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
  //           {
  //             "key": "pvSt_1st",
  //             "code": "pvSt_1st",
  //             "name": "PV第1弾場面スチール",
  //             "parentCode": "gallery",
  //             "path": "/gallery/pvSt_1st",
  //             "ordinal": 12,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
  //           {
  //             "key": "movie",
  //             "code": "movie",
  //             "name": "ムービー",
  //             "parentCode": "gallery",
  //             "path": "/gallery/movie",
  //             "ordinal": 12,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
  //         ]
  //       },
      
  //       {
  //         "key": "product",
  //         "code": "product",
  //         "name": "Product",
  //         "parentCode": "home",
  //         "path": "/product",
  //         "ordinal": 13,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //           {
  //             "key": "pkg",
  //             "code": "pkg",
  //             "name": "Blu-ray&DVD",
  //             "parentCode": "product",
  //             "path": "/product/pkg",
  //             "ordinal": 1,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
          
  //         ]
  //       },


  //     ]
  //   },
  //   {
  //     "key": "tv",
  //     "code": "tv",
  //     "name": "TV series",
  //     "parentCode": null,
  //     "path": "/tv",
  //     "ordinal": 1,
  //     "icon": "SettingOutlined",
  //     "landing": 0, // bấm nhảy đến vị trị trong trang (1 là ở lại, 0 là nhảy trang)
  //     "showMenu": 1,// show menu (1 là show, 0 là ẩn)
  //     "children": [
  //       {
  //         "key": "news",
  //         "code": "news",
  //         "name": "News",
  //         "parentCode": "tv",
  //         "path": "/news",
  //         "ordinal": 1,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //           {
  //             "key": "BTCN",
  //             "code": "BTCN",
  //             "name": "放送時間変更のお知らせ",
  //             "parentCode": "news",
  //             "path": "/news/0",
  //             "ordinal": 1,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": []
  //           },
  //           {
  //             "key": "MI",
  //             "code": "MI",
  //             "name": "メディア情報",
  //             "parentCode": "news",
  //             "path": "/news/1",
  //             "ordinal": 2,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": []
  //           }
  //         ]
  //       },
  //       {
  //         "key": "onAir",
  //         "code": "onAir",
  //         "name": "On air",
  //         "parentCode": "tv",
  //         "path": "tv/onair",
  //         "ordinal": 2,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },
  //       {
  //         "key": "staffCast",
  //         "code": "staffCast",
  //         "name": "Staff - Cast",
  //         "parentCode": "tv",
  //         "path": "/tv/staff-cast",
  //         "ordinal": 3,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },
  //       {
  //         "key": "story",
  //         "code": "story",
  //         "name": "Story",
  //         "parentCode": "tv",
  //         "path": "/tv/story",
  //         "ordinal": 4,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //           {
  //             "key": "SCJBOA",
  //             "code": "SCJBOA",
  //             "name": "放送直前スタッフコメント",
  //             "parentCode": "story",
  //             "path": "/tv/story/0",
  //             "ordinal": 1,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
  //           {
  //             "key": "ep1",
  //             "code": "ep1",
  //             "name": "第1話",
  //             "parentCode": "story",
  //             "path": "/tv/story/1",
  //             "ordinal": 2,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
  //         ]
  //       },

  //       {
  //         "key": "character",
  //         "code": "character",
  //         "name": "Character",
  //         "parentCode": "tv",
  //         "path": "/tv/character",
  //         "ordinal": 5,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //           {
  //             "key": "yuta",
  //             "code": "yuta",
  //             "name": "富樫勇太",
  //             "parentCode": "character",
  //             "path": "/tv/character/yuta",
  //             "ordinal": 1,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
  //           {
  //             "key": "rikka",
  //             "code": "rikka",
  //             "name": "小鳥遊六花",
  //             "parentCode": "character",
  //             "path": "/tv/character/rikka",
  //             "ordinal": 2,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
  //         ]
  //       },
  //       {
  //         "key": "gallery",
  //         "code": "gallery",
  //         "name": "Gallery",
  //         "parentCode": "tv",
  //         "path": "/tv/gallery",
  //         "ordinal": 12,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //           {
  //             "key": "keyVisual",
  //             "code": "keyVisual",
  //             "name": "キービジュアル",
  //             "parentCode": "Gallery",
  //             "path": "/tv/gallery/keyVisual",
  //             "ordinal": 1,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
  //           {
  //             "key": "pvSt_1st",
  //             "code": "pvSt_1st",
  //             "name": "PV第1弾場面スチール",
  //             "parentCode": "gallery",
  //             "path": "/tv/gallery/pvSt_1st",
  //             "ordinal": 2,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
  //           {
  //             "key": "movie",
  //             "code": "movie",
  //             "name": "ムービー",
  //             "parentCode": "gallery",
  //             "path": "/tv/gallery/movie",
  //             "ordinal": 3,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
  //         ]
  //       },
  //       {
  //         "key": "special",
  //         "code": "special",
  //         "name": "Special",
  //         "parentCode": "/tv",
  //         "path": "/tv/special",
  //         "ordinal": 13,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //           {
  //             "key": "staff_comment",
  //             "code": "staff_comment",
  //             "name": "メインスタッフコメント",
  //             "parentCode": "special",
  //             "path": "/tv/special/staff_comment",
  //             "ordinal": 1,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
          
  //         ]
  //       },
  //       {
  //         "key": "product",
  //         "code": "product",
  //         "name": "Product",
  //         "parentCode": "tv",
  //         "path": "/product",
  //         "ordinal": 14,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //           {
  //             "key": "pkg",
  //             "code": "pkg",
  //             "name": "Blu-ray&DVD",
  //             "parentCode": "product",
  //             "path": "/product/pkg",
  //             "ordinal": 1,
  //             "icon": "OpenAIOutlined",
  //             "landing": 0,
  //             "showMenu": 1,
  //             "children": [
  //             ]
  //           },
          
  //         ]
  //       },
  //       {
  //         "key": "diary",
  //         "code": "diary",
  //         "name": "Diary",
  //         "parentCode": "tv",
  //         "path": "/diary",
  //         "ordinal": 15,
  //         "icon": "OpenAIOutlined",
  //         "landing": 0,
  //         "showMenu": 1,
  //         "children": [
  //         ]
  //       },

  //     ]
  //   }

  //   ]
  //   return menuWeb2;
  // }

  //menu admin
  getMenu() {
    const menu = [
      {
        "key": "SM",
        "code": "SM",
        "name": "System management",
        "parentCode": null,
        "path": "/system-management",
        "ordinal": 1,
        "icon": "SettingOutlined",
        "children": [
          {
            "key": "RM",
            "code": "RM",
            "name": "Role management",
            "parentCode": "SM",
            "path": "/system-management/role-management",
            "ordinal": 1,
            "icon": "OpenAIOutlined",
            "children": [],
          },
          {
            "key": "UM",
            "code": "UM",
            "name": "User management",
            "parentCode": "SM",
            "path": "/system-management/user-management",
            "ordinal": 2,
            "icon": "SlackOutlined",
            "children": []
          }
        ]
      },
      {
        "key": "CM",
        "code": "CM",
        "name": "Category management",
        "parentCode": null,
        "path": "/category-management",
        "ordinal": 2,
        "icon": "UnorderedListOutlined",
        "children": [
          {
            "key": "News",
            "code": "News",
            "name": "News",
            "parentCode": "CM",
            "path": "/category-management/news",
            "ordinal": 1,
            "icon": "EditOutlined",
            "children": []
          },
          {
            "key": "NT",
            "code": "NT",
            "name": "News type",
            "parentCode": "CM",
            "path": "/category-management/news-type",
            "ordinal": 2,
            "icon": "ShoppingCartOutlined",
            "children": []
          },
          {
            "key": "TvB",
            "code": "TvB",
            "name": "Tv broadcast",
            "parentCode": "CM",
            "path": "/category-management/tv-broadcast",
            "ordinal": 3,
            "icon": "ProfileOutlined",
            "children": []
          },

        ]
      },
      {
        "key": "PSCM",
        "code": "PSCM",
        "name": "Project staff-cast management",
        "parentCode": null,
        "path": "/project-staff-cast-management",
        "ordinal": 3,
        "icon": "SettingOutlined",
        "children": [
          {
            "key": "StM",
            "code": "StM",
            "name": "Staff management",
            "parentCode": "PSCM",
            "path": "/project-staff-management/staff-management",
            "ordinal": 1,
            "icon": "OpenAIOutlined",
            "children": []
          },
          {
            "key": "WM",
            "code": "WM",
            "name": "Works management",
            "parentCode": "PSCM",
            "path": "/project-staff-management/works-management",
            "ordinal": 2,
            "icon": "SlackOutlined",
            "children": []
          }
        ]
      },
      {
        "key": "MM",
        "code": "MM",
        "name": "Menu management",
        "parentCode": null,
        "path": "/menu-management",
        "ordinal": 4,
        "icon": "SettingOutlined",
        "children": [
          {
            "key": "GM",
            "code": "GM",
            "name": "Global Menu",
            "parentCode": "MM",
            "path": "/menu-management/global-menu",
            "ordinal": 1,
            "icon": "OpenAIOutlined",
            "children": []
          },
          {
            "key": "SupM",
            "code": "SupM",
            "name": "Sup Menu",
            "parentCode":"MM",
            "path": "/menu-management/sup-menu",
            "ordinal": 2,
            "icon": "OpenAIOutlined",
            "children": []
          },

        ]
      },

    ];
    return menu;
  }

  


}
