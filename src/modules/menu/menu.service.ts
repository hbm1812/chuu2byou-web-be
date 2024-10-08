import { Model } from "mongoose";
import { Menu, MenuDocument } from "./schema/menu.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class MenuService {
  constructor(
 @InjectModel(Menu.name) private readonly menuModel: Model<MenuDocument>
  ) { }

// Hàm để lấy menu theo cấu trúc phân cấp với tìm kiếm và phân trang
async getHierarchicalMenu(page: number, size: number, key: string, name: string): Promise<{ data: Menu[], total: number, totalPage: number }> {
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
  
  async addMenu(menuData: { key: string; code: string; parentCode: string; name: string; path: string; icon: string; landing: number; showMenu: number; menuTypeCode:string; menuLevel:number;  children: Menu[] }) {
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
      menuTypeCode:menuData.menuTypeCode,
      menuLevel: menuData.menuLevel,
      children: menuData.children // Thêm dữ liệu children từ menuData
    });
  
    // Lưu menu mới
    return newMenu.save();
  }


  // Hàm tìm kiếm chi tiết theo ID
  async getMenuById(_id): Promise<Menu> {
    const data = await this.menuModel.findById(_id).exec();
    if (!data) {
        throw new NotFoundException(`No record found with ID: ${_id}`);
    }
    return data;
}

  async updateMenu(body: { key: string; code: string; parentCode: string; name: string; path: string; icon: string; landing: number; showMenu: number; menuTypeCode:string; menuLevel:number;  children: Menu[] }, _id: string): Promise<Menu | null> {
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


  async deleteMenu(_id: string): Promise<string> {
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

}