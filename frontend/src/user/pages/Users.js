import React, {useEffect, useState} from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import UsersList from '../components/UsersList';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
    // const USERS = [
    //     {
    //         id: 'u1',
    //         name:"Sanraj Banokar",
    //         image:"https://static01.nyt.com/images/2020/12/14/well/14google-photo/14google-photo-videoSixteenByNineJumbo1600.jpg",
    //         places: 3
    //     },
    //     {
    //         id: 'u2',
    //         name:"Shivangi Goyal",
    //         image:"https://static01.nyt.com/images/2020/12/14/well/14google-photo/14google-photo-videoSixteenByNineJumbo1600.jpg",
    //         places: 2
    //     },
    //     {
    //         id: 'u3',
    //         name:"Rohit Dumbey",
    //         image:"https://static01.nyt.com/images/2020/12/14/well/14google-photo/14google-photo-videoSixteenByNineJumbo1600.jpg",
    //         places: 1
    //     },
    // ];

    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState();
    const [loadedUsers, setLoadedUsers] = useState();

    const {isLoading, error, sendRequest, clearError} = useHttpClient();


    useEffect(()=> {
        const fetchRequest = async()=> {
            try{
                const responseData = await sendRequest('http://localhost:5000/api/users');
                setLoadedUsers(responseData.users);
            }catch(err){
               
            }  
        };
        fetchRequest();
    },[sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error ={error} onClear={clearError}/>
    {isLoading && <div className="center">
        <LoadingSpinner asOverlay/>
    </div>}
    {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
    );

};

export default Users;
