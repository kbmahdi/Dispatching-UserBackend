import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getProtected(): string {
    return 'This is a protected route';
  }
}
