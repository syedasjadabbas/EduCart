export const mockProducts = [
    {
        _id: '1',
        name: 'Ergonomic Desk Chair',
        description: 'Comfortable chair for long study sessions. Features adjustable lumbar support, breathable mesh back, and 3D armrests.',
        image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 10400,
        oldPrice: 12800,
        discount: 15,
        stock: 15,
        category: 'desk'
    },
    {
        _id: '2',
        name: 'Minimalist Study Desk',
        description: 'Clean workspace to keep you focused. Made from sustainable engineered wood.',
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 7200,
        stock: 8,
        category: 'desk'
    },
    {
        _id: '3',
        name: 'Noise Cancelling Headphones',
        description: 'Block out dorm noise and focus. Active noise cancellation, 40-hour battery life.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 16000,
        oldPrice: 20000,
        discount: 20,
        stock: 25,
        category: 'gadgets'
    },
    {
        _id: '4',
        name: 'Premium Gel Pens Set',
        description: 'Smooth writing for all your notes. 12 vibrant colors.',
        image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 1200,
        stock: 100,
        category: 'stationery'
    },
    {
        _id: '5',
        name: 'College Backpack with USB Port',
        description: 'Durable, water-resistant backpack designed for students. Fits 15.6 inch laptops.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 4000,
        oldPrice: 5300,
        discount: 25,
        stock: 50,
        category: 'backpacks'
    },
    {
        _id: '6',
        name: 'Stainless Steel Water Bottle',
        description: 'Keeps water cold for 24 hours. Eco-friendly and essential for campus.',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 2000,
        stock: 60,
        category: 'bottles'
    },
    {
        _id: '7',
        name: 'Adjustable Laptop Stand',
        description: 'Ergonomic aluminum stand for eye-level viewing. Foldable and portable.',
        image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        price: 2800,
        stock: 45,
        category: 'laptop'
    },
    {
        _id: '8',
        name: 'Highlighter Pack (Assorted)',
        description: 'Essential for study notes. Doesn\'t bleed through most paper types.',
        image: 'https://plus.unsplash.com/premium_photo-1723744984304-d18199626602?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8aGlnaGxpZ2h0ZXIlMjBwZW5zfGVufDB8fHx8MTc3Mjg1MDgxNnww&ixlib=rb-4.1.0&q=80&w=1080',
        price: 800,
        stock: 200,
        category: 'stationery'
    },
    {
        _id: '9',
        name: 'Scientific Calculator',
        description: 'Perfect for engineering and math students. High resolution display.',
        image: 'https://plus.unsplash.com/premium_photo-1723802573606-f3828a8975c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U2NpZW50aWZpYyUyMENhbGN1bGF0b3J8ZW58MHx8fHwxNzcyODUwMzY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 1300,
        stock: 120,
        category: 'gadgets'
    },
    {
        _id: '10',
        name: 'Spiral Notebooks (5-Pack)',
        description: 'College-ruled, 100 pages per notebook with perforated edges.',
        image: 'https://plus.unsplash.com/premium_photo-1725294296561-4eb05ff3b084?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U3BpcmFsJTIwTm90ZWJvb2tzfGVufDB8fHx8MTc3Mjg1MDM2OHww&ixlib=rb-4.1.0&q=80&w=1080',
        price: 1000,
        stock: 150,
        category: 'stationery'
    },
    {
        _id: '11',
        name: 'Sticky Notes Bundle',
        description: '6 colorful pads for easy organization and reminders.',
        image: 'https://plus.unsplash.com/premium_photo-1661299211012-6ed53037ed31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U3RpY2t5JTIwTm90ZXN8ZW58MHx8fHwxNzcyODUwMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 600,
        stock: 300,
        category: 'stationery'
    },
    {
        _id: '12',
        name: 'Mechanical Pencils 0.5mm',
        description: 'Set of 4 strong mechanical pencils. Includes extra lead.',
        image: 'https://plus.unsplash.com/premium_photo-1769017352044-032c7f394601?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8TWVjaGFuaWNhbCUyMFBlbmNpbHMlMjAwLjVtbXxlbnwwfHx8fDE3NzI4NTAzNzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 700,
        stock: 180,
        category: 'stationery'
    },
    {
        _id: '13',
        name: 'LED Desk Lamp',
        description: 'Eye-caring light with adjustable brightness and USB charging port.',
        image: 'https://plus.unsplash.com/premium_photo-1681470951009-8642b690258b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8TEVEJTIwRGVzayUyMExhbXB8ZW58MHx8fHwxNzcyODUwMzcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 1800,
        stock: 45,
        category: 'desk'
    },
    {
        _id: '14',
        name: 'Index Cards (500 Pack)',
        description: 'Standard 3x5 size, perfect for creating flashcards.',
        image: 'https://plus.unsplash.com/premium_photo-1719584882099-3169ef1babe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8SW5kZXglMjBDYXJkc3xlbnwwfHx8fDE3NzI4NTAzNzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 500,
        stock: 400,
        category: 'stationery'
    },
    {
        _id: '15',
        name: 'Correction Tape (3-Pack)',
        description: 'Quick and easy fixes for pen mistakes without drying time.',
        image: 'https://plus.unsplash.com/premium_photo-1760631695679-3a3e1c84f781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Q29ycmVjdGlvbiUyMFRhcGV8ZW58MHx8fHwxNzcyODUwMzc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 400,
        stock: 100,
        category: 'stationery'
    },
    {
        _id: '16',
        name: 'Eraser Pack (5-Piece)',
        description: 'Smudge-free erasing for all paper types. Latex-free and perfect for exams.',
        image: 'https://plus.unsplash.com/premium_photo-1736646021025-c8d66de20888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RXJhc2VyJTIwUGFja3xlbnwwfHx8fDE3NzI4NTAzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 300,
        stock: 250,
        category: 'stationery'
    },
    {
        _id: '17',
        name: 'Clear Plastic Ruler Set',
        description: 'Includes 12-inch and 6-inch rulers. Shatter-resistant plastic.',
        image: 'https://plus.unsplash.com/premium_photo-1661266890061-ef7caab08054?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Q2xlYXIlMjBQbGFzdGljJTIwUnVsZXIlMjBTZXR8ZW58MHx8fHwxNzcyODUwMzc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 200,
        stock: 300,
        category: 'stationery'
    },
    {
        _id: '18',
        name: 'Ring Binder (1 inch)',
        description: 'Durable 3-ring binder for organizing class notes. Holds up to 200 sheets.',
        image: 'https://plus.unsplash.com/premium_photo-1658527142437-f68d188abc46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UmluZyUyMEJpbmRlcnxlbnwwfHx8fDE3NzI4NTAzNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 400,
        stock: 150,
        category: 'stationery'
    },
    {
        _id: '19',
        name: 'Mini Stapler with Staples',
        description: 'Compact size fits perfectly in your pencil case. Comes with 1000 staples.',
        image: 'https://plus.unsplash.com/premium_photo-1668013523805-4fd97f63f309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8U3RhcGxlciUyMHdpdGglMjBTdGFwbGVzfGVufDB8fHx8MTc3Mjg1MDM4MHww&ixlib=rb-4.1.0&q=80&w=1080',
        price: 600,
        stock: 80,
        category: 'stationery'
    },
    {
        _id: '20',
        name: 'USB Flash Drive (32GB)',
        description: 'Keep your assignments backed up. High-speed USB 3.0 file transfer.',
        image: 'https://plus.unsplash.com/premium_photo-1726837308560-cb371e1cbb16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8VVNCJTIwRmxhc2glMjBEcml2ZXxlbnwwfHx8fDE3NzI4NTAzODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 1000,
        stock: 200,
        category: 'gadgets'
    },
    {
        _id: '21',
        name: 'Desk Organizer Cup',
        description: 'Keep all your pens and highlighters neat and organized.',
        image: 'https://plus.unsplash.com/premium_photo-1731966823623-84aa3e64eae6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8RGVzayUyME9yZ2FuaXplciUyMEN1cHxlbnwwfHx8fDE3NzI4NTAzODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 700,
        stock: 95,
        category: 'desk'
    },
    {
        _id: '22',
        name: 'Laptop Sleeve 13-inch',
        description: 'Water-resistant protection for your laptop on the go.',
        image: 'https://plus.unsplash.com/premium_photo-1661679012183-1a09fb88942f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8TGFwdG9wJTIwU2xlZXZlJTIwMTMtaW5jaHxlbnwwfHx8fDE3NzI4NTAzODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 1400,
        stock: 60,
        category: 'laptop'
    },
    {
        _id: '23',
        name: 'Paper Clips Box (500 Count)',
        description: 'Standard size zebra paper clips perfect for organizing loose sheets.',
        image: 'https://plus.unsplash.com/premium_photo-1683309558115-9cefc7073417?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UGFwZXIlMjBDbGlwcyUyMEJveHxlbnwwfHx8fDE3NzI4NTAzODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 300,
        stock: 400,
        category: 'stationery'
    },
    {
        _id: '24',
        name: 'Soft Grip Scissors',
        description: 'Comfortable grip handles for extended cutting. Stainless steel durable blades.',
        image: 'https://placehold.co/800x800/e2e8f0/1e293b?text=Soft+Grip+Scissors',
        price: 400,
        stock: 120,
        category: 'stationery'
    },
    {
        _id: '25',
        name: 'Geometry Math Set',
        description: '10-piece geometry set including compass, protractor, rulers, and a sturdy case.',
        image: 'https://plus.unsplash.com/premium_photo-1723481535615-e833e714af12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8R2VvbWV0cnklMjBNYXRoJTIwU2V0fGVufDB8fHx8MTc3Mjg1MDM4OHww&ixlib=rb-4.1.0&q=80&w=1080',
        price: 600,
        stock: 180,
        category: 'gadgets'
    },
    {
        _id: '26',
        name: 'Whiteboard Markers (4-Pack)',
        description: 'Low-odor, vibrant dry erase markers with chisel tips. Assorted basic colors.',
        image: 'https://plus.unsplash.com/premium_photo-1661496095732-831d52c79b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8V2hpdGVib2FyZCUyME1hcmtlcnN8ZW58MHx8fHwxNzcyODUwMzg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 500,
        stock: 250,
        category: 'stationery'
    },
    {
        _id: '27',
        name: 'Mini Whiteboard',
        description: 'Personal 9x12 inch dry erase board for quick calculations and brainstorming.',
        image: 'https://plus.unsplash.com/premium_photo-1681671796265-4e8925f49df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8V2hpdGVib2FyZHxlbnwwfHx8fDE3NzI4NTAzOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 800,
        stock: 75,
        category: 'desk'
    },
    {
        _id: '28',
        name: 'Hand Sanitizer (Travel Size)',
        description: 'Keep your hands clean on campus. 2 oz bottle with clip.',
        image: 'https://plus.unsplash.com/premium_photo-1661591285003-9abbde56bf8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8SGFuZCUyMFNhbml0aXplcnxlbnwwfHx8fDE3NzI4NTAzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 200,
        stock: 500,
        category: 'backpacks'
    },
    {
        _id: '29',
        name: 'Lanyard with ID Holder',
        description: 'Durable woven lanyard with a clear plastic pouch for your student ID card.',
        image: 'https://images.unsplash.com/photo-1760783543995-fca5a8a4060e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8TGFueWFyZCUyMHdpdGglMjBJRCUyMEhvbGRlcnxlbnwwfHx8fDE3NzI4NTAzOTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 300,
        stock: 600,
        category: 'backpacks'
    },
    {
        _id: '30',
        name: 'Weekly Planner Pad',
        description: 'Tear-off weekly schedule sheets to track assignments and exams.',
        image: 'https://plus.unsplash.com/premium_photo-1726862532155-65f4cc019639?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8V2Vla2x5JTIwUGxhbm5lciUyMFBhZHxlbnwwfHx8fDE3NzI4NTAzOTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 500,
        stock: 130,
        category: 'stationery'
    },
    {
        _id: '31',
        name: 'Binder Clips (Assorted)',
        description: 'Tub of 30 binder clips in various sizes for serious paper organization.',
        image: 'https://plus.unsplash.com/premium_photo-1761260698826-b1c2511a5fd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QmluZGVyJTIwQ2xpcHN8ZW58MHx8fHwxNzcyODUwMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 400,
        stock: 220,
        category: 'stationery'
    },
    {
        _id: '32',
        name: 'USB-C Charging Cable',
        description: 'Durable 6ft braided charging cable compatible with modern phones and laptops.',
        image: 'https://plus.unsplash.com/premium_photo-1760507806873-f6d862a9568d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8VVNCLUMlMjBDaGFyZ2luZyUyMENhYmxlfGVufDB8fHx8MTc3Mjg1MDM5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        price: 700,
        stock: 150,
        category: 'gadgets'
    }
];
