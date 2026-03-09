import fs from 'fs/promises';

async function update() {
    const filePath = './data/mockProducts.js';
    let content = await fs.readFile(filePath, 'utf-8');

    content = content.replace(/price:\s*([\d.]+)/g, (match, p1) => {
        let p = parseFloat(p1);
        // If it's already above 1000, maybe it's already converted? We assume it's USD currently. Max USD was like 199.99
        if (p > 1000) return match; // already converted maybe?
        let newP = Math.round((p * 280) / 10) * 10 - 3; // e.g., 5600 -> 5597 (looks good)
        return `price: ${Math.max(1, newP)}`;
    });

    content = content.replace(/oldPrice:\s*([\d.]+)/g, (match, p1) => {
        let p = parseFloat(p1);
        if (p > 1000) return match;
        let newP = Math.round((p * 280) / 10) * 10 - 3;
        return `oldPrice: ${Math.max(1, newP)}`;
    });

    await fs.writeFile(filePath, content, 'utf-8');
    console.log('Prices updated to PKR');
}
update();
