const HttpError = require("../models/http-error");
const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");

const Place = require("../models/place");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  // const places = DUMMY_PLACES.find((p) => {
  //   return p.id === placeId;
  // });
  let places;
  try {
    places = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later",
      500
    );
    return next(error);
  }
  if (!places) {
    const error = HttpError("Could not find a place with the provided id", 404);
    return next(error);
  }
  res.json({ place: places.toObject({ getters: true }) });
};

const getPlacesByUser = async (req, res, next) => {
  const userId = req.params.uid;
  // const places = DUMMY_PLACES.filter(p => p.creator === userId);
  // default way to do
  // let places;
  // try{
      //     places = await Place.find({creator: userId});
      // }catch(err){
          //     const error = new HttpError("Something went wrong, please try again later", 500);
          //     return next(error);
          // }
          // if (!places || places.length === 0) {
              
              //   return next(
                  //     new HttpError("Could not find a user with the provided id", 404)
                  //   );
                  // }
                  // res.json({ places: places.map(place=> place.toObject({getters:true})) });


                  // Can do with this way also
                  let userWithPlaces;
                  try {
                      userWithPlaces = await User.findById(userId).populate("places");
                    //   console.log(userWithPlaces.places.toObject({getters:true}));
                } catch (err) {
                    const error = new HttpError(
                        "Something went wrong, please try again later",
                        500
                        );
                        return next(error);
                    }
                    if (!userWithPlaces.places || userWithPlaces.places.length === 0) {
                        return next(
                            new HttpError("Could not find a user with the provided id", 404)
                            );
                        }
                  res.json({
                    places: userWithPlaces.places.map((place) =>
                      place.toObject({ getters: true })
                    ),
                  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { title, description, address, creator } = req.body; // const title = req.body.title;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image:
      "https://thetimelock.photos/wp-content/uploads/IMG-20191126-WA0075.jpg",
    creator,
  });
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "Could not create Place as the user does not exist",
      500
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Could not create new place", 500);
    return next(error);
  }

  // DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace.toObject({ getter: true }) });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { title, description } = req.body; // const title = req.body.title;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later",
      500
    );
    return next(error);
  }

  // const updatedPlace = {...DUMMY_PLACES.find((p) =>  p.id === placeId)};
  // const placeIndex = DUMMY_PLACES.findIndex(p=> p.id === placeId);
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update", 500);
    return next(error);
  }
  // DUMMY_PLACES[placeIndex] = updatedPlace;
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find place!",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find place for the given place id!",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    sess.commitTransaction();
    // await place.deleteOne();
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete!", 500);
    return next(error);
  }
  // if(DUMMY_PLACES.find(p=> p.id === placeId)){
  //     DUMMY_PLACES = DUMMY_PLACES.filter(p=> p.id !== placeId);
  // }else {
  //     return next(new HttpError("Could not find the place to delete",404));
  // }
  res.status(200).json({ message: "Place deleted successfuly" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUser = getPlacesByUser;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
