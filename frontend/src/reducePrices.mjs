import fs from 'fs/promises';

async function update() {
    const filePath = './data/mockProducts.js';
    let content = await fs.readFile(filePath, 'utf-8');

    content = content.replace(/price:\s*([\d.]+)/g, (match, p1) => {
        let p = parseFloat(p1);
        // Divide by 3.5 to make prices lower and more affordable
        let newP = Math.round((p / 3.5) / 100) * 100;
        // ensure at least 150
        if (newP === 0) newP = 150;
        return `price: ${newP}`;
    });

    content = content.replace(/oldPrice:\s*([\d.]+)/g, (match, p1) => {
        let p = parseFloat(p1);
        let newP = Math.round((p / 3.5) / 100) * 100;
        if (newP === 0) newP = 200;
        return `oldPrice: ${newP}`;
    });

    await fs.writeFile(filePath, content, 'utf-8');
    console.log('Prices reduced and rounded to nearest 100 PKR');
}
update();
