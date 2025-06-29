const mongoose = require("mongoose");
const Book = require("./models/Book");
const User = require("./models/User");
require("dotenv").config();

// Sample books data
const sampleBooks = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg",
    rating: 4.3,
  },
  {
    title: "1984",
    author: "George Orwell",
    description:
      "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg",
    rating: 4.2,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners written by Jane Austen in 1813.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg",
    rating: 4.1,
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A classic American novel set in the summer of 1922 in the fictional town of West Egg on Long Island.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
    rating: 3.9,
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description:
      "A novel about teenage rebellion and angst, narrated by Holden Caulfield.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg",
    rating: 3.8,
  },
  {
    title: "Lord of the Flies",
    author: "William Golding",
    description:
      "A novel about a group of British boys stranded on an uninhabited island.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327869409i/7624.jpg",
    rating: 3.7,
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    description:
      "The first novel in the Harry Potter series about a young wizard's journey.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg",
    rating: 4.7,
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel about the adventures of Bilbo Baggins.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg",
    rating: 4.3,
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    description:
      "A dystopian novel set in a futuristic World State of genetically modified citizens.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1575509280i/5129.jpg",
    rating: 3.9,
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    description:
      "An epic high-fantasy novel about the War of the Ring and the journey to destroy the One Ring.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1566425108i/33.jpg",
    rating: 4.5,
  },
];

// Admin user data
const adminUser = {
  name: "Admin User",
  email: "admin@bookreviews.com",
  password: "admin123",
  role: "admin",
  bio: "System Administrator",
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Book.deleteMany({});
    console.log("Cleared existing books");

    // Check if admin user exists, if not create one
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
      await User.create(adminUser);
      console.log("Created admin user");
    } else {
      console.log("Admin user already exists");
    }

    // Insert sample books
    const insertedBooks = await Book.insertMany(sampleBooks);
    console.log(`Inserted ${insertedBooks.length} books successfully!`);

    // Display inserted books
    console.log("\n📚 Books added to database:");
    insertedBooks.forEach((book, index) => {
      console.log(
        `${index + 1}. ${book.title} by ${book.author} (Rating: ${book.rating})`
      );
    });

    console.log("\n✅ Database seeded successfully!");
    console.log("\n👤 Admin credentials:");
    console.log("Email: admin@bookreviews.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeder
seedDatabase();
