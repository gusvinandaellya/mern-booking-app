import PhotosUploader from "../components/PhotosUploader.jsx";
import Perks from "../components/Perks.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import AccountNav from "../components/AccountNav.jsx";
import {Navigate, useParams} from "react-router-dom";

export default function PlacesFormPage() {
  const {id} = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);

  useEffect(() => {
    if (id) {
      axios.get('/places/' + id)
        .then(response => {
        const {title, address, description, perks, extraInfo, checkIn, checkOut, maxGuests, photos, price} = response.data;
        setTitle(title);
        setAddress(address);
        setDescription(description);
        setPerks(perks);
        setExtraInfo(extraInfo);
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setMaxGuests(maxGuests);
        setAddedPhotos(photos);
        setPrice(price);
      })
    }
  }, [id]);

  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    )
  }

  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    )
  }

  function preInput(header, description) {
    return (
      <div>
        {inputHeader(header)}
        {inputDescription(description)}
      </div>
    )
  }

  async function savePlace(e) {
    e.preventDefault();
    const placeData = {
      title, address, addedPhotos,
      description, perks, extraInfo, checkIn,
      checkOut, maxGuests, price
    };
    if (id) {
      await axios.put('/places', {id, ...placeData});
    } else {
      await axios.post('/places', placeData);
    }

    setRedirect(true);
  }

  if (redirect) return (<Navigate to={'/account/places'}/>);

  return (
    <div>
      <AccountNav/>
      <form onSubmit={savePlace}>
        {preInput('Title', 'title, for example: My Lovely apt')}
        <input
          type="text"
          placeholder="title, for example: My Lovely apt"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {preInput('Address', 'address')}
        <input
          type="text"
          placeholder="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {preInput('Photos', 'More = Better')}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
        {preInput('Description', 'Describe your place')}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {preInput('Perks', 'Select all that apply')}
        <div className="grid -t-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks}/>
        </div>
        {preInput('Extra Info', 'Add any extra info')}
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
        {preInput('Check In&Out Time', 'Set check in and check out times, for example: 14:00 - 12:00')}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check In Time</h3>
            <input
              type="text"
              placeholder="14"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check Out Time</h3>
            <input
              type="text"
              placeholder="12"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              placeholder="1"
              value={maxGuests}
              onChange={(e) => setMaxGuests(Number(e.target.value))}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              placeholder="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>

  )
}