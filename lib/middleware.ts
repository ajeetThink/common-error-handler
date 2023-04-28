import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import validator from "is-my-json-valid";
import { HttpError } from "./httpError";

export const validatorHandler = (input: any) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const paramsData: any = { ...req.query, ...req.params };
    for (const key in paramsData) {
      const schemaInput = input.properties[key];

      if (schemaInput?.type === "number" && !isNaN(Number(paramsData[key]))) {
        paramsData[key] = Number(paramsData[key]);
      }
    }

    const data = _.assign(req.body, paramsData);
    const validate = validator(input, { greedy: true });
    const isValid = validate(data);
    if (!isValid) {
      const error = new HttpError({
        statusCode: 400,
        message: {
          tag: "NOT_VALID",
          field: {
            field: validate.errors
              .reverse()
              .map((item) => item.field.split(".")[1] + " " + item.message),
          },
        },
      });
      next(error);
    } else {
      next();
    }
  };
};
