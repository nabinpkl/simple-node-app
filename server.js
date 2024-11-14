// Author: Nabin Pokhrel C0904908

express = require('express');
const path = require('path');

app = express();


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle requests for the home page if not found then send error page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            res.status(err.status || 404).sendFile(path.join(__dirname, 'public', 'error.html'));
        }
    });
});

// Explicit throw errors for testing
app.get('/error', (req, res) => {
    throw new Error("This is a test error");
});


// Handle 404 errors for static files
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
});

//Start the server on port 8080
app.listen(3000, () => {
    console.log("Server is listenning on port 3000");
});
