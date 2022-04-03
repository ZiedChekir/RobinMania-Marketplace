using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Chest : MonoBehaviour
{

    public int ItemID;
    public Sprite Opened;
    public Sprite Closed;
    public GameObject ClaimNftPanel;
    public bool opened;
    private bool canOpen = false; 
    public int ChestID;
    SpriteRenderer SR;
    Transform Player;
    NFTPanel PanelScript;

  

    // Start is called before the first frame update
    async void Start()
    {
        ClaimNftPanel.SetActive(false);
        ChestID = transform.GetSiblingIndex();
        Player = GameObject.FindGameObjectWithTag("Player").transform;
        PanelScript = ClaimNftPanel.gameObject.GetComponent<NFTPanel>();
        
        SR = GetComponent<SpriteRenderer>();
        
        //bool x = await Mintable.Instance.isMintable(ItemID.ToString());
        if (PlayerPrefs.HasKey("Chest" + ChestID) )
        {
            opened = true;
            SR.sprite = Opened;

        }
        else
        {
            opened = false;
            SR.sprite = Closed;
        }
    }


    private void Update()
    {

        if (Input.GetKeyDown(KeyCode.O))
            PlayerPrefs.DeleteAll();
        
    }
    //// Update is called once per frame
    ///
    ///
    private void OnTriggerEnter2D(Collider2D collision)
    {

        
        if (collision.gameObject.CompareTag("Player") && !opened)
        {
            ClaimNftPanel.SetActive(true);
            PanelScript.InitializePanel(ItemDatabase.ItemList[ItemID].Name, ItemDatabase.ItemList[ItemID].sprite, ItemID);
            PanelScript.button.onClick.AddListener(()=>Claim());
          

        }

    }
    private void OnTriggerExit2D(Collider2D collision)
    {
        if (collision.gameObject.CompareTag("Player") && !opened)
        {
            ClaimNftPanel.SetActive(false);
            PanelScript.button.onClick.RemoveAllListeners();
           // PanelScript.button2.onClick.RemoveAllListeners();
        }
    }

    async public void Claim()
    {
        print("hiiii");
        bool x = await AllowPlayerToMint.Instance.Allow(ItemID.ToString());
        bool y = await Mint.Instance.mint(ItemID.ToString());
        //bool w = await Mintable.Instance.isMintable(ItemID.ToString());

        if (x && y)
        {
            InventoryBackend.Instance.AddItem(ItemDatabase.ItemList[ItemID]);
            ToastManager.Instance.AddToast("Item Successfully minted");
            SR.sprite = Opened;
            PlayerPrefs.SetInt("Chest" + ChestID, 1);
        }

    }


}
