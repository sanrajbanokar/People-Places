import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
    const USERS = [
        {
            id: 'u1',
            name:"Sanraj Banokar",
            image:"https://static01.nyt.com/images/2020/12/14/well/14google-photo/14google-photo-videoSixteenByNineJumbo1600.jpg",
            places: 3
        },
        {
            id: 'u2',
            name:"Shivangi Goyal",
            image:"https://static01.nyt.com/images/2020/12/14/well/14google-photo/14google-photo-videoSixteenByNineJumbo1600.jpg",
            places: 2
        },
        {
            id: 'u3',
            name:"Rohit Dumbey",
            image:"https://static01.nyt.com/images/2020/12/14/well/14google-photo/14google-photo-videoSixteenByNineJumbo1600.jpg",
            places: 1
        },
    ];
    return <UsersList items={USERS} />
};

export default Users;
