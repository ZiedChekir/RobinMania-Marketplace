using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class InventorySlot : Slot
{
    [SerializeField]
    public Item item;
    public int amount;
    protected int SlotID;
    
    public InventoryEvents inventoryEvents;

    private void Awake()
    {
        initializeSlot(-1);
    }

    void initializeSlot(int itemID)
    {
        SlotID = transform.GetSiblingIndex();
        item = itemID == -1  ? null :ItemDatabase.ItemList[itemID] ;
       
    }
    public override void UpdateSlot(Item item)
    {

        base.UpdateSlot(item);
        this.item = item;
      

    }

   
    public bool isSlotEmpty()
    {
        return item == null;
    }
    public override void onSlotChildRightClicked()
    {
        if (EquippementManager.Instance.AddItemToEquipementSlots(item.id))
        {
            inventoryEvents.OnItemRemoved(SlotID);
        }
        else
        {
            print("equipement slots are full");
        }
        //remove item from inventory and equipp it
        
    }
    public override void OnDrop(PointerEventData eventData)
    {
        GameObject droppedItem = eventData.pointerDrag;

        if (droppedItem != null && droppedItem.TryGetComponent<DragAndDropItem>(out DragAndDropItem dragScript))
        {
            if (dragScript.isSlotEmpty())
                return;
            //check if the item Slots is diffrent than the dropped slot
            if (transform.childCount >0)
            {
                //store the current slot id to switch it with the dragged Slot item
                int currentSlotItemID = transform.GetChild(0).gameObject.GetComponent<DragAndDropItem>().ItemID;
                transform.GetComponent<InventorySlot>().UpdateSlot(ItemDatabase.ItemList[dragScript.ItemID]);
                //it s gonna get changed in dragAndropItem updateItemValue item
                dragScript.ChangeItemID(currentSlotItemID);

            }


        }
    }

}
