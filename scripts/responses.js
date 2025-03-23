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

    this.getResponse = function (id, variablesObject = {}) { 
        let response = this.responses[this.language][id];

        if (typeof response === 'object') {
            response = response[Math.floor(Math.random() * response.length)];
        }

        if (response) {
            for (let variable in variablesObject) {
                response = response.replace(`{{${variable}}}`, variablesObject[variable]);
            }
        }
        
        return response;
    }
}

module.exports = responses;