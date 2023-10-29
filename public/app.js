window.addEventListener('load', () => {
    // Handle Save Color button click
    document.getElementById('button-color').addEventListener('click', () => {
        let colorName = document.getElementById('favorite-color').value;
        console.log(colorName);

        let obj = { "color": colorName };

        // Convert the object to a JSON string
        let jsonData = JSON.stringify(obj);

        // Send color to the server
        fetch("/save-color", {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: jsonData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Immediately display the new color
            displayColor(colorName);
        })
        .catch(error => {
            console.error("Error sending color:", error);
        });
    });

    // Handle Show Me All My Favorite Colors button click
    document.getElementById('get-tracker').addEventListener('click', () => {
        fetchColors();
    });

    // Load and display colors when the page is loaded
    fetchColors();
});

// Fetch colors from the server and display them
function fetchColors() {
    fetch("/get-colors")
    .then(response => response.json())
    .then(data => {
        const colorsDiv = document.getElementById('all-colors');
        colorsDiv.innerHTML = ''; // Clear existing colors
        console.log(data.colors);
        // Display colors with the newest first
        data.colors.reverse().forEach(color => {
            displayColor(color);
        });
    })
    .catch(error => {
        console.error("Error fetching colors:", error);
    });
}

// Display a color box
function displayColor(colorName) {
    const colorsDiv = document.getElementById('all-colors');
    let colorBox = document.createElement('div');
    colorBox.innerHTML = colorName;
    colorBox.style.backgroundColor = colorName;
    colorBox.className = 'color-box';
    colorsDiv.appendChild(colorBox);
}
