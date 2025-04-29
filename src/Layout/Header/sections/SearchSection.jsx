import { useState, useMemo, useEffect, useRef } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTitle, setSearchListingNumber, setSearchCategory } from "../../../redux/slices/search.slice";

export default function SearchSection() {
  const searchCategory = useSelector((state) => state.search.category);
  const [queryText, setQueryText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const dispatch = useDispatch();

  // Debug logs for dropdown state
  // =====================================
  useEffect(() => {
    console.log("Dropdown state changed:", isOpen);
  }, [isOpen]);
  // =====================================

  // Static list of categories
  // =====================================
  const staticCategories = [
    "alarm & security",
    "animals & pets",
    "architecture & design",
    "building & construction",
    "cleaning",
    "electrical & gas",
    "entertainers",
    "landscape & outdoor",
    "moving & storage",
    "other",
    "outdoor & garden",
    "party rentals & supplies",
    "photography & videography",
    "pool & pool cleaning",
    "signage & graphics",
    "tuition & learning",
    "wedding",
  ].map((name, index) => ({ _id: `cat-${index}`, name }));
  // =====================================

  // Log categories for debugging
  useEffect(() => {
    console.log("Available categories:", staticCategories.length);
    console.log("First few categories:", staticCategories.slice(0, 3));
  }, [staticCategories]);

  // Filter categories based on search input
  const filteredCategories = useMemo(() => {
    if (!staticCategories || staticCategories.length === 0) return [];
    if (!categoryFilter.trim()) return staticCategories;

    return staticCategories.filter((cat) => cat.name.toLowerCase().includes(categoryFilter.toLowerCase()));
  }, [staticCategories, categoryFilter]);

  // Log filtered categories whenever they change
  useEffect(() => {
    console.log("Filtered categories count:", filteredCategories.length);
  }, [filteredCategories]);

  // Position the dropdown when it opens
  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      dropdownRef.current.style.width = `${buttonRect.width}px`;
      dropdownRef.current.style.left = `${buttonRect.left}px`;
      dropdownRef.current.style.top = `${buttonRect.bottom + window.scrollY}px`;
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Check if the search query is a number (potential listing number)
    if (/^\d+$/.test(queryText)) {
      // If it's a number, search by listing number
      dispatch(setSearchListingNumber({ listingNumber: queryText }));
    } else {
      // Otherwise search by title
      dispatch(setSearchTitle({ title: queryText }));
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    console.log("Category selected:", category.name);
    dispatch(setSearchCategory({ category: category.name }));
    setIsOpen(false);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    console.log("Toggle dropdown clicked. Current state:", isOpen);
    setIsOpen(!isOpen);
  };

  // Ensure dropdown closes when clicking elsewhere
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      // Only run this if the dropdown is open and both refs are available
      if (dropdownRef.current && buttonRef.current && !dropdownRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
        console.log("Document click outside dropdown detected");
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-stretch md:items-center mb-4 px-3 md:px-6 gap-3 md:gap-0">
        <div className="w-full md:w-auto flex flex-col md:flex-row shadow-md rounded-lg md:rounded-xl overflow-hidden border">
          {/* Browse dropdown - Full width on mobile */}
          <div className="flex justify-center w-full md:w-auto border-b md:border-b-0 md:border-r">
            <div className="relative w-full">
              <button
                onClick={toggleDropdown}
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 hover:text-primaryA0 w-full transition-colors"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                data-testid="browse-dropdown-button"
                ref={buttonRef}
              >
                <span className="text-sm sm:text-base text-center truncate font-medium capitalize max-w-[180px] sm:max-w-none">
                  {searchCategory || "Browse marketplace"}
                </span>
                <FaChevronDown className="text-gray-600 flex-shrink-0" />
              </button>
            </div>
          </div>

          {/* Search form - Full width on mobile */}
          <form className="flex items-center w-full px-2 sm:px-3 gap-2" onSubmit={handleSearch}>
            <div className="flex flex-1 w-full relative">
              <input
                placeholder="Search by listing title or #ID..."
                className="py-2.5 sm:py-3 px-3 flex-1 w-full focus:outline-primaryA0 text-sm sm:text-base rounded-md"
                value={queryText}
                onChange={(e) => {
                  setQueryText(e.target.value);
                }}
                type="text"
                aria-label="Search input"
              />
            </div>
            <button
              type="submit"
              className="p-2 sm:p-3 rounded-lg bg-primaryA0 hover:bg-primaryA0/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryA0"
              aria-label="Search"
            >
              <FaSearch className="text-white" size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Portal the dropdown outside of any potential container issues */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-[9999] mt-1 shadow-xl rounded-lg border border-gray-200 overflow-y-auto"
          style={{
            backgroundColor: "white",
            maxHeight: "80vh",
            width: buttonRef.current ? buttonRef.current.offsetWidth : "auto",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          data-testid="dropdown-content"
        >
          <div className="p-4 bg-white rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Categories ({filteredCategories.length})</h3>

            {/* Category filter input */}
            <div className="mb-3 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2 pl-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primaryA0"
                />
                <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </div>

            {filteredCategories.length === 0 ? (
              <div className="py-4 text-center text-gray-500 text-sm">No categories found matching &quot;{categoryFilter}&quot;</div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto">
                <div className="grid grid-cols-1 gap-1">
                  {filteredCategories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategorySelect(category)}
                      className={`p-3 text-left rounded-md text-sm hover:bg-gray-100 transition-colors ${
                        searchCategory === category.name ? "bg-primaryA0/10 text-primaryA0 font-medium" : "text-gray-700"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  console.log("View All clicked");
                  dispatch(setSearchCategory({ category: "" }));
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-center text-sm text-primaryA0 hover:bg-primaryA0/5 rounded-md transition-colors"
              >
                View All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
