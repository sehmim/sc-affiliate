function createDropdownWithOptions(optionsArray, textContent) {
  var labelElement = document.createElement('label');
  labelElement.textContent = textContent || 'Select your team:';

  var selectElement = document.createElement('select');
  selectElement.id = "selectedTeam";

  optionsArray.forEach(function(optionText) {
    var optionElement = document.createElement('option');
    optionElement.textContent = optionText;
    optionElement.value = optionText;
    selectElement.style.width = "200px";
    selectElement.appendChild(optionElement);
  });

  var containerDiv = document.createElement('div');
  containerDiv.appendChild(labelElement);
  containerDiv.appendChild(selectElement);
  containerDiv.style.display = "flex";
  containerDiv.style.justifyContent = "space-between";

  return { allowedTeamsDropdown: containerDiv, selectElement};
}

function createLoginButton() {
  var loginButton = document.createElement('button');
  loginButton.textContent = 'Login';
  loginButton.style.cursor = 'pointer'; // Make cursor change on hover

  loginButton.addEventListener('click', function() {
    window.location.href = 'https://sponsorcircle-affiliate-git-feature-landingpage-sehmim.vercel.app/login';
  });

  return loginButton;
}

function createLogoutButton() {
  let button = document.createElement('button');
  
  button.textContent = 'Logout';
  button.addEventListener('click', function() {
    localStorage.removeItem('sponsorcircle-useremail');
    window.location.reload();
  });

  return button;
}

async function fetchAllowedGroups(userEmail) {
  const url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getAllGroups" : "https://getallgroups-6n7me4jtka-uc.a.run.app";
  const groups = await fetchDataFromServer(url);

  return groups.filter((group) => {
    const isLeader = group.leader.email === userEmail;
    const isMember = group.members.some(member => member.email === userEmail);
    
    if (isLeader || isMember) {
      return true;
    } else {
      return false;
    }
  }).map(group => group.teamName);
}

async function fetchDefaultCharaties() {
  const url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getDefaultCharities" : "https://getdefaultcharities-6n7me4jtka-uc.a.run.app";
  const charities = await fetchDataFromServer(url);

  return charities.map(({ data }) => {
    return data.organizationName;
  })
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function getUserInfo() {
  console.log("chrome ----->", chrome);
}

function greetUser() {
  const userEmail = localStorage.getItem('sponsorcircle-useremail');
  if (userEmail) {
    const div = document.createElement('div');
    div.innerText = `Hello ${userEmail}`;

    return div;
  }
}

function createCloseButton(iframe) {
    const closeButton = document.createElement('div');
    closeButton.innerHTML = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '5px';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    closeButton.addEventListener('click', function() {
        iframe.style.display = 'none'; // Hide the iframe when close button is clicked
    });
    return closeButton;
}


function generateLoginForm() {
  // Create form element
  const form = document.createElement('form');

  // Create header
  const header = document.createElement('div');
  header.innerText = "LOGIN";

  // Create email input
  const emailInput = document.createElement('input');
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('placeholder', 'Email');
  emailInput.setAttribute('name', 'email');
  
  // Create password input
  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  passwordInput.setAttribute('placeholder', 'Password');
  passwordInput.setAttribute('name', 'password');
  
  // Create submit button
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  
  // Add event listener to submit button
  submitButton.addEventListener('click', async function(event) {
      event.preventDefault();
      const email = emailInput.value;
      const password = passwordInput.value;
      await loginUser(email, password);
  });

  // Create Register link
  const register = document.createElement('a');
  register.innerText = "Register";
  register.setAttribute('target','_blank');
  register.href = 'https://sponsorcircle-affiliate.vercel.app/register';

  // Append inputs and button to form
  form.appendChild(header);
  form.appendChild(emailInput);
  form.appendChild(passwordInput);
  form.appendChild(submitButton);
  form.appendChild(register);
  
  return form;
}


async function loginUser(email, password) {
    const url = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/loginUser': "https://loginuser-6n7me4jtka-uc.a.run.app";

    const data = {
        email: email,
        password: password
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        if (response.ok) {
          localStorage.setItem('sponsorcircle-useremail', email);
          location.reload();
        }

        return await response.json();
    } catch (error) {
        alert('Failed to login');
        return { error };
    }
}

async function fetchAllowedDomains() {
  let allowedDomains = JSON.parse(localStorage.getItem('sc-allowed-domains')) || null;
  const cachedTimestamp = localStorage.getItem('sc-cache-timestamp');
  const currentTime = new Date().getTime();

  if (allowedDomains && Object.keys(allowedDomains).length !== 0 && cachedTimestamp) {
    // Check if cache is still valid (within 24 hours)
    const cacheExpiryTime = parseInt(cachedTimestamp) + 24 * 60 * 60 * 1000;
    if (currentTime < cacheExpiryTime) {
      return allowedDomains;
    }
  }

  const url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/allowedDomains" : "https://alloweddomains-6n7me4jtka-uc.a.run.app";
  allowedDomains = await fetchDataFromServer(url) || [];
  
  // Update cache with new data and timestamp
  localStorage.setItem('sc-allowed-domains', JSON.stringify(allowedDomains));
  localStorage.setItem('sc-cache-timestamp', currentTime.toString());

  return allowedDomains;
}