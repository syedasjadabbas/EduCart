import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

function findFiles(dir, filter, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findFiles(filePath, filter, fileList);
        } else if (filter(filePath)) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const jsxFiles = findFiles(srcDir, f => f.endsWith('.jsx'));

let modifiedCount = 0;

jsxFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let originalContent = content;
    
    // First, determine the relative path to imageHelper.js
    let relativePathToUtils = path.relative(path.dirname(file), path.join(srcDir, 'utils')).replace(/\\/g, '/');
    if (!relativePathToUtils.startsWith('.')) {
        relativePathToUtils = './' + relativePathToUtils;
    }
    const importStatement = `import { getImageUrl } from '${relativePathToUtils}/imageHelper';\n`;

    // Make the replacements
    content = content.replace(/src=\{currentPic\}/g, "src={currentPic ? getImageUrl(currentPic) : ''}");
    content = content.replace(/src=\{item\.image\}/g, "src={getImageUrl(item.image)}");
    content = content.replace(/src=\{product\.image\}/g, "src={getImageUrl(product.image)}");
    content = content.replace(/src=\{p\.image\}/g, "src={getImageUrl(p.image)}");
    content = content.replace(/src=\{user\.profilePicture\}/g, "src={getImageUrl(user.profilePicture)}");
    content = content.replace(/src=\{u\.profilePicture\}/g, "src={getImageUrl(u.profilePicture)}");
    content = content.replace(/src=\{t\.avatar\}/g, "src={getImageUrl(t.avatar)}"); 
    content = content.replace(/src=\{order\.orderItems\[0\]\.image\}/g, "src={getImageUrl(order.orderItems[0].image)}");
    content = content.replace(/src=\{selectedOrder\.transactionScreenshot\}/g, "src={getImageUrl(selectedOrder.transactionScreenshot)}");
    content = content.replace(/src=\{order\.transactionScreenshot\}/g, "src={getImageUrl(order.transactionScreenshot)}");
    content = content.replace(/src=\{selectedStudent\.studentIdCard\}/g, "src={getImageUrl(selectedStudent.studentIdCard)}");
    content = content.replace(/href=\{selectedStudent\.studentIdCard\}/g, "href={getImageUrl(selectedStudent.studentIdCard)}");
    
    // CartDrawer.jsx line 72: src={item.image} covered above.

    if (content !== originalContent) {
        if (!content.includes('getImageUrl')) {
            // How could it not if it replaced something?
        } else if (!content.includes('imageHelper')) {
            const importMatches = content.match(/import .+/g);
            if (importMatches && importMatches.length > 0) {
                const lastImport = importMatches[importMatches.length - 1];
                content = content.replace(lastImport, lastImport + '\n' + importStatement);
            } else {
                content = importStatement + content;
            }
        }
        
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated: ${file}`);
        modifiedCount++;
    }
});

console.log(`Modified ${modifiedCount} files.`);
