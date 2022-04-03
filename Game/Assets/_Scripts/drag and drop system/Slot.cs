using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

[RequireComponent(typeof(Image))]
public class Slot : MonoBehaviour, IDropHandler
{
    private Sprite sprite;
    
    public virtual void OnDrop(PointerEventData eventData)
    {


    }

    public virtual void UpdateSlot(Item item)
    {

        if (item == null)
        {
            UpdateSlotID(-1);
            UpdateSlotUI(null);
        }

        else
        {
            UpdateSlotUI(item.sprite);
            UpdateSlotID(item.id);
        }

    }
    
    void UpdateSlotUI(Sprite newSprite)
    {
        transform.GetChild(0).GetComponent<Image>().sprite = newSprite;
        sprite = newSprite;
    }
    void UpdateSlotID(int id)
    {
        transform.GetComponentInChildren<DragAndDropItem>().ItemID = id;
        //transform.GetChild(0).GetComponent<DragAndDropItem>().ItemID = id;
    }

    public virtual void onSlotChildRightClicked()
    {
        print("child right clicked");
    }
}
