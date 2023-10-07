const express = require('express');
const countries = require('./countries');
const app = express()
const wishlistRouter = require('./wishlistRouter');
const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(wishlistRouter);

app.get('/', (req, res) => {
    res.render('index', { countries });
});

app.get('/api/countries', (req, res) => {
    const { sort } = req.query;

    let sortedCountries = countries;
    if (sort === 'true') {
        sortedCountries = countries.slice().sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json(sortedCountries);
});

app.listen(PORT, () => {
    console.log(`Every move you make, every breath you take, I'll be listening on port ${PORT}`)
});