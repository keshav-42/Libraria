import { useEffect, useState } from "react";
import axios from "../api/api";
import { Link } from "react-router-dom";
import { Star, User } from "lucide-react";
import CustomButton from "../components/CustomButton";
import ShimmerBookCard from "../components/ShimmerBookCard";

const Book = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const booksPerPage = 8;

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

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === 0 || Math.floor(book.rating) === ratingFilter;

    return matchesSearch && matchesRating;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const topView = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 🔍 Search & Filter */}
      <div className="pb-4 py-4 mb-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <input
            type="text"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border bg-white border-gray-300 focus:border-gray-500 focus:outline-none px-4 py-2 rounded-xl w-full sm:w-1/2 shadow-sm"
          />

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(Number(e.target.value))}
            className="border border-gray-300 focus:border-gray-500 focus:outline-none px-4 py-2 rounded-xl w-full sm:w-1/3 shadow-sm bg-white text-gray-700"
          >
            <option value={0}>All Ratings</option>
            <option value={5}>★★★★★</option>
            <option value={4}>★★★★☆</option>
            <option value={3}>★★★☆☆</option>
            <option value={2}>★★☆☆☆</option>
            <option value={1}>★☆☆☆☆</option>
          </select>
        </div>
      </div>

      {/* 📚 Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <ShimmerBookCard />
        ) : currentBooks.length > 0 ? (
          currentBooks.map((book) => (
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                    {book.title}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-3">
                    <User className="h-4 w-4 mr-1" />
                    <p className="text-sm font-medium">{book.author}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
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
                className="w-24 h-24 mx-auto"
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
              No Books Found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {books.length === 0
                ? "No books are available in the library yet."
                : "No books match your current search criteria. Try adjusting your filters."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded text-sm ${
                currentPage === index + 1
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Book;
