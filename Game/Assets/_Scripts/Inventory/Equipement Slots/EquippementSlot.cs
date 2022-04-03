using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class EquippementSlot : InventorySlot
{
    

    private void Start()
    {
        SlotID = transform.GetSiblingIndex();
        
    }

    public void ChangeSlotColor(Color color)
    {
        GetComponent<Image>().color = color;
    }
    public override void OnDrop(PointerEventData eventData)
    {
        base.OnDrop(eventData);
        
        inventoryEvents.OnEquipementSlotItemDropped(SlotID);

    }
    public override void onSlotChildRightClicked()
    {
        print("orveriden");
    }
    
}

