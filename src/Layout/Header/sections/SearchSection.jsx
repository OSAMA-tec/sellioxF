import { useState, useMemo } from "react";
import { FaChevronDown, FaSearch, FaSpinner } from "react-icons/fa";
import Dropdown from "../../../Components/Dropdown/Dropdown";
import BrowseMenu from "../../../Components/BrowseMenu/BrowseMenu";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTitle, setSearchListingNumber, setSearchCategory } from "../../../redux/slices/search.slice";
import useGetAllCategories from "../../../utils/react-query-hooks/category/useGetAllCategories";

export default function SearchSection() {
  const searchCategory = useSelector((state) => state.search.category);
  const [queryText, setQueryText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const dispatch = useDispatch();

  // Fetch categories using the API hook
  const {
    data: categoriesData,
    isLoading,
    isError,
  } = useGetAllCategories({
    onSuccess: (data) => {
      console.log("Categories loaded successfully:", data?.data?.categories?.length);
    },
    onError: (error) => {
      console.error("Error loading categories:", error);
    },
  });

  // Extract categories from the response
  const categories = categoriesData?.data?.categories || [];

  // Filter categories based on search input
  const filteredCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    if (!categoryFilter.trim()) return categories;

    return categories.filter((cat) => cat.name.toLowerCase().includes(categoryFilter.toLowerCase()));
  }, [categories, categoryFilter]);

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
    dispatch(setSearchCategory({ category: category.name }));
    setIsOpen(false);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle dropdown close
  const handleDropdownClose = () => {
    setIsOpen(false);
  };

  return (
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
            >
              <span className="text-sm sm:text-base text-center truncate font-medium capitalize max-w-[180px] sm:max-w-none">
                {searchCategory || "Browse marketplace"}
              </span>
              {isLoading ? (
                <FaSpinner className="animate-spin text-gray-600 flex-shrink-0" />
              ) : (
                <FaChevronDown className="text-gray-600 flex-shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-[50vh] md:max-h-[80vh] overflow-y-auto shadow-lg rounded-lg">
                {isLoading ? (
                  <div className="flex justify-center items-center p-4 bg-white rounded-lg">
                    <FaSpinner className="animate-spin text-primaryA0 mr-2" />
                    <span>Loading categories...</span>
                  </div>
                ) : isError ? (
                  <div className="p-4 bg-white rounded-lg text-red-500">
                    <p>Error loading categories.</p>
                    <button className="mt-2 text-sm text-primaryA0 hover:underline" onClick={() => window.location.reload()}>
                      Refresh page
                    </button>
                  </div>
                ) : categories.length > 0 ? (
                  <div className="p-2 bg-white rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 px-2">Categories</h3>

                    {/* Category filter input */}
                    <div className="px-2 mb-3 relative">
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
                      <div className="py-4 text-center text-gray-500 text-sm">
                        No categories found matching &quot;{categoryFilter}&quot;
                      </div>
                    ) : (
                      <div className="max-h-[300px] overflow-y-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {filteredCategories.map((category) => (
                            <button
                              key={category._id}
                              onClick={() => handleCategorySelect(category)}
                              className={`px-4 py-2 text-left rounded-md text-sm hover:bg-gray-100 transition-colors ${
                                searchCategory === category.name ? "bg-primaryA0/10 text-primaryA0 font-medium" : "text-gray-700"
                              }`}
                            >
                              {category.name}
                              {category.count && <span className="ml-1 text-xs text-gray-500">({category.count})</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => {
                          dispatch(setSearchCategory({ category: "" }));
                          setIsOpen(false);
                        }}
                        className="w-full px-4 py-2 text-center text-sm text-primaryA0 hover:bg-primaryA0/5 rounded-md transition-colors"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-center text-gray-500 mb-3">No categories available</p>
                    <BrowseMenu className="shadow-xl bg-white rounded-lg overflow-hidden" />
                  </div>
                )}
              </div>
            )}
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

      {/* Close dropdown when clicking outside */}
      {isOpen && <div className="fixed inset-0 bg-transparent z-0" onClick={handleDropdownClose} aria-hidden="true" />}
    </div>
  );
}
