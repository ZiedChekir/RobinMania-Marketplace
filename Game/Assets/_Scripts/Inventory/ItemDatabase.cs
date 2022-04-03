using System.Collections;
using System.Collections.Generic;
using UnityEngine;



public class ItemDatabase : MonoBehaviour
{
    public static Dictionary<int,Item> ItemList = new Dictionary<int, Item>();


    private void Awake()
    {
        
        var LoadedItems = Resources.LoadAll<ItemSO>("Items");
        foreach (var item in LoadedItems)
        {
            if(item.itemType == ItemType.sword)
            {
                Item temp = new Sword(item.Name, item.id, item.itemType, item.sprite,item.audio, item.damage, item.coolDown, item.ProjectileDistance, item.Projectile, item.ProjectileSpeed, item.KnockbackPower,item.ProjectileSprite,item.audioConfig);
                ItemList.Add(temp.id,temp);
            }
            else if (item.itemType == ItemType.bow)
            {
               Item temp = new Bow(item.Name, item.id, item.itemType, item.sprite, item.audio, item.damage, item.coolDown, item.ProjectileDistance, item.Projectile, item.ProjectileSpeed, item.KnockbackPower, item.ProjectileSprite,item.audioConfig);
                ItemList.Add(temp.id,temp);
            }
            else if (item.itemType == ItemType.consumable)
            {
                Item temp = new Consumable(item.Name, item.id, item.itemType,  item.sprite,item.audio,item.healthbuff,item.coolDown,item.audioConfig);
                ItemList.Add(temp.id,temp);
            }
            else if (item.itemType == ItemType.Key)
            {
                Item temp = new Item(item.name, item.id, item.itemType, item.sprite, item.audio, item.audioConfig);
                ItemList.Add(temp.id, temp);
            }
        }
           
    }
}
