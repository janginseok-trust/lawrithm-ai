declare module "formidable" {
  import { IncomingMessage } from "http";

  export class IncomingForm {
    parse(
      req: IncomingMessage,
      callback: (err: any, fields: Fields, files: Files) => void
    ): void;
  }

  export interface Fields {
    [key: string]: string | string[];
  }

  export interface File {
    filepath: string;
    originalFilename?: string;
    mimetype?: string;
    size?: number;
  }

  export interface Files {
    [key: string]: File | File[];
  }
}
