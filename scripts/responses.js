const yaml = require('js-yaml');
const fs = require('fs');

var responses = new function() {
    this.load = function (filePath) {
        let file = fs.readFileSync(filePath, 'utf8');
        let responses = yaml.load(file);
        this.responses = responses;

        return responses;
    }

    this.setLanguage = function (language) {
        this.language = language;
    }

    this.getResponse = function (id) {
        let response = this.responses[this.language][id];

        if (typeof response === 'object') {
            return response[Math.floor(Math.random() * response.length)];
        }
        
        return response;
    }
}

module.exports = responses;