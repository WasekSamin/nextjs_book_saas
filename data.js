export const POP_GENRES = [
    {
        id: 1,
        title: "Title 1"
    },
    {
        id: 2,
        title: "Title 2"
    },
    {
        id: 3,
        title: "Title 3"
    },
    {
        id: 4,
        title: "Title 4"
    },
    {
        id: 5,
        title: "Title 5"
    },
    {
        id: 6,
        title: "Title 6"
    },
]

function getRandomRating() {
    return Math.floor(Math.random() * 5) + 1; // Random rating between 1 and 5
}

function getRandomAuthor() {
    const authors = [
        {
            id: 1,
            name: "John Doe"
        },
        {
            id: 2,
            name: "Jane Smith"
        },
        {
            id: 3,
            name: "Alice Johnson"
        }
    ];

    return authors[Math.floor(Math.random() * authors.length)];   
}

function getRandomDescription() {
    const descriptions = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Nulla dicta provident deserunt saepe excepturi earum! Veniam dicta dolor obcaecati beatae?",
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
        "Proin at libero ac urna facilisis fringilla.",
        "Nunc consequat lacus id purus vehicula, vitae tincidunt neque pellentesque.",
        "Fusce sit amet lorem at eros porta feugiat vel et arcu."
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateRandomData(count) {
    const data = [];

    for (let i = 1; i <= count; i++) {
        data.push({
            id: i,
            title: `Title ${i}`,
            author: getRandomAuthor(),
            description: getRandomDescription(),
            rating: getRandomRating(),
            image: "/assets/images/no_img.jpg"
        });
    }

    return data;
}

export const BOOKS = generateRandomData(20);


export const GENRES = [
    {
        "id": 1,
        "title": "Fantasy"
    },
    {
        "id": 2,
        "title": "Science Fiction"
    },
    {
        "id": 3,
        "title": "Mystery"
    },
    {
        "id": 4,
        "title": "Thriller"
    },
    {
        "id": 5,
        "title": "Romance"
    },
    {
        "id": 6,
        "title": "Horror"
    },
    {
        "id": 7,
        "title": "Historical Fiction"
    },
    {
        "id": 8,
        "title": "Biography"
    },
    {
        "id": 9,
        "title": "Self-Help"
    },
    {
        "id": 10,
        "title": "Adventure"
    },
    {
        "id": 11,
        "title": "Graphic Novel"
    },
    {
        "id": 12,
        "title": "Poetry"
    },
    {
        "id": 13,
        "title": "Non-Fiction"
    },
    {
        "id": 14,
        "title": "Children's"
    },
    {
        "id": 15,
        "title": "Young Adult"
    },
    {
        "id": 16,
        "title": "Dystopian"
    },
    {
        "id": 17,
        "title": "Classics"
    },
    {
        "id": 18,
        "title": "Crime"
    },
    {
        "id": 19,
        "title": "Philosophy"
    },
    {
        "id": 20,
        "title": "Humor"
    }
]

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomBoolean = () => Math.random() < 0.5;

const USERS = [
    { id: 1, name: "Wasek Samin" },
    { id: 2, name: "Alice Johnson" },
    { id: 3, name: "John Doe" },
    { id: 4, name: "Jane Smith" },
    { id: 5, name: "Michael Brown" }
];

const generateRandomReviewMessage = () => {
    const messages = [
        "lorem ipsum",
        "Great book! Highly recommended.",
        "Not what I expected.",
        "A masterpiece, truly!",
        "Quite an interesting read."
    ];
    return messages[getRandomNumber(0, messages.length - 1)];
};

const generateRandomReviews = () => {
    let REVIEWS = [];
    
    for (let i = 0; i < 20; i++) {
        const randomUser = USERS[getRandomNumber(0, USERS.length - 1)];
        const randomBook = BOOKS[getRandomNumber(0, BOOKS.length - 1)];
        
        REVIEWS.push({
            id: i+1,
            user: {
                id: randomUser.id,
                name: randomUser.name
            },
            book: {
                id: randomBook.id,
                title: randomBook.title
            },
            review_message: generateRandomReviewMessage(),
            rating: getRandomRating(),
            is_hidden: getRandomBoolean()
        });
    }

    return REVIEWS;
};

export const REVIEWS = generateRandomReviews();