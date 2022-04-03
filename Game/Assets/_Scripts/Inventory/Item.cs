using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public   class Item 
{
   
    public string Name;
    public int id;
    public ItemType itemType;
    public Sprite sprite;
    public int amount;
    public bool stackable;
    public AudioCueSO audio;
    public AudioConfigSO config;

    public Item(string name, int id, ItemType itemType,  Sprite spritee,AudioCueSO audioCue, AudioConfigSO config)
    {
        this.Name = name;
        this.id = id;
        this.itemType = itemType;
        audio = audioCue;
        this.config = config; 
        this.sprite = spritee;

   
    }
    public virtual void Attack()
    {
        Debug.Log("attacking");
    }
    public virtual void Buff()
    {
        Debug.Log("buff");
    }
}
public enum ItemType { sword ,bow ,consumable,Key}