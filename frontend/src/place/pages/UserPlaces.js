import React from 'react';
import {useParams} from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous skyscraper',
        imageUrl: 'https://s39023.pcdn.co/wp-content/uploads/2022/10/Where-Are-Those-Morgans-Empire-State-Building.jpg.optimal.jpg',
        address: '20 W 34th St., New York, NY 10001, USA',
        location: {
            lat: 40.7484405,
            lng: -73.9878531
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Qutub Green Apartments',
        description: 'My New Home',
        imageUrl: 'https://content3.jdmagicbox.com/comp/delhi/b1/011pxx11.xx11.160525132505.d6b1/catalogue/qutub-green-apartments-mehrauli-delhi-hotels-fc92s7ftdn.jpg',
        address: 'Qutub Green Apartments, Mehrauli',
        location: {
            lat: 28.518603,
            lng: 77.181656
        },
        creator: 'u2'
    },
];

const UserPlaces = (props) => {
    const userId = useParams().userId;
    const loadedPlaces = PLACES.filter(place => place.creator === userId);
    return <PlaceList items={loadedPlaces} />
};

export default UserPlaces;