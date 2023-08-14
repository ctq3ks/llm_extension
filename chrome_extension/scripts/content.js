function gatherContext(inputElement) {
    const context = {
    previousLines: [],
    currentLine: '',
    parentTitles: [],
    parentHeadings: [],
    parentContent: []
    };

    // Split input value by newlines to get lines
    const lines = inputElement.value.split('\n');

    // Get current line and previous lines
    for (let i = lines.length - 2; i >= 0; i--) {
    context.previousLines.unshift(lines[i].trim());
    }
    
    // Get current line
    context.currentLine = lines[lines.length - 1].trim();

    // Traverse parents and collect titles, headings, and content
    let parentElement = inputElement.parentElement;
    while (parentElement) {
    if (parentElement.tagName === 'HTML') {
        break;
    }
    if (parentElement.title) {
        context.parentTitles.push(parentElement.title);
    }
    if (parentElement.tagName.match(/^H\d$/i)) {
        context.parentHeadings.push(parentElement.innerText);
    }
    context.parentContent.push(parentElement.innerText);
    parentElement = parentElement.parentElement;
    }

    return context;
}

// Listen for keyboard events and modify user input in real-time
document.addEventListener('input', event => {

    const inputElement = event.target;
    // this is for a div
    const inputValue = inputElement.textContent;
    // this is for a textarea
    // const inputValue = inputElement.value;
    const command = '//gen'

    if (inputValue.includes(command)) {
        // Extract context from the page
        // const context = gatherContext(inputElement);
        // const contextJson = JSON.stringify(context);

        // What you really want is general context about the page used to inform the next paragraph you
        // want to generate, but the "question" or direct prompt is the previous and current line of the
        // current input area. AND any titles, headings, and content of the last two parent elements

        // Send context to your API endpoint
        // fetch('YOUR_API_ENDPOINT_URL', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ context: pageContent })
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //     const generatedResponse = `"${data.response}"`;
        //     })
        //     .catch(error => {
        //     console.error('Error:', error);
        // });

        const generatedResponse = "This is a sample response";

        const tabKeyCode = 9;
        const deleteKeyCode = 8;

        const handleKeyPress = event => {
            if (event.keyCode === tabKeyCode) {
                event.preventDefault();
                
                // Get the generatedResponse div
                const generatedResponseDiv = document.getElementById('generatedResponse');
                generatedResponseDiv.innerHTML = generatedResponse;

                // Set the cursor at the end of the text
                const newRange = document.createRange();
                const endTextNode = generatedResponseDiv.childNodes[0];
                newRange.setStart(endTextNode, endTextNode.length);
                newRange.setEnd(endTextNode, endTextNode.length);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(newRange);

                // Remove the id attribute, so that this code works again
                generatedResponseDiv.removeAttribute('id');

                inputElement.removeEventListener('keydown', handleKeyPress);

            } else if (event.keyCode === deleteKeyCode){
                event.preventDefault();
                // Get the generatedResponse div
                const generatedResponseDiv = document.getElementById('generatedResponse');
                generatedResponseDiv.remove();

                inputElement.removeEventListener('keydown', handleKeyPress);
            } else {
                // Handle all other keys
                const generatedResponseDiv = document.getElementById('generatedResponse');
                if (generatedResponseDiv) {
                    generatedResponseDiv.remove();
                }
                inputElement.removeEventListener('keydown', handleKeyPress);
            }

        };
        // Get the innerHTML of the div
        const divContent = inputElement.innerHTML;

        // Find the index of the marker
        const markerIndex = divContent.indexOf(command);

        // Get the current cursor position relative to the marker
        const selection = window.getSelection();
        const cursorOffset = selection.focusOffset - markerIndex;

        // Extract the HTML content before the marker
        const htmlBeforeMarker = markerIndex !== -1 ? divContent.substring(0, markerIndex) : divContent;

        // Extract the HTML content after the marker
        const htmlAfterMarker = markerIndex !== -1 ? divContent.substring(markerIndex + command.length) : '';

        // Concatenate the content with generatedResponse
        const concatenatedHtml = `${htmlBeforeMarker}<p style="display:inline" id="generatedResponse"><i>${generatedResponse}</i></p>${htmlAfterMarker}`;


        inputElement.innerHTML = concatenatedHtml;

        // Get the generatedResponse div
        const generatedResponseDiv = document.getElementById('generatedResponse');

        // Set the new cursor position at the beginning of the generatedResponse div
        const newRange = document.createRange();
        newRange.setStart(generatedResponseDiv.firstChild, 0);
        newRange.setEnd(generatedResponseDiv.firstChild, 0);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        inputElement.addEventListener('keydown', handleKeyPress);

        //MAYBE ADD A TIMEOUT FOR THE SUGESTED PROMPT

    };
});
  