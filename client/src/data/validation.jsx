import { MdIcons } from "../assets/Icons/icons";
// form behaviour function when it is called
export const formValidation = (inputs, checkedValue) => {
  // all the error message paragraph code
  let invalidPar = {
    invalidName: document.getElementById("invalidName"),
    invalidCode: document.getElementById("invalidCode"),
    invalidState: document.getElementById("invalidState"),
    invalidCity: document.getElementById("invalidCity"),
    invalidZip: document.getElementById("invalidZip"),
    invalidChoice: document.getElementById("invalidChoice"),
    
  };

  // all the inputs fields
  let inputFields = {
    inputName: document.getElementById("entityName"),
    inputCode: document.getElementById("securityCode"),
    inputState: document.getElementById("state"),
    inputCity: document.getElementById("city"),
    inputZip: document.getElementById("zip"),
    inputOverview : document.getElementById('overview')
  };

  // boolean to check the validity of a input fields
  let isValid = true;

  // Name
  if (inputs.entityName.length <= 1) {
    invalidPar.invalidName.innerHTML = `<span className="invalidId">${""}</span><span>Invalid input</span>`;
    inputFields.inputName.style.border = ".15rem solid #ff0000";
    inputFields.inputName.style.background = "#ff00001f";
    isValid = false;
  } else {
    invalidPar.invalidName.innerHTML = ``;
    inputFields.inputName.style.border = ".15rem solid rgb(177 177 193)";
    inputFields.inputName.style.background = "transparent";
  }

  // overview 
  if(inputs.overview === ""){
    inputFields.inputOverview.style.border = ".15rem solid #ff0000";
    inputFields.inputOverview.style.background = "#ff00001f";
    isValid = false;
  }else{
    inputFields.inputOverview.style.border = "none";
    inputFields.inputOverview.style.borderBottom = ".1rem solid #9a9aa0";
    inputFields.inputOverview.style.background = "transparent";
  }

  // Secutiy code
  if (inputs.securityCode === "") {
    invalidPar.invalidCode.innerHTML = `<span className="invalidId">${""}</span><span>Invalid input</span>`;
    inputFields.inputCode.style.border = ".15rem solid #ff0000";
    inputFields.inputCode.style.background = "#ff00001f";
    isValid = false;
  } else {
    invalidPar.invalidCode.innerHTML = ``;
    inputFields.inputCode.style.border = ".15rem solid rgb(177 177 193)";
    inputFields.inputCode.style.background = "transparent";
  }

  // States
  if (inputs.state === "") {
    invalidPar.invalidState.innerHTML = `<span className="invalidId">${""}</span><span>Invalid input</span>`;
    inputFields.inputState.style.border = ".15rem solid #ff0000";
    inputFields.inputState.style.background = "#ff00001f";
    isValid = false;
  } else {
    invalidPar.invalidState.innerHTML = ``;
    inputFields.inputState.style.border = ".15rem solid rgb(177 177 193)";
    inputFields.inputState.style.background = "transparent";
  }

  // City
  if (inputs.city === "") {
    invalidPar.invalidCity.innerHTML = `<span className="invalidId">${""}</span><span>Invalid input</span>`;
    inputFields.inputCity.style.border = ".15rem solid #ff0000";
    inputFields.inputCity.style.background = "#ff00001f";
    isValid = false;
  } else {
    invalidPar.invalidCity.innerHTML = ``;
    inputFields.inputCity.style.border = ".15rem solid rgb(177 177 193)";
    inputFields.inputCity.style.background = "transparent";
  }

  // Zip
  if (inputs.zip === "") {
    invalidPar.invalidZip.innerHTML = `<span className="invalidId">${""}</span><span>Invalid input</span>`;
    inputFields.inputZip.style.border = ".15rem solid #ff0000";
    inputFields.inputZip.style.background = "#ff00001f";
    isValid = false;
  } else {

    if (inputs.zip.length >= 6 || inputs.zip.length < 5) {
      invalidPar.invalidZip.innerHTML = `<span className="invalidId">${""}</span><span>PLease enter valid zip code</span>`;
      inputFields.inputZip.style.border = ".15rem solid #ff0000";
      inputFields.inputZip.style.background = "#ff00001f";
      isValid = false;
    } else {
      invalidPar.invalidZip.innerHTML = ``;
      inputFields.inputZip.style.border = ".15rem solid rgb(177 177 193)";
      inputFields.inputZip.style.background = "transparent";
    }
  }
  // type dropdown tag i,e Full Time, Part Time etc
  if (checkedValue.length === 0) {
    const selectionPlaceholder = document.getElementById(
      "selectionPlaceholder"
    );
    selectionPlaceholder.style.border = "0.15rem solid red";
    selectionPlaceholder.style.background = "#ff00001f";
    invalidPar.invalidChoice.innerHTML = `<span className="invalidId">${""}</span><span>Please select type</span>`;
    isValid = false;
  } else {
    const selectionPlaceholder = document.getElementById(
      "selectionPlaceholder"
    );
    selectionPlaceholder.style.border = "0.15rem solid rgb(177 177 193";
    selectionPlaceholder.style.background = "transparent";
    invalidPar.invalidChoice.innerHTML = ``;
  }
  return isValid;
};

// function that removes all the text inputs and error messages and al borders
export const normalBorder = () => {
  let invalidPar = {
    invalidName: document.getElementById("invalidName"),
    invalidCode: document.getElementById("invalidCode"),
    invalidState: document.getElementById("invalidState"),
    invalidCity: document.getElementById("invalidCity"),
    invalidZip: document.getElementById("invalidZip"),
    invalidChoice: document.getElementById("invalidChoice"),
  };
  let inputFields = {
    inputName: document.getElementById("entityName"),
    inputCode: document.getElementById("securityCode"),
    inputState: document.getElementById("state"),
    inputCity: document.getElementById("city"),
    inputZip: document.getElementById("zip"),
    inputOverview : document.getElementById('overview')
  };
  const selectionPlaceholder = document.getElementById("selectionPlaceholder");
  selectionPlaceholder.style.border = "0.15rem solid rgb(177 177 193";
  invalidPar.invalidChoice.innerHTML = `<span className="invalidId">${""}</span><span></span>`;
  selectionPlaceholder.style.background = "transparent";
  invalidPar.invalidName.innerHTML = ``;
  inputFields.inputName.style.border = ".15rem solid rgb(177 177 193)";
  inputFields.inputName.style.background = "transparent";
  inputFields.inputOverview.style.border = "none";
  inputFields.inputOverview.style.borderBottom = ".1rem solid #9a9aa0";
  inputFields.inputOverview.style.background = "transparent";
  invalidPar.invalidCode.innerHTML = ``;
  inputFields.inputCode.style.border = ".15rem solid rgb(177 177 193)";
  inputFields.inputCode.style.background = "transparent";
  invalidPar.invalidState.innerHTML = ``;
  inputFields.inputState.style.border = ".15rem solid rgb(177 177 193)";
  inputFields.inputState.style.background = "transparent";
  invalidPar.invalidCity.innerHTML = ``;
  inputFields.inputCity.style.border = ".15rem solid rgb(177 177 193)";
  inputFields.inputCity.style.background = "transparent";
  invalidPar.invalidZip.innerHTML = ``;
  inputFields.inputZip.style.border = ".15rem solid rgb(177 177 193)";
  inputFields.inputZip.style.background = "transparent";
};
