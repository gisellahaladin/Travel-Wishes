const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const countries = require('./countries');

router.use(bodyParser.json());

router.post('/api/countries', [
    body('name').isString().notEmpty(),
    body('alpha2Code').isString().notEmpty(),
    body('alpha3Code').isString().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { name, alpha2Code, alpha3Code } = req.body;
    const existingCountry = countries.find(country => country.alpha2Code === alpha2Code || country.alpha3Code === alpha3Code);
    if (existingCountry) {
        return res.status(409).json({ error: "Country already exists." });
    }

    const newCountry = {
        id: countries.length + 1,
        name,
        alpha2Code,
        alpha3Code,
        visited: false
    };
        countries.push(newCountry);
        res.json(newCountry);
    });
    
    // GET /api/countries/:code
    router.get('/api/countries/:code', (req, res) => {
    const { code } = req.params;
    const country = countries.find(country => country.alpha2Code === code || country.alpha3Code === code);
    if (!country) {
        return res.status(404).json({ error: "Country not found." });
    }
    res.json(country);
    });
    
    // PUT /api/countries/:code
    router.put('/api/countries/:code', [
    body('name').isString().notEmpty(),
    body('alpha2Code').isString().notEmpty(),
    body('alpha3Code').isString().notEmpty()
    ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { code } = req.params;
    const { name, alpha2Code, alpha3Code } = req.body;
    const existingCountry = countries.find(country => country.alpha2Code === code || country.alpha3Code === code);
    if (!existingCountry) {
        return res.status(404).json({ error: "Country not found." });
    }
    
    existingCountry.name = name;
    existingCountry.alpha2Code = alpha2Code;
    existingCountry.alpha3Code = alpha3Code;
    res.json(existingCountry);
    });
    
    // DELETE /api/countries/:code
    router.delete('/api/countries/:code', (req, res) => {
    const { code } = req.params;
    const existingCountryIndex = countries.findIndex(country => country.alpha2Code === code || country.alpha3Code === code);
    if (existingCountryIndex === -1) {
        return res.status(404).json({ error: "Country not found." });
    }
    
    countries.splice(existingCountryIndex, 1);
    res.sendStatus(204);
    });
    
    // Export the router
    module.exports = router; 