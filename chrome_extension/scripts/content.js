// Add an event listener for the page load event
window.addEventListener("load", async () => {
  // Check if the user is authenticated or needs to log in
  const isAuthenticated = await checkAuthentication();

  if (!isAuthenticated) {
    // Redirect the user to the Cognito login page
    const access_token = await requestAccessToken();
    console.log(access_token);
    storeAccessToken(access_token);
  } else {
    // User is authenticated, proceed with your logic
    const accessToken = await getStoredAccessToken();
    // Use the access token for API calls or store it securely
    console.log("Access Token:", accessToken);
  }
});

async function checkAuthentication() {
  const accessToken = getStoredAccessToken();

  if (accessToken) {
    // Check if the access token is expired
    const isExpired = await isTokenExpired(accessToken);
    return !isExpired; // Return true if token is not expired
  }

  return false; // No token found, user is not authenticated
}

function getStoredAccessToken() {
  // Retrieve the token from the cookie
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "aissistant_access_token") {
      return value;
    }
  }
  return null;
}

async function requestAccessToken() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append(
    "Authorization",
    "Basic N2pjOTRsZ2ZzMWpldXVscjNkaTY0bm1jZHU6MW02aGF2OTF1NXZlaGcwdTM5ZTQwaGJhdGVhaDJ0NHFjZDRyYTk1ODdoZGExNnN2dnVhaA=="
  );
  myHeaders.append("Cookie", "XSRF-TOKEN=63dce702-8af1-4a0d-83e4-767e34126025");

  var urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://aissistant-523349124581.auth.us-east-1.amazoncognito.com/oauth2/token",
      requestOptions
    );
    const data = await response.json();
    const accessToken = data.access_token;
    return accessToken;
  } catch (error) {
    console.log("error", error);
    throw error; // Re-throw the error to be caught by caller
  }
}

function storeAccessToken(token) {
  // Store the token as a cookie
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // Set expiration time
  document.cookie = `aissistant_access_token=${token}; expires=${expires.toUTCString()}; path=/`;
}

// Here's a simplified example of what a decoding function might look like
function decodeJWT(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

async function isTokenExpired(token) {
  try {
    // Decode the JWT token (You'll need a library to decode JWT, like 'jsonwebtoken')
    const decodedToken = decodeJWT(token);

    // Get the expiration time from the decoded token
    const expirationTimestamp = decodedToken.exp * 1000; // Convert to milliseconds

    // Compare the expiration time with the current time
    const currentTime = Date.now();
    return currentTime >= expirationTimestamp; // Return true if token is expired
  } catch (error) {
    console.error("Error decoding or checking token:", error);
    return true; // Treat any error as token expired for safety
  }
}

function gatherSequentialTextFromInputsAndSpans(element) {
  let content = "";
  let parentCount = 0;
  let currentElement = element.parentElement;

  while (currentElement && parentCount < 15) {
    currentElement = currentElement.parentElement;
    parentCount++;
  }

  content = gatherChildTextFromInputsAndSpans(currentElement, content);

  console.log("content");
  console.log(content);
  return content.trim();
}

function gatherChildTextFromInputsAndSpans(element, content) {
  const inputAndSpanElements = element.querySelectorAll("input, span");

  for (const element of inputAndSpanElements) {
    if (element.tagName === "INPUT") {
      let text = element.value;
      if (text != null || text != "--") {
        content += text;
      }
    } else if (element.tagName === "SPAN") {
      let text = element.textContent.trim();
      if (text != null || text != "--") {
        content += text;
      }
    }
  }
  return content;
}

function gatherContext(inputElement) {
  const context = {
    inputElementContent: "",
    parentElementsContent: "",
  };

  const parts = inputElement.textContent.split("//gen");
  context.inputElementContent = parts[0].trim();
  console.log("context.inputElementContent" + context.inputElementContent);

  context.parentElementsContent =
    gatherSequentialTextFromInputsAndSpans(inputElement);
  console.log(
    "context.parentElementsContent: " + context.parentElementsContent
  );

  // Traverse parents and collect titles and content
  // let parentElement = inputElement.parentElement;
  // while (parentElement && parentElement.tagName !== "HTML") {
  //   const parentInfo = {
  //     title: parentElement.title || "",
  //     content: parentElement.innerText
  //       .trim()
  //       .replace(/\s+/g, " ")
  //       .slice(0, 500), // Limit content length
  //   };
  //   context.parentInfo.push(parentInfo);
  //   parentElement = parentElement.parentElement;
  // }

  // // Collect header elements and input field values
  // const headerTags = ["H1", "H2", "H3", "H4", "H5", "H6"];
  // const inputTags = ["INPUT", "TEXTAREA"];

  // // Collect inner HTML of headers
  // headerTags.forEach((tag) => {
  //   const headerElements = document.getElementsByTagName(tag);
  //   for (const headerElement of headerElements) {
  //     context.headers.push(headerElement.innerHTML.trim());
  //   }
  // });

  // let parentElement = inputElement.parentElement;
  // let parentsCollected = 0;

  // while (
  //   parentElement &&
  //   parentElement.tagName !== "HTML" &&
  //   parentsCollected < 3
  // ) {
  //   context.parentElementsContent.push(parentElement.innerText);

  //   parentsCollected++;
  // }

  // // Collect values of input fields and text areas
  // inputTags.forEach((tag) => {
  //   const inputElements = document.getElementsByTagName(tag);
  //   for (const inputElement of inputElements) {
  //     context.headers.push(inputElement.value.trim());
  //   }
  // });

  // Limit the length of gathered content
  // const maxContentLength = 500; // Adjust as needed
  // context.inputElementContent = context.inputElementContent.slice(0, maxContentLength);
  // context.parentInfo = context.parentInfo.map((content) =>
  //   content.slice(0, maxContentLength)
  // );

  return context;
}

// Listen for keyboard events and modify user input in real-time
document.addEventListener("input", async (event) => {
  const inputElement = event.target;
  // this is for a div
  const inputValue = inputElement.textContent;
  // this is for a textarea
  // const inputValue = inputElement.value;
  const command = "//gen";

  const tabKeyCode = 9;
  const deleteKeyCode = 8;

  const handleKeyPress = (event) => {
    if (event.keyCode === tabKeyCode) {
      event.preventDefault();

      console.log("generatedResponseText");
      console.log(generatedResponseText);

      // Get the generatedResponse div
      const generatedResponseP = document.getElementById("generatedResponseID");
      console.log(generatedResponseP.innerHTML);
      generatedResponseP.innerHTML = `${generatedResponseText}`;

      // Set the cursor at the end of the text
      const newRange = document.createRange();
      const endTextNode = generatedResponseP.childNodes[0];

      newRange.setStart(endTextNode, endTextNode.length);
      newRange.setEnd(endTextNode, endTextNode.length);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(newRange);

      // Remove the id attribute, so that this code works again
      generatedResponseP.removeAttribute("id");

      inputElement.removeEventListener("keydown", handleKeyPress);
    } else if (event.keyCode === deleteKeyCode) {
      event.preventDefault();
      // Get the generatedResponse div
      const generatedResponseP = document.getElementById("generatedResponseID");
      generatedResponseP.remove();

      inputElement.removeEventListener("keydown", handleKeyPress);
    } else {
      // Handle all other keys
      const generatedResponseP = document.getElementById("generatedResponseID");
      if (generatedResponseP) {
        generatedResponseP.remove();
      }
      inputElement.removeEventListener("keydown", handleKeyPress);
    }
  };

  if (inputValue.includes(command)) {
    // Extract context from the page
    const context = gatherContext(inputElement);
    const contextJson = JSON.stringify(context);

    console.log(contextJson);

    access_token = getStoredAccessToken();

    // What you really want is general context about the page used to inform the next paragraph you
    // want to generate, but the "question" or direct prompt is the previous and current line of the
    // current input area. AND any titles, headings, and content of the last two parent elements

    var generatedResponseText = "Not enough context was provided.";

    // Send context to your API endpoint
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: access_token,
      },
      body: contextJson,
    };

    try {
      const response = await fetch(
        "https://jamzlxazmj.execute-api.us-east-1.amazonaws.com/dev/postChatGPT",
        requestOptions
      );
      const responseJson = await response.json();
      generatedResponseText = responseJson["body"];
    } catch (error) {
      console.log("error", error);
      throw error; // Re-throw the error to be caught by caller
    }

    // Get the innerHTML of the div
    const divContent = inputElement.innerHTML;

    // Find the index of the marker
    const markerIndex = divContent.indexOf(command);

    // Get the current cursor position relative to the marker
    const selection = window.getSelection();
    const cursorOffset = selection.focusOffset - markerIndex;

    // Extract the HTML content before the marker
    const htmlBeforeMarker =
      markerIndex !== -1 ? divContent.substring(0, markerIndex) : divContent;

    // Extract the HTML content after the marker
    const htmlAfterMarker =
      markerIndex !== -1
        ? divContent.substring(markerIndex + command.length)
        : "";

    // Concatenate the content with generatedResponseText
    const concatenatedHtml = `${htmlBeforeMarker}<p style="display:inline" id="generatedResponseID"><i>${generatedResponseText}</i></p>${htmlAfterMarker}`;

    inputElement.innerHTML = concatenatedHtml;

    // Get the generatedResponse div
    const generatedResponseP = document.getElementById("generatedResponseID");

    // Set the new cursor position at the beginning of the generatedResponse div
    const newRange = document.createRange();
    newRange.setStart(generatedResponseP.firstChild, 0);
    newRange.setEnd(generatedResponseP.firstChild, 0);
    selection.removeAllRanges();
    selection.addRange(newRange);

    inputElement.addEventListener("keydown", handleKeyPress);

    //MAYBE ADD A TIMEOUT FOR THE SUGESTED PROMPT
  }
});
