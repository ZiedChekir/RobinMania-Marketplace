using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;


[CreateAssetMenu(fileName = "Inventory", menuName = "ScriptableObjects/Inventory", order = 1)]
public class InventoryEvents : ScriptableObject
{
    public event UnityAction<Item> ItemAddedEvent;
    public event UnityAction<int> ItemRemovedEvent;
    public event UnityAction<bool> InventoryOpenedEvent;
    public event UnityAction<int> EquipementSlotItemDroppedEvent;
    public event UnityAction<int> ItemEquippedEvent;

    public void OnItemEquipped(int itemID)
    {
        if (ItemEquippedEvent != null)
            ItemEquippedEvent.Invoke(itemID);
    }

    public void OnEquipementSlotItemDropped(int id)
    {
        if (EquipementSlotItemDroppedEvent != null)
            EquipementSlotItemDroppedEvent.Invoke(id);
    }
    public void OnItemAdded(Item item)
    {
        if (ItemAddedEvent != null)
            ItemAddedEvent.Invoke(item);
    }

    public void OnItemRemoved(int slotID)
    {
        if (ItemRemovedEvent != null)
            ItemRemovedEvent.Invoke(slotID);
    }

    public void OnInventoryOpened(bool activated)
    {
        if (InventoryOpenedEvent != null)
            InventoryOpenedEvent.Invoke(activated);
    }

}
