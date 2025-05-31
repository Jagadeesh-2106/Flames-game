document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const firstNameInput = document.getElementById('firstName');
    const secondNameInput = document.getElementById('secondName');
    const resultDisplay = document.getElementById('resultDisplay');
    const body = document.body;

    // --- GOOGLE FORM CONFIGURATION ---
    // This is the URL where your Google Form accepts submissions.
    // It's derived from your pre-filled link by changing 'viewform' to 'formResponse'.
    const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScW5hKOq39vmhPVtrBicTu2uPME7xE2mLROZnwBVMGtT7GrNQ/formResponse';


    // These are the unique 'entry.XXXXXXXXX' IDs for each field in your Google Form.
    // I've extracted these from the pre-filled link you provided.
    const ENTRY_FIRST_NAME = 'entry.2111534092';
    const ENTRY_SECOND_NAME = 'entry.618009193';
    const ENTRY_RELATIONSHIP = 'entry.17396512';
    // The ENTRY_TOTAL_CHARS constant has been removed as per your request.
    // --- END GOOGLE FORM CONFIGURATION ---


    // Function to count character occurrences
    function countCharacters(str) {
        const counts = {};
        for (const char of str) {
            counts[char] = (counts[char] || 0) + 1;
        }
        return counts;
    }

    // Define relationship mappings with GIF URLs and background colors
    const relationshipData = {
        'F': {
            name: 'Friends',
            gif: 'https://media1.tenor.com/m/ZUX1Y1mVah8AAAAd/friends-hug.gif',
            bgColor: '#e8d08a'
        },
        'L': {
            name: 'Love',
            gif: 'https://media1.tenor.com/m/dzBn25ddNd8AAAAC/love-heart.gif',
            bgColor: '#f44969'
        },
        'A': {
            name: 'Affection',
            gif: 'https://media1.tenor.com/m/6iJLfK4wlokAAAAC/yubisaki-to-renren-a-sign-of-affection.gif',
            bgColor: '#a2b7f0'
        },
        'M': {
            name: 'Marriage',
            gif: 'https://media1.tenor.com/m/NLDUa1Xd2W8AAAAC/divyanka-tripathi-vivek-dahiya.gif',
            bgColor: '#e68a4b'
        },
        'E': {
            name: 'Enemy',
            gif: 'https://media1.tenor.com/m/nsyHEMqHOccAAAAd/rule-816-rules.gif',
            bgColor: '#d8d8f2'
        },
        'S': {
            name: 'Siblings',
            gif: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDkwaWdnaXc1ejdkdWNrbzV4c2YzaGtsaHdzeXd3M3JuN2xoNXVpaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1wmaVjEjihSSVwU9XZ/giphy.gif',
            bgColor: '#3a3c2f'
        }
    };

    // Function to send data to Google Form
    // This function constructs the URL and sends a GET request to Google Forms.
    // The 'mode: no-cors' is crucial for this type of cross-origin submission.
    function sendDataToGoogleForm(firstName, secondName, relationship) { // Removed totalChars parameter
        const data = new URLSearchParams();
        data.append(ENTRY_FIRST_NAME, firstName);
        data.append(ENTRY_SECOND_NAME, secondName);
        data.append(ENTRY_RELATIONSHIP, relationship);
        // The totalChars parameter and its associated logic have been removed from here.
        
        // Construct the full URL with data
        const formUrl = `${GOOGLE_FORM_ACTION_URL}?${data.toString()}`;

        // Send the data using fetch
        fetch(formUrl, {
            method: 'GET', // Google Forms submissions via pre-filled links are GET requests
            mode: 'no-cors' // Allows cross-origin requests to Google Forms without CORS issues
        })
        .then(() => {
            console.log('Data sent to Google Form successfully!');
        })
        .catch(error => {
            console.error('Error sending data to Google Form:', error);
        });
    }


    calculateBtn.addEventListener('click', function() {
        // Store original inputs for sending to form before processing
        const originalFirstName = firstNameInput.value;
        const originalSecondName = secondNameInput.value;

        let firstName = originalFirstName.toUpperCase().replace(/\s/g, '');
        let secondName = originalSecondName.toUpperCase().replace(/\s/g, '');

        // Clear previous results and GIFs
        resultDisplay.innerHTML = '';
        resultDisplay.classList.remove('friends', 'love', 'affection', 'marriage', 'enemy', 'siblings', 'error-message');
        body.style.backgroundColor = '#e0f2f7'; // Reset body background

        // Basic input validation
        if (!firstName || !secondName) {
            resultDisplay.textContent = "Please enter both names!";
            resultDisplay.classList.add('error-message');
            // Send empty/error data to form (totalCount parameter removed)
            sendDataToGoogleForm(originalFirstName, originalSecondName, "Input Error");
            return;
        }

        // Deep copy the names to work with for character removal
        let tempFirstName = Array.from(firstName);
        let tempSecondName = Array.from(secondName);

        // Calculate character counts for removal logic
        const name1Counts = countCharacters(firstName);
        const name2Counts = countCharacters(secondName);

        // Refined common character removal (mimics your Python's replace(char, '', 1))
        for (const char in name1Counts) {
            if (name2Counts[char]) { // If char exists in both names
                let minCount = Math.min(name1Counts[char], name2Counts[char]);
                for (let i = 0; i < minCount; i++) {
                    const index1 = tempFirstName.indexOf(char);
                    if (index1 !== -1) tempFirstName.splice(index1, 1);
                    
                    const index2 = tempSecondName.indexOf(char);
                    if (index2 !== -1) tempSecondName.splice(index2, 1);
                }
            }
        }

        const remainingFirstName = tempFirstName.join('');
        const remainingSecondName = tempSecondName.join('');

        const totalCount = remainingFirstName.length + remainingSecondName.length;

        let finalRelationshipText;
        if (totalCount === 0) { // Edge case where all characters cancel out
            finalRelationshipText = "All characters cancelled out (No specific relationship)";
            resultDisplay.textContent = finalRelationshipText;
            resultDisplay.style.color = '#6c757d'; // Grey for neutral
            // Send data to Google Form (totalCount parameter removed)
            sendDataToGoogleForm(originalFirstName, originalSecondName, finalRelationshipText);
            return;
        }

        let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
        let currentIndex = 0;

        while (flames.length > 1) {
            currentIndex = (currentIndex + totalCount - 1) % flames.length;
            flames.splice(currentIndex, 1); // Remove the character at the calculated index
        }

        const finalLetter = flames[0];
        const resultData = relationshipData[finalLetter];

        if (resultData) {
            finalRelationshipText = resultData.name;
            // Update result text
            resultDisplay.textContent = `Relationship is: ${finalRelationshipText}`;

            // Add class for specific text color (from CSS)
            resultDisplay.classList.add(finalRelationshipText.toLowerCase()); // e.g., 'love', 'friends'

            // Change body background color
            body.style.backgroundColor = resultData.bgColor;
            resultDisplay.style.color = resultData.bgColor; // Also apply to text

            // Create and append GIF
            const gifElement = document.createElement('img');
            gifElement.src = resultData.gif;
            gifElement.alt = `${finalRelationshipText} GIF`;
            gifElement.classList.add('result-gif');
            resultDisplay.appendChild(gifElement);
            
            // Handle potential GIF loading errors
            gifElement.onerror = function() {
                console.error("Error loading GIF:", resultData.gif);
                resultDisplay.textContent = `Relationship is: ${finalRelationshipText} (GIF failed to load)`;
                resultDisplay.classList.add('error-message'); // Use error styling
                body.style.backgroundColor = '#f0f8ff'; // Fallback background
                resultDisplay.style.color = '#dc3545'; // Fallback text color
            };

            // --- SEND DATA TO GOOGLE FORM HERE ---
            sendDataToGoogleForm(originalFirstName, originalSecondName, finalRelationshipText); // totalCount parameter removed

        } else {
            finalRelationshipText = "Error: Could not determine relationship.";
            resultDisplay.textContent = finalRelationshipText;
            resultDisplay.classList.add('error-message');
            // Send error data to form (totalCount parameter removed)
            sendDataToGoogleForm(originalFirstName, originalSecondName, finalRelationshipText);
        }
    });
});
