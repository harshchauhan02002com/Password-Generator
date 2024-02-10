const inputSlider = document.querySelector("[data-lengthSlider]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#Numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatebtn");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbol = '`~!@#$%^&*()+=_-{}[]|\/?<>:;';

let password = "";
let passwordLength = 5;
let CheckCount = 0;

handleslider();
// set strength circle color to gray
setIndicator("#ccc")

//set passwordlentgh
function handleslider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";

}


function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function geterateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowercase(){
       return  String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return  String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols(){
    const random = getRndInteger(0, symbol.length);
    return symbol.charAt[random];
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym)&&
        passwordLength >=6
    ) {
        setIndicator('#ff0');
    }else {
        setIndicator('#f00');
    }
}

async function copycontent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    //to make copy wale span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },3000);
}

function sufflePassword(array){
    //fisher yates method
    for(let i = array.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckboxChange() {
    CheckCount = 0;
    allCheckbox.forEach((checkbox) => {
        if(checkbox.checked)
        CheckCount ++;
    });

    //special condition 
    if(passwordLength < CheckCount){
        passwordLength = CheckCount;
        handleslider();
    }
}

allCheckbox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckboxChange)
})

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleslider(e);
})

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
        copycontent();
})

generateBtn.addEventListener('click',() =>{
    //none of the checkbox select
    if(CheckCount <= 0) return;

    if(passwordLength < CheckCount){
        passwordLength = CheckCount;
        handleslider();
    }

//lets start the journey of new password../

//remove old password
password = " ";

// lets put the stuff mentioned checkboxes

// if(uppercaseCheck.checked){
//     password += generateUppercase();
// }

// if(lowercaseCheck.checked){
//     password += generateLowercase();
// }

// if(numbersCheck.checked){
//     password += geterateRandomNumber();
// }

// if(symbolsCheck.checked){
//     password += generateSymbols();
// }

let FuncArr = [];

if(uppercaseCheck.checked)
    FuncArr.push(generateUppercase);

if(lowercaseCheck.checked)
    FuncArr.push(generateLowercase);

if(numbersCheck.checked)
    FuncArr.push(geterateRandomNumber);

if(symbolsCheck.checked)
    FuncArr.push(generateSymbols);

//compulsry addition

for(let i=0; i<FuncArr.length; i++){
    password += FuncArr[i]();
}
console.log("compulsry addition done");

//remaining addition
for(let i=0; i<passwordLength-FuncArr.length; i++){
    let randIndex = getRndInteger(0, FuncArr.length);
    console.log("randIndex" + randIndex);
    password += FuncArr[randIndex]();
}
console.log("remaining addition done");

//suffle the password 
password = sufflePassword(Array.from(password));
console.log("suffling done");
// show in UI
passwordDisplay.value = password;
console.log("UI addition done");
//calculate strength
calcStrength();


});



