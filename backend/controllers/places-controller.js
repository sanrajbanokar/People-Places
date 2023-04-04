const HttpError = require('../models/http-error');
const {uuid} = require('uuidv4');
const {validationResult} = require('express-validator');
const getCoordsForAddress = require('../util/location');

let DUMMY_PLACES = [
    {
      id: "p1",
      title: "Empire State Building",
      description: "One of the most famous skyscraper",
      imageUrl:
        "https://s39023.pcdn.co/wp-content/uploads/2022/10/Where-Are-Those-Morgans-Empire-State-Building.jpg.optimal.jpg",
      address: "20 W 34th St., New York, NY 10001, USA",
      location: {
        lat: 40.7484405,
        lng: -73.9878531,
      },
      creator: "u1",
    },
    {
      id: "p2",
      title: "Qutub Green Apartments",
      description: "My New Home",
      imageUrl:
        "https://content.jdmagicbox.com/comp/delhi/b1/011pxx11.xx11.160525132505.d6b1/catalogue/qutub-green-apartments-mehrauli-delhi-hotels-rs-1001-to-rs-2000-1wnx46p.jpg",
      address: "Qutub Green Apartments, Mehrauli",
      location: {
        lat: 28.518603,
        lng: 77.181656,
      },
      creator: "u1",
    },
  ];

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const places = DUMMY_PLACES.find((p) => {
      return p.id === placeId;
    });
    if (!places) {
      // const error = new Error("Could not find a place with the provided id");
      // error.code = 404;
      // throw error;
      throw new HttpError("Could not find a place with the provided id", 404);
    }
    res.json({ places });
  };

  const getPlacesByUser = (req, res, next) => {
    const userId = req.params.uid;
    // const places = [];
    // DUMMY_PLACES.find((p) => {
    //   if (p.creator === userId) {
    //     places.push(p);
    //   }
    // });
    const places = DUMMY_PLACES.filter(p => p.creator === userId);
    if (!places || places.length === 0) {
      // const error = new Error("Could not find a user with the provided id");
      // error.code = 404;
      // return next(error);
      return next(
        new HttpError("Could not find a user with the provided id", 404)
      );
    }
    res.json({ places });
  };

  const createPlace = async(req, res, next) => {
      const errors = validationResult(req);
    //   console.log(errors)
      if(!errors.isEmpty()){
        return next(new HttpError("Invalid inputs passed, please check your data", 422))
      }
    const {title, description, address, creator} = req.body; // const title = req.body.title;

    let coordinates;
    try{
        coordinates = await getCoordsForAddress(address);
    }catch(error) {
       return next(error);
    }
    // const createdPlace = {
    //     title: title,
    //     description: description,
    //     location: coordinates,
    //     address: address,
    //     creator: creator
    // };
    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace})
  };

  const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    // console.log(errors)
    if(!errors.isEmpty()){
      return next(new HttpError("Invalid inputs passed, please check your data", 422))
    }
    const {title, description} = req.body; // const title = req.body.title;
    const placeId = req.params.pid;
    const updatedPlace = {...DUMMY_PLACES.find((p) =>  p.id === placeId)};
    const placeIndex = DUMMY_PLACES.findIndex(p=> p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({place: updatedPlace});

  };
  
  const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if(DUMMY_PLACES.find(p=> p.id === placeId)){
        DUMMY_PLACES = DUMMY_PLACES.filter(p=> p.id !== placeId);
    }else {
        return next(new HttpError("Could not find the place to delete",404));
    }
    res.status(200).json({message: "Place deleted successfuly"})
  };



  exports.getPlaceById = getPlaceById;
  exports.getPlacesByUser = getPlacesByUser;
  exports.createPlace = createPlace;
  exports.updatePlace = updatePlace;
  exports.deletePlace = deletePlace;