const versionNumber = '1.0.0.0';

const loadTime = 4000;
const updateTime = 4000;
const greenBoxCheck = 1500;
const updateloadTime = 10000;

let popup = document.getElementById("popup");
        function openPopup() {
            popup.classList.add("open-popup");
        }
        function closePopup() {
            popup.classList.remove("open-popup");
            location.reload();
        }

        let flashState = true; // Initialize flash state
                const videoElement = document.getElementById('myVideo');
                const container = $('.container');
        function toggleBackground() {
            if (flashState) {
                videoElement.style.display = 'none'; // Hide video
                flashState = false;
            } else {
                videoElement.style.display = 'block'; // Show video
                flashState = true;
            }
        }

        document.getElementById('toggleBackgroundButton').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission
            toggleBackground();
        });
    

        document.getElementById('closeButton').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission
            closeManifest();
        });

        const version = document.getElementById('version');
if (version) {
    version.textContent = `V${versionNumber}`;
}

        function closeManifest() {
        document.getElementById('generatedManifestTitle').style.display = 'none';
        document.getElementById('generatedManifest').style.display = 'none';
        document.getElementById('downloadButton').style.display = 'none';
        document.getElementById('closeButton').style.display = 'none';
        document.getElementById('copyButton').style.display = 'none';
    }

        function addDataFileEntry() {
        const dataFilesContainer = document.getElementById('dataFilesContainer');
        const dataFileEntry = document.createElement('div');
        dataFileEntry.classList.add('dataFileEntry');
        dataFileEntry.innerHTML = `
            <label for="dataFile">Resource Data File:</label>
            <select class="dataFileType" name="dataFileType" required onchange="updatePlaceholder(this)">
                <option value="" disabled selected>Select Data File Type</option>
                <option value="VEHICLE_METADATA_FILE">vehicles.meta</option>
                <option value="CARCOLS_FILE">carcols.meta</option>
                <option value="VEHICLE_VARIATION_FILE">carvariations.meta</option>
                <option value="HANDLING_FILE">handling.meta</option>
                <option value="CONTENT_UNLOCKS_FILE">contentunlocks.meta</option>
                <option value="DLC_TEXT_FILE">dlctext.meta</option>
                <option value="VEHICLE_LAYOUTS_FILE">vehiclelayouts.meta</option>
                <option value="WEAPON_METADATA_FILE">weaponarchetypes.meta</option>
                <option value="WEAPONINFO_FILE">vehicleweapons.meta</option>
                <option value="EXPLOSION_INFO_FILE">explosion.meta</option>
                <option value="EXPLOSIONFX_FILE">explosion.dat</option>
            </select>
            <b>Required</b>
            <input type="text" style="dataFilePath" class="dataFilePath" name="dataFilePath" required><br><br>
            <button type="button" onclick="removeDataFileEntry(this)">Remove</button><br><br>
            `;
        dataFilesContainer.appendChild(dataFileEntry);
    }

    
        function removeDataFileEntry(button) {
            const dataFileEntry = button.parentNode;
            dataFileEntry.parentNode.removeChild(dataFileEntry);
        }
    
        function updatePlaceholder(selectElement) {
            const inputField = selectElement.parentNode.querySelector('.dataFilePath, .filePath');
            const selectedFileType = selectElement.value;
            switch (selectedFileType) {
                case 'VEHICLE_METADATA_FILE':
                    inputField.value = 'vehicles.meta';
                    break;
                case 'CARCOLS_FILE':
                    inputField.value = 'carcols.meta';
                    break;
                case 'VEHICLE_VARIATION_FILE':
                    inputField.value = 'carvariations.meta';
                    break;
                case 'HANDLING_FILE':
                    inputField.value = 'handling.meta';
                    break;
                case 'CONTENT_UNLOCKS_FILE':
                    inputField.value = 'contentunlocks.meta';
                    break;                    
                case 'DLC_TEXT_FILE':
                    inputField.value = 'dlctext.meta';
                    showAlert('MediumSeaGreen', 'Notification', inputField.value + " isn't needed for FiveM, it’s only needed for singleplayer. But you can still use it")
                    break;   
                case 'VEHICLE_LAYOUTS_FILE':
                    inputField.value = 'vehiclelayouts.meta';
                    break;  
                case 'WEAPON_METADATA_FILE':
                    inputField.value = 'weaponarchetypes.meta';
                    break;             
                case 'WEAPONINFO_FILE': 
                    inputField.value = 'vehicleweapons.meta';
                    break;
                case 'EXPLOSION_INFO_FILE': 
                    inputField.value = 'explosion.meta';
                    break;  
                case 'EXPLOSIONFX_FILE': 
                    inputField.value = 'explosion.dat';
                    break;
                default:
                    inputField.value = '';
                    break;
            }
        }

        function showAlert(color, title, msg) {
            const alertBox = document.createElement('div');
            alertBox.className = 'custom-alert';
            alertBox.innerHTML = `
            <h3 style="color: ${color}; text-align=center;">${title}</h3>
            <p>${msg}</p>
            <button onclick="document.body.removeChild(this.parentElement)">OK</button>
            `;
            document.body.appendChild(alertBox);
  }
    
        function generateManifest() {
            const fxVersionInput = document.getElementById('fx_version_input');
            const fxVersion = fxVersionInput.value.trim();
            const version = document.getElementById('version').value.trim();
            const author = document.getElementById('author').value.trim();
            let scriptIn;
            if (document.getElementById('includeVehicleNames').checked) {
                scriptIn = 'vehicleNames.lua';
            }
            const name = document.getElementById('name').value.trim();
            const description = document.getElementById('description').value.trim();

            const dataFileEntries = [];
            const dataFileSelectors = document.querySelectorAll('.dataFileType');
            const dataFilePaths = document.querySelectorAll('.dataFilePath');

            dataFileSelectors.forEach((selector, index) => {
                const fileType = selector.value;
                const filePath = dataFilePaths[index].value.trim();
                if (fileType && filePath) {
                    dataFileEntries.push(`data_file '${fileType}' '${filePath}'`);
                }
            });

            const filePathEntries = [];
            const filePathInputs = document.querySelectorAll('.filePath');
            filePathInputs.forEach((input, index) => {
                const filePath = input.value.trim();
                if (filePath) {
                    filePathEntries.push(`'${filePath}',`);
                }
            });

            dataFilePaths.forEach(filePath => {
                const filePathValue = filePath.value.trim();
                if (filePathValue) {
                    filePathEntries.push(`'${filePathValue}',`);
                }
            });

            const filesSection = `files {\n${filePathEntries.join('\n')}\n}`;

            const manifest = fxVersion ? `fx_version '${fxVersion}'` : "fx_version 'cerulean'";
            const gameInfo = `game 'gta5'\n`;
            const nameInfo = name ? `name '${name}'` : '';
            const descriptionInfo = description ? `description '${description}'` : '';
            const authorInfo = author ? `author '${author}'\n` : '';
            const scriptInfo = scriptIn ? `client_script '${scriptIn}'\n` : '';

            function validateVersion(version) {
                const pattern = /^\d+(\.\d+)*$/;
                let versionInfo;
                
                if (pattern.test(version)) {
                    versionInfo = version ? `version '${version}'` : '';
                } else {
                    showAlert('Red', 'Error', 'Invalid resource version number. Please enter a valid resource version (e.g., 1.0.0).\n You may also proceed without specifying a resource version.');
                    versionInfo = "";
                }

                return versionInfo;
            }

            const versionInput = document.getElementById('version').value;
            const validatedVersion = validateVersion(versionInput);

            const generatedManifest = `${manifest}\n${gameInfo}\n${validatedVersion}\n${nameInfo}\n${descriptionInfo}\n${authorInfo}\n${scriptInfo}\n\n${filesSection}\n\n${dataFileEntries.join('\n')}\n\n-- Made with VEHICLE FXMANIFEST GENERATOR by Code Master`;

            document.getElementById('generatedManifestTitle').style.display = 'block';
            document.getElementById('generatedManifest').style.display = 'block';
            document.getElementById('downloadButton').style.display = 'block';
            document.getElementById('closeButton').style.display = 'block';
            document.getElementById('copyButton').style.display = 'inline-block';
            document.getElementById('generatedManifest').textContent = generatedManifest;

            const blob = new Blob([generatedManifest], { type: 'text/plain' });
            const downloadLink = document.getElementById('downloadButton');
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = `fxmanifest.lua`;
            downloadLink.style.display = 'block';

 //           $('.container').style.boxShadow = "0 0 20px rgba(0, 255, 0, 1.0)";
 //       setTimeout(() => {
 //           $('.container').style.boxShadow = "none";
 //       }, updateloadTime); 
        }

        document.getElementById('copyButton').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission
            const generatedManifestElement = document.getElementById('generatedManifest');
            const manifestContent = generatedManifestElement.textContent;

            navigator.clipboard.writeText(manifestContent).then(function() {
                showAlert('MediumSeaGreen', 'Clipboard', "Manifest copied to clipboard!")
            }, function(err) {
                showAlert('Red', 'Clipboard', "Could not copy text: ", err)
            });
        });

        document.cookie = "name=value; SameSite=Strict";

document.addEventListener("DOMContentLoaded", function() {
window.onload = function() {
    document.body.scrollTop = 0;
};

var loadingProgress = document.getElementById('loading-progress2');     
var duration = loadTime;
var start = 0;
var end = 100;
var range = end - start;
var current = start;
var increment = end > start ? 1 : -1;
var stepTime = Math.abs(Math.floor(duration / range));
var stepTime2 = 10 * Math.abs(Math.floor(duration / range));

function animateLoading() {
    var timer = setInterval(function() {
        if (current > 60 && current < 70) {
            setTimeout(function() {
                current += increment;
                loadingProgress.textContent = current;
            }, stepTime2);
        } else {
            current += increment;
            loadingProgress.textContent = current;
        }

        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

animateLoading();

});