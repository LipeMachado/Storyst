import { Request, Response, NextFunction } from 'express';
import { Decimal } from '@prisma/client/runtime/library';

function decimalSerializer(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json;
  
  res.json = function(body) {
    const convertDecimal = (obj: any): any => {
      if (obj === null || obj === undefined) return obj;
      
      if (obj instanceof Decimal) {
        return obj.toNumber();
      }
      
      if (Array.isArray(obj)) {
        return obj.map(convertDecimal);
      }
      
      if (typeof obj === 'object') {
        const result: any = {};
        for (const key in obj) {
          result[key] = convertDecimal(obj[key]);
        }
        return result;
      }
      
      return obj;
    };
    
    return originalJson.call(this, convertDecimal(body));
  };
  
  next();
}

export default decimalSerializer;