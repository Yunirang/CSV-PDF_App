const convert = document.querySelector("#convertor");
const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#file-input");
const fileInputName = document.querySelector("#fileInputName");
const convertButton = document.querySelector("#convert-button");
const dotPulse = document.querySelector(".dot-pulse");
const dropColor = document.getElementById("drop-zone");
const statusText = document.querySelector(".dropzone-bottom-text");
const nightModeButton = document.getElementById("tooglenight");
const mainBody = document.querySelector('body');
const headerTextCol = document.querySelector(".header-text");
const inputFileSt = document.querySelector("#inputFileStyle");
const amogusSus = document.querySelector(".amogus");


let nightModeStatus = false;


//send file path to main.js to generate pdfs
function urlToPdf(path) {
    console.log("Converting...");
    console.log(path);
    console.log(typeof(path));
    ipcRenderer.send('load:CsvFile', path);
}

ipcRenderer.on("start-loading", () => {
    // Trigger the loading animation here
    // For example, you can add or remove a CSS class to start or stop the animation
    
    dotPulse.classList.remove("invisible");
    statusText.textContent = "Converting...";


});


ipcRenderer.on("end-loading", () =>{
    dotPulse.classList.add("invisible");
    statusText.textContent = "Drag and drop files here";
    fileInputName.textContent = "";
})


// Variable to track if the button is currently on cooldown
let isButtonCooldown = false;
let selectedFilePath = null; // Track the selected file path

// Function to check if the file has a CSV extension
function hasCsvExtension(fileName) {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return fileExtension === 'csv';
}

// Function to handle file selection and set the selected file path
function handleFileSelection(file) {
    console.log("filepath of dragged files: ", file.path);
    console.log("I have the file", file.path);
    fileInputName.textContent = file.name;
    selectedFilePath = file.path;
}

//Event listeners for drag and drop including dragover, dragcenter, and dragleave which check if the file is in the drop space, if the file has left the drop space, and if the file is being dragged over the drop space respectively
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropColor.style.backgroundColor = '#e86823';

});


document.addEventListener("dragcenter", (e) => {
    console.log("File is in the drop space");
    dropColor.style.backgroundColor = '#F77E3E';
});

document.addEventListener("dragleave", (e) => {
    console.log("file has left the drop space");
    dropColor.style.backgroundColor = '#F77E3E';
});

// Event listener for when a file is dropped into the drop space, and then the file path is sent as an argument to the urlToPdf function
document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropColor.style.backgroundColor = '#F77E3E';
    const droppedFile = e.dataTransfer.files[0];
    if (hasCsvExtension(droppedFile.name)) {
        handleFileSelection(droppedFile);
        convertButton.removeAttribute('disabled');
    } else {
        alert("The file you dropped is not a CSV file. Please try again.");
    }
});



// Event listener for the convert button
if (convert) {
    convert.addEventListener("click", () => {
        if (!isButtonCooldown && selectedFilePath && hasCsvExtension(selectedFilePath)) {
            isButtonCooldown = true;
            // Set a cooldown period of 5 seconds (adjust as needed)
            setTimeout(() => {
                isButtonCooldown = false;
            }, 10625);
            urlToPdf(selectedFilePath);

        } else if (isButtonCooldown) {
            alert("Please wait a few moments before trying to convert again.");
        }
    });
}

// nightmode interactions

if (nightModeButton) {
    nightModeButton.addEventListener("click", () => {

        // nightmode
        if(!nightModeStatus){

            nightModeStatus = true;
            mainBody.style.backgroundColor= "#2b2b2b";
            headerTextCol.style.color="white";
            inputFileSt.style.color="white";
            console.log("It is day time");

        // brightmode
        } else {

            nightModeStatus = false;
            mainBody.style.backgroundColor = "#ffffff";
            headerTextCol.style.color="black";
            inputFileSt.style.color="black";
            console.log("It is nightMode");
        }
        
    })
}
// Event listener for the file input dialog
fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
        handleFileSelection(selectedFile);
        dropColor.style.backgroundColor = '#F77E3E';
        convertButton.removeAttribute('disabled');
    }
});





 