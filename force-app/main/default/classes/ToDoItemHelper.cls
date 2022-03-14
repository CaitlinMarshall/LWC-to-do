public with sharing class ToDoItemHelper {
    @AuraEnabled(cacheable=true)
    public static List<To_Do_Item__c> getItemList() {
        return [SELECT Id, Item_Description__c
            FROM To_Do_Item__c];
    }
}
