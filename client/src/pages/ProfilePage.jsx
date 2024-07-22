import {useContext, useEffect, useState} from "react";
import {UserContext} from "../components/UserContext.jsx";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage.jsx";
import AccountNav from "../components/AccountNav.jsx";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const {ready, user, setUser} = useContext(UserContext);

  //test api kevin
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(0);
  // const [users, setUsers] = useState('');
  //
  // useEffect(() => {
  //   axios.get(`http://143.198.203.76:8000/api/v1/client/66192c8bb7bf64ba8971f3b7?page=${currentPage}&limit=5`)
  //     .then(response => {
  //       setUsers(response.data.payload.data);
  //       setTotalPages(response.data.payload.meta.last_page);
  //     });
  // }, [currentPage]);
  //
  // const handlePageChange = (newPage) => {
  //   setCurrentPage(newPage);
  // };

  //end test api kevin

  let {subpage} = useParams(); // Move this line up

  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('/logout');
    setRedirect('/');
    setUser(null);
  }

  if (!ready) return (<div>Loading...</div>);
  if (ready && !user && !redirect) return (<Navigate to={'/login'}/>);

  if (redirect) return (<Navigate to={redirect}/>);
  return (
    <div>
      <AccountNav/>
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}

      {subpage === 'places' && (
        <PlacesPage/>
      )}

      {/*test api kevin*/}

      {/*<div className="mt-4">*/}
      {/*  {users.length > 0 && users.map(user => (*/}
      {/*    <div key={user.id} className="mb-2">*/}
      {/*      <div className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">*/}
      {/*        <div className="grow-0 shrink">*/}
      {/*          <h2 className="text-xl">{user.name}</h2>*/}
      {/*          <p className="text-sm mt-2">{user.email}</p>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</div>*/}

      {/*<div className="flex gap-2 mt-8 justify-center items-center">*/}
      {/*  {currentPage > 1 && (*/}
      {/*    <button className="p-2 border border-gray-500 bg-white text-black rounded-xl text-sm"*/}
      {/*            onClick={() => handlePageChange(currentPage - 1)}>*/}
      {/*      <div className="flex">*/}
      {/*        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}*/}
      {/*             stroke="currentColor" className="size-5">*/}
      {/*          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>*/}
      {/*        </svg>*/}
      {/*        <span className="mr-2">Back</span>*/}
      {/*      </div>*/}
      {/*    </button>*/}
      {/*  )}*/}
      {/*  <span className="font-semibold text-sm">Page {currentPage} of {totalPages}</span>*/}
      {/*  {currentPage < totalPages && (*/}
      {/*    <button className="p-2 border border-gray-500 bg-white text-black rounded-xl text-sm"*/}
      {/*            onClick={() => handlePageChange(currentPage + 1)}>*/}
      {/*      <div className="flex">*/}
      {/*        <span className="ml-2">Next</span>*/}
      {/*        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}*/}
      {/*             stroke="currentColor" className="size-5">*/}
      {/*          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>*/}
      {/*        </svg>*/}
      {/*      </div>*/}
      {/*    </button>*/}
      {/*  )}*/}
      {/*</div>*/}

      {/*end test api kevin*/}
    </div>
  )
}