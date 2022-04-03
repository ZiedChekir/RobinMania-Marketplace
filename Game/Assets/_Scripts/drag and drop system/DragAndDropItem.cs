using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class DragAndDropItem : MonoBehaviour, IBeginDragHandler, IEndDragHandler, IDragHandler, IPointerDownHandler, IPointerClickHandler

{



    private RectTransform rect;
    [SerializeField]
    private Canvas canvas;
    private CanvasGroup canvasGroup;


    [HideInInspector] public Vector2 initialPosition;
    [HideInInspector] public Transform initialParent;
    private Image sprite;
    public int ItemID;
    public InventoryEvents inventoryEvents;

    public void Awake()
    {
        canvas = GameObject.FindObjectOfType<Canvas>();
        rect = GetComponent<RectTransform>();
        canvasGroup = GetComponent<CanvasGroup>();
        sprite = GetComponent<Image>();


        canvasGroup.blocksRaycasts = true;
        canvasGroup.alpha = 1;

        //initialize on emptyItem
        ChangeItemID(-1);


      
    }



    public void OnBeginDrag(PointerEventData eventData)
    {

        if (isSlotEmpty()) return;
        initialPosition = rect.position;
        initialParent = transform.parent;
        canvasGroup.blocksRaycasts = false;
        canvasGroup.alpha = 0.9f;
        transform.SetParent(canvas.transform);
        
    }

    public void OnEndDrag(PointerEventData eventData)
    {
        if (isSlotEmpty()) return;


        SetParent(initialParent);
        SetPosition(initialPosition);

        canvasGroup.alpha = 1;
        canvasGroup.blocksRaycasts = true;
        UpdateItemValue();

        //check if the active Equipped item is removed
        EquippementManager.Instance.RemoveEquippedItem();
      
    }
    public void OnDrag(PointerEventData eventData)
    {
        if (isSlotEmpty()) return;

        rect.anchoredPosition += eventData.delta / canvas.scaleFactor;


    }

    public void SetPosition(Vector2 pos)
    {
        rect.position = pos;
        
    }
    public void SetParent(Transform parent)
    {

        transform.SetParent(parent);
        
    }
    public bool isSlotEmpty()
    {
        return sprite.sprite == null;
    }
    public void OnPointerDown(PointerEventData eventData)
    {
        if (isSlotEmpty()) return;
    }
    public void ChangeItemID(int id)
    {
        ItemID = id;

    }
    public void UpdateItemValue()
    {
        transform.parent.GetComponent<InventorySlot>().UpdateSlot(ItemID == -1 ? null : ItemDatabase.ItemList[ItemID]);
    }
    public void OnPointerClick(PointerEventData eventData)
    {
        if (eventData.button == PointerEventData.InputButton.Right && !isSlotEmpty())
        {
            transform.parent.GetComponent<Slot>().onSlotChildRightClicked();

        }
    }

 
}
