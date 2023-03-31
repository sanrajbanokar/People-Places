import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
    const USERS = [
        {
            id: 'ul',
            name:"Sanraj Banokar",
            image:"https://static01.nyt.com/images/2020/12/14/well/14google-photo/14google-photo-videoSixteenByNineJumbo1600.jpg",
            places: 3
        },
        {
            id: 'il',
            name:"Shivangi Goyal",
            image:"https://static01.nyt.com/images/2020/12/14/well/14google-photo/14google-photo-videoSixteenByNineJumbo1600.jpg",
            places: 2
        },
        {
            id: 'ml',
            name:"Rohit Dumbey",
            image:"https://static01.nyt.com/images/2020/12/14/well/14google-photo/14google-photo-videoSixteenByNineJumbo1600.jpg",
            places: 1
        },
    ];
    return <UsersList items={USERS} />
};

export default Users;
