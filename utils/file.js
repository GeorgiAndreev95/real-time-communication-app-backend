import fs from "fs";
import path from "path";

const deleteFile = (filePath) => {
    const absolutePath = path.join(process.cwd(), filePath);

    fs.unlink(absolutePath, (err) => {
        if (err) {
            console.error("Failed to delete file:", absolutePath);
            console.error(err);
        }
    });
};

export default deleteFile;
