import multer from 'multer';
import path from 'path';

const storageGuard = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../../public/image/product'));
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    }
});

const filter = (req, file, cb) => {
    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de archivo no permitido'), false);
    }
};

export const upload = multer({ storage: storageGuard, fileFilter: filter });
