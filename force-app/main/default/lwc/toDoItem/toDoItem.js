import { LightningElement, api } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { deleteRecord } from 'lightning/uiRecordApi';
import TO_DO_ITEM from '@salesforce/schema/To_Do_Item__c';
import ITEM_DESCRIPTION from '@salesforce/schema/To_Do_Item__c.Item_Description__c';
import ITEM_ID from '@salesforce/schema/To_Do_Item__c.Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';


export default class ToDoItem extends LightningElement {
@api item;

handleInputChange(event) {
    this.newItemValue = event.target.value;

    console.log(event.target.value);
}

updateItem(event) {
    console.log("started update item");
    const allValid = [...this.template.querySelectorAll('lightning-input')]
        .reduce((validSoFar, inputFields) => {
            inputFields.reportValidity();
            return validSoFar && inputFields.checkValidity();
        }, true);
    console.log(allValid);
    if (allValid) {
        // Create the recordInput object
        const fields = {};
        fields[ITEM_ID.fieldApiName] = event.target.getAttribute("data-id");
        fields[ITEM_DESCRIPTION.fieldApiName] = this.newItemValue;
        //fields[ITEM_DESCRIPTION.fieldApiName] = this.template.querySelector("[data-field='ItemDescription']").value;
        console.log(fields);
        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Item updated',
                        variant: 'success'
                    })
                );
                // Display fresh data in the form
                return refreshApex(this._wiredItems);
            })
            .catch(error => {
                console.lorg(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
    else {
        // The form is not valid
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Something is wrong',
                message: 'Check your input and try again.',
                variant: 'error'
            })
        );
    }
}

deleteItem(event) {
    console.log("started delete item");
        const recordToDelete = event.target.getAttribute("data-id");
        deleteRecord(recordToDelete)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
                // Display fresh data in the form
                return refreshApex(this._wiredItems);

            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

}