import React from "react";
import { useForm } from "../../shared/hooks/form-hook";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/Util/validators";

import "./Place.css";

const NewPlace = (props) => {
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState); //send this to backend
  };

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        element="input"
        label="Title"
        id="title"
        type="text"
        validators={[VALIDATOR_REQUIRE()]}
        onInput={inputHandler}
        errorText="Enter a valid title"
        // rows={} label={} type={} placeholder={}
      />
      <Input
        element="textarea"
        id="description"
        label="Description"
        type="text"
        validators={[VALIDATOR_MINLENGTH(5)]}
        onInput={inputHandler}
        errorText="Enter a valid description (atleast 5 characters)"
        // rows={} label={} type={} placeholder={}
      />
      <Input
        element="input"
        id="address"
        label="Address"
        type="text"
        validators={[VALIDATOR_REQUIRE()]}
        onInput={inputHandler}
        errorText="Enter a valid address"
        // rows={} label={} type={} placeholder={}
      />
      <Button type="submit" disabled={!formState.isValid}>
        Add Place
      </Button>
    </form>
  );
};

export default NewPlace;
