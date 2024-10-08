import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from '../users/schemas/users.schemas';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
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
            "key": "Menu",
            "code": "Menu",
            "name": "Menu",
            "parentCode": "MM",
            "path": "/menu-management/menu",
            "ordinal": 1,
            "icon": "OpenAIOutlined",
            "children": []
          },
          {
            "key": "MT",
            "code": "MT",
            "name": "MenuType",
            "parentCode":"MM",
            "path": "/menu-management/menu-type",
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
