using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EquippementManager : MonoBehaviour
{

    public static EquippementManager Instance;

    public InventoryEvents inventoryEvents;
    public GameObject slotsHolder;

    public GameObject EquippementSlot;

    private const int SlotsNumber = 4;
    private int _activeSlotID = 0;//can be modified through load and save system

    private EquippementSlot[] EquippementSlots = new EquippementSlot[SlotsNumber];

    [SerializeField]
    private Color ActiveSlotColor = Color.white;
    [SerializeField]
    private Color InactiveSlotColor = Color.gray;

    void Awake()
    {
        if (Instance != null)
        {
            Destroy(gameObject);
        }
        else
        {
            Instance = this;
        }
    }
    private void Start()
    {
        InitializeSlots();
    }
    private void InitializeSlots()
    {
        for (int i = 0; i < SlotsNumber; i++)
        {
            EquippementSlots[i] = Instantiate(EquippementSlot, slotsHolder.transform.GetChild(0).transform).GetComponent<EquippementSlot>();
            EquippementSlots[i].item = null;
            if (i == _activeSlotID)
            {
                ChangeSlotColor(i, ActiveSlotColor);
            }
            else
            {
                ChangeSlotColor(i, InactiveSlotColor);
            }
        }
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.X))
        {
            RemoveEquippedItem();
        }
        if (Input.GetKeyDown(KeyCode.Alpha1))
        {
            SwitchSlot(0);


        }
        if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            SwitchSlot(1);

        }
        if (Input.GetKeyDown(KeyCode.Alpha3))
        {
            SwitchSlot(2);

        }
        if (Input.GetKeyDown(KeyCode.Alpha4))
        {
            SwitchSlot(3);

        }
    }


    //Changing the current active slot to the slot id given 
    void SwitchSlot(int id)
    {


        if (id < 0 || id >= SlotsNumber)
        {
            print("id out of range");
            return;
        }
        //change the previous slot color and updating the new id and color
        ChangeSlotColor(_activeSlotID, InactiveSlotColor);
        SetActiveSlotID(id);
        ChangeSlotColor(id, ActiveSlotColor);

        if (EquippementSlots[id].item != null)
        {
            //Equip item to the player 
            OnItemEquipped(EquippementSlots[id].item.id);
            //OnItemEquipped(-1);
        }
        else
        {
            OnItemEquipped(-1);
        }

    }
    //change Slot color
    void ChangeSlotColor(int id, Color color)
    {
        EquippementSlots[id].GetComponent<EquippementSlot>().ChangeSlotColor(color);
    }
    //change the active slot 
    private void SetActiveSlotID(int id)
    {
        _activeSlotID = id;

    }


    //the item just dropped in the equippement slots so check if it s is in the active slot if so equip it 
    void OnItemDroppedInSlot(int SlotId)
    {
        if (SlotId == _activeSlotID)
        {
            OnItemEquipped(EquippementSlots[SlotId].item.id);
            return;
        }

        StartCoroutine(WaitAndUpdate(.01f));


    }
    //removing the equipped item but just waiting for onDragEnd to execute so i cant removed the equipped weapon
    private IEnumerator WaitAndUpdate(float waitTime)
    {

        yield return new WaitForSeconds(waitTime);
        RemoveEquippedItem();


    }

   public void RemoveEquippedItem()
    {
        if (EquippementSlots[_activeSlotID].item == null)
        {
            OnItemEquipped(-1);
        }

    }

    void OnItemEquipped(int itemID)
    {
        inventoryEvents.OnItemEquipped(itemID);
    }



    private void OnEnable()
    {
        inventoryEvents.EquipementSlotItemDroppedEvent += OnItemDroppedInSlot;
    }
    private void OnDisable()
    {
        inventoryEvents.EquipementSlotItemDroppedEvent -= OnItemDroppedInSlot;

    }
    public bool AddItemToEquipementSlots(int itemID)
    {
        for (int i = 0; i < SlotsNumber; i++)
        {
            if (EquippementSlots[i].item == null)
            {
                EquippementSlots[i].UpdateSlot(ItemDatabase.ItemList[itemID]);
                OnItemDroppedInSlot(i);
                return true;
            }
        }
        return false;
    }

   
}

