import fs from 'fs/promises';

async function updateHighlighter() {
    const filePath = './data/mockProducts.js';
    const content = await fs.readFile(filePath, 'utf-8');

    let finalContent = content;

    try {
        const response = await fetch(`https://unsplash.com/napi/search/photos?query=highlighter%20pens&per_page=1`);
        const json = await response.json();

        if (json.results && json.results.length > 0) {
            let newUrl = json.results[0].urls.regular;

            console.log(`Found for highlighter: ${newUrl}`);

            finalContent = finalContent.replace(
                `image: 'https://images.unsplash.com/photo-1580541624688-6415f9e8adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'`,
                `image: '${newUrl}'`
            );
        }
    } catch (err) {
        console.error(`Error with highlighter:`, err);
    }

    await fs.writeFile(filePath, finalContent, 'utf-8');
    console.log('Update complete!');
}

updateHighlighter();
