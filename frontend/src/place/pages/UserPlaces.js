import React from 'react';

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
        title: 'Empire State Building',
        description: 'One of the most famous skyscraper',
        imageUrl: 'https://a.cdn-hotels.com/gdcs/production176/d304/45e7e95a-6f5d-4f19-9479-1d3ddfee7e99.jpg',
        address: '20 W 34th St., New York, NY 10001, USA',
        location: {
            lat: 40.7484405,
            lng: -73.9878531
        },
        creator: 'u2'
    },
];

const UserPlaces = (props) => {
    return <PlaceList items={PLACES} />
};

export default UserPlaces;