using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class NFTPanel : MonoBehaviour
{
    public TMPro.TMP_Text Title;
    public Image itemImage;
    int ItemID;
    public Button button;
    public Button button2;
    int x;
    public void InitializePanel(string title,  Sprite sprite, int itemID) 
    {
        Title.text = title;     
        itemImage.sprite = sprite;
        this.ItemID = itemID;
       
    }

    
    
}
