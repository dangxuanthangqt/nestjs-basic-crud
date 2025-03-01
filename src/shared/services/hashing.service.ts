import { Injectable } from "@nestjs/common";
import { compareSync, hashSync } from "bcrypt";

const saltRounds = 10;

@Injectable()
export class HashingService {
  hash(value: string): string {
    const hash = hashSync(value, saltRounds);

    return hash;
  }

  compare(value: string, hash: string): boolean {
    const result = compareSync(value, hash);

    return result;
  }
}
