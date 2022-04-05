import { ExpressRequest, ExpressResponse } from "@/types/express";
import { NextFunction } from "express";
import { UNAUTHORIZED_STATUS_CODE } from "@/constants/response";
import { getErrorResponse } from "@/utils/response";
import { auth } from "firebase-admin";
import { AUTHORIZATION_HEADER_KEY } from "@/constants/request";

export const authMiddleware = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const accessToken = req.headers[AUTHORIZATION_HEADER_KEY]?.split(" ")[1];

  if (!accessToken) {
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .json(getErrorResponse(UNAUTHORIZED_STATUS_CODE));
  }

  try {
    await auth().verifyIdToken(accessToken);
  } catch (err) {
    console.log(err);
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .json(getErrorResponse(UNAUTHORIZED_STATUS_CODE));
  }

  return next();
};
