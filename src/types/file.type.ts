export interface IFileCloud {
  url: string;
  publicId: string;
}

export interface IUploadFile {
  folder: string;
  userId: string;
  sessionToken: string;
  endpoint?: string;
}

export interface IUploadFileAPI extends IUploadFile {
  file: File;
}

export interface IUploadFilesAPI extends IUploadFile {
  files: File[];
}

export interface IMultipleUploadResponse {
  uploadedFiles: IFileCloud[];
}