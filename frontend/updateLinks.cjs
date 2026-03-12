const fs = require('fs');

const updateLinks = (file, findStr, replaceRegex, replacementStr) => {
    let content = fs.readFileSync(file, 'utf-8');
    if (content.includes(findStr)) {
        content = content.replace(replaceRegex, replacementStr);
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated ${file}`);
    }
}

updateLinks(
    'src/pages/Cart.jsx',
    '`/product/${item._id}`',
    /to={`\/product\/\$\{item\._id\}`}/g,
    'to={`/product/${item.slug || item._id}`}'
);

updateLinks(
    'src/pages/OrderDetail.jsx',
    '`/product/${item.product}`',
    /to={`\/product\/\$\{item\.product\}`}/g,
    'to={`/product/${item.slug || item.product}`}'
);

updateLinks(
    'src/pages/Profile.jsx',
    '`/product/${review.productId?._id || review.productId}`',
    /to={`\/product\/\$\{review\.productId\?\._id \|\| review\.productId\}`}/g,
    'to={`/product/${review.productId?.slug || review.productId?._id || review.productId}`}'
);

console.log('Finished updating frontend Links');
