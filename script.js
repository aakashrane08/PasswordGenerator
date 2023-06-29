const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_-+={}[]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `1px 1px 25px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123))
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91))
}

function generateSymbol() {
    const rndNum = getRndInteger(0, symbols.length);
    return symbols.charAt(rndNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false; 
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true; 
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed"
    }

    // to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {

    //Fisher Yates Method
    for (let i=array.length-1; i>0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        const temp = array[i]; 
        array[i] = array[j]; 
        array[j] = temp;
    }
    let str="";  
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount=0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
        checkCount++;
    })

    // special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange);
})

// Event Listner 
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click', () => {
    // none of the checkbox are slected
    if(checkCount == 0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // journey to new password
    console.log("Starting the Journey")
    //remove old password
    password="";

    // let put the stuff mentioned by checkboxes //

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funArr = [];

    if(uppercaseCheck.checked)
    funArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
    funArr.push(generateLowerCase);

    if(numbersCheck.checked)
    funArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
    funArr.push(generateSymbol);

    // compulsory addition
    for(let i=0; i<funArr.length; i++) {
        password += funArr[i]();
    }
    console.log("Compulsory Addition done")

    // remaining addition
    for(let i=0; i<passwordLength-funArr.length; i++) {
        let rndIndex = getRndInteger(0, funArr.length);
        console.log("rndIndex" + rndIndex);
        password += funArr[rndIndex](); 
    }
    console.log("Remaining Addition Done")

    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling Done")

    // show in ui
    passwordDisplay.value = password;
    console.log("UI Addition Done")
    // calculate strength
    calcStrength();
})