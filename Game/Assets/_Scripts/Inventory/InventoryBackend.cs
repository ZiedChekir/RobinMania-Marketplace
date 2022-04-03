using System;
using System.Collections;
using System.Numerics;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class InventoryBackend : MonoBehaviour
{

    private const int InventorySize = 9;

    public Transform[] Slots = new Transform[InventorySize];


    public Transform InventoryUI;
    public GameObject InventorySlot;

    public static InventoryBackend Instance;
  

    public  InventoryEvents inventoryEvent;
    string chain = "polygon";
    // set network mainnet, testnet
    string network = "testnet";
    private string contract = "0x3B907c02dC6069D82D76ac07173Fc879814E73d5";




    private void Start()
    {

        InventoryUI = InventoryUI.transform.GetChild(0);
        if (Instance == null)
            Instance = this;
        else
            Destroy(this);
        InitializeInventory();
        PopulateInventory();
        // AddItem(ItemDatabase.ItemList[4]);

    }


    async private void PopulateInventory()
    {
        foreach( var item in ItemDatabase.ItemList)
        {
            int tokenID = item.Key;
            print("bef");
            BigInteger balanceOf = await ERC1155.BalanceOf(chain, network, "0x584cb58df81ea75795b7043d906d6ce3adb0139c", PlayerPrefs.GetString("Account"), tokenID.ToString());
            print("balance of " + tokenID + " is " + balanceOf);
            for (int i = 0; i < balanceOf; i++)
            {
                AddItem(ItemDatabase.ItemList[tokenID]);
            }    
        }
    }
    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.F))
            OpenCloseInventory();
    }

    public bool hasItem(int itemID)
    {

        foreach (var item in Slots)
        {
            if (!item.GetComponent<InventorySlot>().isSlotEmpty() && item.GetComponent<InventorySlot>().item.id == itemID)
                return true;
        }

        return false;
       
    }




    void InitializeInventory()
    {
        //open inventory to initialize slots because u cant init them when it s not active
        OpenCloseInventory(1);
        for (int i = 0; i < InventorySize; i++)
        {
            Slots[i] = Instantiate(InventorySlot, InventoryUI.transform).transform;
        }
        //closes the inventory
  
        OpenCloseInventory(0);
    }





    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++ ADD ITEM ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



    //add item at nearst slot
    public void AddItem(Item item)
    {
        //loop through all the slots and find the nearst emtpy slot and then assign the new item to that slot
        for (int i = 0; i < InventorySize; i++)
        {
            if (Slots[i].GetComponent<InventorySlot>().isSlotEmpty())
            {
                Slots[i].GetComponent<InventorySlot>().UpdateSlot(item);
                return;
            }
        }
        print("full inventory");
        return;
    }
     void AddItemByID(int itemID)
    {
        //loop through all the slots and find the nearst emtpy slot and then assign the new item to that slot
        for (int i = 0; i < InventorySize; i++)
        {
            if (Slots[i].GetComponent<InventorySlot>().isSlotEmpty())
            {

                Slots[i].GetComponent<InventorySlot>().UpdateSlot(ItemDatabase.ItemList[itemID]);

                return;
            }

        }
        print("full inventory");
        return;
    }
    public void AddItemTest(string s)
    {
        print(s);
        int x = Int32.Parse(s);

        AddItemByID(x);
    }

    void AddItemAtSlot(Item item, int SlotIndex)
    {
        if (SlotIndex < InventorySize && SlotIndex >= 0 )
        {

            Slots[SlotIndex].GetComponent<InventorySlot>().UpdateSlot(item);
            
        }
    }

    



    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++ Remove ITEM ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




    Item RemoveItem(int SlotIndex)
    {
        Item temp = Slots[SlotIndex].GetComponent<InventorySlot>().item;
        if (Slots[SlotIndex].GetComponent<InventorySlot>().isSlotEmpty())
            return null;

        Slots[SlotIndex].GetComponent<Slot>().UpdateSlot(null);
        
        return temp;
    }


    //removes an item but returns nothing used for the event system
    void RemoveItemNoReturn(int SlotIndex)
    {
        RemoveItem(SlotIndex);
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++ Utils ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    // status 0 close inventory 
    //status 1 open inventory 
    //status -1 close or open invenotry based on the inventoryUI state
   public  void OpenCloseInventory(int status = -1)
    {
        if( status == 0)
        {
            InventoryUI.parent.gameObject.SetActive(false);
        }
        else if (status == 1)
        {
            InventoryUI.parent.gameObject.SetActive(true);
        }
        else
        {
            InventoryUI.parent.gameObject.SetActive(!InventoryUI.parent.gameObject.activeSelf);
        }
        
    }
    //INVENTORY EVENTS



    private void OnEnable()
    {
        inventoryEvent.ItemRemovedEvent += RemoveItemNoReturn;
    }
    private void OnDisable()
    {
        inventoryEvent.ItemRemovedEvent -= RemoveItemNoReturn;
    }
}
