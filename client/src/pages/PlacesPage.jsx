import {Link} from "react-router-dom";
import AccountNav from "../components/AccountNav.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import PlaceImg from "../components/PlaceImg.jsx";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axios.get(`/user-places?page=${currentPage}&limit=10`).then(response => {
      setPlaces(response.data.places);
      setTotalPages(response.data.pageInfo.last_pagetotalPages);
    });
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <AccountNav/>
      <div className="text-center">
        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
               stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Add New Place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 && places.map(place => (
          <div key={place._id} className="mb-2"> {/* Ensure `place._id` is a unique identifier */}
            <Link to={'/account/places/' + place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
              <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                <PlaceImg place={place}/>
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl">{place.title}</h2>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-8 justify-center items-center">
        {currentPage > 1 && (
          <button className="p-2 border border-gray-500 bg-white text-black rounded-xl text-sm"
                  onClick={() => handlePageChange(currentPage - 1)}>
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                   stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
              </svg>
              <span className="mr-2">Back</span>
            </div>
          </button>
        )}
        <span className="font-semibold text-sm">Page {currentPage} of {totalPages}</span>
        {currentPage < totalPages && (
          <button className="p-2 border border-gray-500 bg-white text-black rounded-xl text-sm"
                  onClick={() => handlePageChange(currentPage + 1)}>
            <div className="flex">
              <span className="ml-2">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                   stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}