"use strict"


/**
 * simple helper for building a DOMObject
 * @param {Object} plan
 * @returns {Element}
 */
function elementBuilder(plan)
{
    if (plan.type === undefined || !plan.type) {
        return null
    }

    var element = document.createElement(plan.type);

    if (!element) {
        return null;
    }

    var i, nE;
    plan.type = null;

    for (i in plan) {
        if (plan[i] == null) continue;

        if (i == 'children') {
            nE = elementBuilder(plan[i]);
            if (nE) {
                element.appendChild(nE);
            }
        } else {
            element[i] = plan[i];
        }
    }

    return element;
}



var CardBuilder = {
    /**
     * creates a new card and appends it to the target element
     * @param {Object} settings
     */
    newCard : function(settings){
        var card = new Card(settings);
        return card;
    }

};



/**
 * @param {Object} settings
 * @constructor
 */
function Card(settings)
{
    /**
     * @type {number}
     */
    this.hashLength = 32;

    // this is the internal identifier not the element id name
    if (settings.id == undefined) {
        this.id = this.generateHash();
    }

    this.mainElement    = null;
    this.content        = null;
    this.title          = null;
    this.settings       = settings;

    this.create();
}


/**
 * @returns {Element|*}
 */
Card.prototype.getCardElement = function() {
    return this.mainElement;
};

/**
 * generates a random "hash" string
 * http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
 *
 * @returns {string}
 */
Card.prototype.generateHash = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < this.hashLength; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

/**
 * @return void
 */
Card.prototype.create = function() {
    if (this.mainElement) {
        return;
    }
    this.mainElement = elementBuilder(this.settings.mainElement);
    this.settings.elementList.map(function(plan) {
        this.mainElement.appendChild(elementBuilder(plan))
    }.bind(this));
};
