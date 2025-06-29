import { useEffect, useState } from "react";
import axios from "../api/api";
import { Link } from "react-router-dom";
import { Star, User } from "lucide-react";
import CustomButton from "./CustomButton";

const FeaturedBooks = ({ showAll = false }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/books")
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, []);

  const displayedBooks = showAll ? books : books.slice(0, 4);

  const topView = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {showAll ? "All Books" : "Featured Books"}
      </h2>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Show shimmer loading
          Array.from({ length: showAll ? 8 : 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="bg-gray-200 h-64 w-full"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, idx) => (
                    <div
                      key={idx}
                      className="h-4 w-4 bg-gray-300 rounded-full"
                    />
                  ))}
                </div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))
        ) : displayedBooks.length > 0 ? (
          displayedBooks.map((book) => (
            <Link to={`/book/${book._id}`} onClick={topView} key={book._id}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <User className="h-4 w-4 mr-1" />
                    <p className="text-sm font-medium">{book.author}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-between space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(book.rating)
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-semibold text-gray-700 ml-1">
                        {book.rating}
                      </span>
                    </div>
                    {/* <span className="text-xs text-gray-500 ">
                    {book.reviews?.toLocaleString()} 
                  </span> */}
                  </div>

                  <CustomButton
                    variant="outline"
                    className="w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-300"
                  >
                    Read Reviews
                  </CustomButton>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-20 h-20 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Books Available
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              No books are available in the library yet. Check back later for
              new additions!
            </p>
          </div>
        )}
      </div>

      {/* View All Button */}
      {!showAll && (
        <div className="mt-10 text-center">
          <Link to="/book" onClick={topView}>
            <CustomButton className="bg-gray-700 hover:bg-gray-800 cursor-pointer text-white rounded-xl px-8 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300">
              View All Books
            </CustomButton>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FeaturedBooks;
