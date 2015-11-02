"use strict";

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
function merge_options(obj1,obj2){
    var obj3 = {};
    var attrname;
    for (attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}


var elementDragged;
document.addEventListener('DOMContentLoaded', function()
{
    var cardTemplate = {
        'mainElement' :
        {
            "type" : 'div',
            "className" : 'card animated tada'
        },
        'elementList' : [
            { type: 'h4', innerHTML: 'asdasd'},
            {
                type: 'div',
                innerHTML: 'asdasd',
                children : {
                    type: 'ul',
                    children : {
                        type: 'li',
                        innerHTML : 'asdfasdfsfd'
                    }
                }
            }
        ]
    };


    document.getElementById('new-card').addEventListener('click', function(e){
        var card = CardBuilder.newCard(JSON.parse(JSON.stringify(cardTemplate)));
        document.getElementById('new-col').appendChild(card.getCardElement());
        DragAndDrop.addDraggable(card.getCardElement(), dragConfiguration);
    });


    var dropConfiguration = {
        drop : {
            callback : function(e)
            {
                if (e.preventDefault) {
                    e.preventDefault();
                }

                if (e.stopPropagation) {
                    e.stopPropagation();
                }

                if (elementDragged && elementDragged != this) {
                    elementDragged.parentNode.removeChild(elementDragged);
                    this.appendChild(elementDragged);
                }

                this.classList.remove('active');
                this.classList.remove('over');
                return false;
            }
        },
        dragover : {
            callback : function(e)
            {
                if (e.preventDefault) {
                    e.preventDefault();
                }

                e.dataTransfer.dropEffect = 'move';
                this.classList.add('drop');
                return false;
            }
        },
        dragenter : {
            callback : function(e)
            {
                this.classList.add('over');
                this.classList.add('active');
            }
        },
        dragleave : {
            callback : function(e)
            {
                this.classList.remove('over');
                this.classList.remove('active');
            }
        }
    };


    var dragConfiguration = {
        'dragstart'   : {
            callback: function (e)
            {
                e.dataTransfer.effectAllowed = 'move';
                elementDragged = this;
                this.classList.add('dragged');
                e.dataTransfer.setData('text/html', this.innerHTML);
            }
        },
        'dragend'     : {
            callback: function (e)
            {
                this.classList.remove('dragged');
                elementDragged = null;
            }
        },
        'drag'        : {
            callback: function(e)
            {

            }
        }
    };
    DragAndDrop.addDropZone('.dropzone', dropConfiguration);
});