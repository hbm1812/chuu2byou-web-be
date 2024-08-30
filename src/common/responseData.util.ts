import { Response } from "express";


export const responseData = (
  res: Response,
  data: any,
  statusCode: number,
  message: string,
) => {
  res.status(statusCode).json({
    status: statusCode === 200 || statusCode === 201 ? true : false,
    message:
      statusCode === 200 || statusCode === 201 ? message : 'Đã có lỗi xảy ra',
    data: data,
  });
};
