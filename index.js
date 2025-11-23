const express = require('express');
const axios = require('axios');
const app = express();

// Use dotenv to read .env file variables
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * IMPORTANT: Rename this variable in your .env file to match the one below:
// * The boilerplate uses 'PRIVATE_APP_ACCESS', but your .env uses 'PRIVATE_APP_ACCESS_TOKEN'
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS; 
// const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS; 
// To fix this: Change the line above to use process.env.PRIVATE_APP_ACCESS_TOKEN 
// OR rename the variable in your .env file to PRIVATE_APP_ACCESS

const CUSTOM_OBJECT_ID = '2-194890475'; // <--- PASTE YOUR REAL ID HERE
const BASE_URL = 'https://api.hubapi.com/crm/v3/objects';
const PROPERTY_NAMES = 'name,type,bio'; // Custom properties to display/send

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};


// --------------------------------------------------------------------------------------
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. 
// Pass this data along to the front-end and create a new pug template in the views folder (homepage.pug).
// --------------------------------------------------------------------------------------
app.get('/', async (req, res) => {
    // API endpoint to fetch all Custom Object records
    const getAllRecordsUrl = `${BASE_URL}/${CUSTOM_OBJECT_ID}?properties=${PROPERTY_NAMES}`;

    try {
        const response = await axios.get(getAllRecordsUrl, { headers });
        const customObjects = response.data.results; // Array of records

        // Pass the fetched records to the homepage template
        res.render('homepage', {
            title: 'Pets Dashboard | HubSpot APIs',
            customObjects: customObjects,
            // Pass properties to the pug template for dynamic header generation
            propertyNames: PROPERTY_NAMES.split(',') 
        });
    } catch (error) {
        console.error('Error fetching custom objects:', error.message);
        res.render('homepage', { 
            title: 'Error',
            error: 'Failed to load records. Check API key and Object ID.' 
        });
    }
});


// --------------------------------------------------------------------------------------
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. 
// Send this data along in the next route.
// --------------------------------------------------------------------------------------
app.get('/update-cobj', (req, res) => {
    // Simply renders the form template (updates.pug)
    res.render('updates', {
        title: 'Create Pet Record | HubSpot APIs'
    });
});


// --------------------------------------------------------------------------------------
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. 
// Once executed, redirect the user to the homepage.
// --------------------------------------------------------------------------------------
app.post('/update-cobj', async (req, res) => {
    const createRecordUrl = `${BASE_URL}/${CUSTOM_OBJECT_ID}`;
    
    // Form data from req.body is mapped to the API payload
    const data = {
        properties: {
            name: req.body.petName, // Maps to input name="petName" in the form
            type: req.body.petType,   // Maps to input name="petType" in the form
            bio: req.body.petBio    // Maps to input name="petBio" in the form
        }
    };

    try {
        // Make the POST request to create the new record
        await axios.post(createRecordUrl, data, { headers });
        
        // Redirect back to the homepage to see the new record
        res.redirect('/');
    } catch (error) {
        console.error('Error creating custom object:', error.message);
        // On error, show the form again with an error message
        res.render('updates', { 
            title: 'Error',
            error: 'Failed to create record. Please ensure the Pet Type is a valid format.' 
        });
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));