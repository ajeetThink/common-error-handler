import { NextFunction, Request, Response } from "express";
import { logger } from "./logger";
import { HttpError } from "./httpError";

type HttpSuccessResponse = {
  code: number;
  message?: string;
  data?: any;
};

type HttpErrorResponse = {
  code: number;
  message?: string;
};

/**
 * Function  Response error
 * @param error error object
 * @param req Express request
 * @param res Express response
 */
export function errorResponse(
  error: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const apiError: HttpErrorResponse = {
    code: 500,
    message: req.__("INTERNAL_SERVER_ERROR"),
  };
  if (error instanceof HttpError) {
    apiError.code = error.statusCode;
    apiError.message = req.__(error.message, error.field!);
  } else {
    logger.error(`[${new Date().toISOString()}]`, error);
  }
  res.status(apiError.code).send(apiError);
  next();
}

export function successResponse(
  _req: Request,
  res: Response,
  statusCode: number,
  message: string,
  data?: any
): void {
  const response: HttpSuccessResponse = {
    code: statusCode,
    message: message,
  };

  if (data) {
    response.data = data;
  }

  res.status(statusCode).json(response);
  return;
}

export const formatError = (
  statusCode: number,
  tag: string,
  field?: { [key: string]: any },
  description?: string
) => {
  const error = new HttpError({
    statusCode,
    message: {
      tag,
      field,
    },
    description,
  });
  return error;
};
