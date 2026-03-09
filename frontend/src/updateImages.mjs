import fs from 'fs/promises';

async function updateImages() {
    const filePath = './data/mockProducts.js';
    const content = await fs.readFile(filePath, 'utf-8');

    console.log("Starting image update...");
    let finalContent = content;
    const regex = /name:\s*'([^']+)',[\s\S]*?image:\s*'([^']+)'/g;

    let match;
    while ((match = regex.exec(content)) !== null) {
        const name = match[1];
        const image = match[2];

        if (image.includes('placehold.co')) {
            // Modify query slightly to find better matches
            // Strip some words like "bundle", "pack", "assorted" that confuse unsplash
            let query = name.replace(/\([^\)]+\)/g, '').replace('Assorted', '').replace('Bundle', '').replace('Mini', '').trim();
            console.log(`Searching for: ${query}`);

            try {
                const response = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=3`);
                const json = await response.json();

                if (json.results && json.results.length > 0) {
                    // get the first valid image
                    let newUrl = json.results[0].urls.regular;

                    console.log(`Found for ${name}: ${newUrl}`);

                    finalContent = finalContent.replace(
                        `image: '${image}'`,
                        `image: '${newUrl}'`
                    );
                } else {
                    console.log(`No results for ${name}`);
                }
            } catch (err) {
                console.error(`Error with ${name}:`, err);
            }
            // slight delay to avoid rate limits
            await new Promise(r => setTimeout(r, 500));
        }
    }

    await fs.writeFile(filePath, finalContent, 'utf-8');
    console.log('Update complete!');
}

updateImages();
