const multer = require("multer");
const jimp = require("jimp");
const uuid = require('uuid').v4;
const path = require('path');
const fse = require('fs-extra');


class ImageService {
    static initUploadStorageMiddleware (name) {
        const multerStorage = multer.memoryStorage();

        const multerFilter = (req, file, cbk) => {
            if (file.mimetype.startsWith('image/')) {
              cbk(null, true);
            } else {
              cbk(new Error(400, "Please upload only images!"), false);
            }
          };
      
        return multer({
            storage: multerStorage,
            fileFilter: multerFilter,
          }).single('avatar');  
      
    }

    static async saveImage(file, options, ...pathSegments) {
        if (file.size > (options?.maxFileSize ? options.maxFileSize * 1024 * 1024 : 1 * 1024 * 1024)) {
          throw new Error(400, 'File is too large!');
        }
    
        const fileName = `${uuid()}.jpeg`;
        const fullFilePath = path.join(process.cwd(), 'public', ...pathSegments);
    
        await fse.ensureDir(fullFilePath);
        const avatar = await jimp.read(file.buffer);
        await avatar
            .cover(options.width || 500, options.height || 500)
            .quality(90)
            .writeAsync(path.join(fullFilePath, fileName));

    
        return path.join(...pathSegments, fileName);
      }
    
    
}

module.exports = ImageService;