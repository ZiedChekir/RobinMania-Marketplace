using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DungeonDoor : MonoBehaviour
{

    public GameObject NoKeyPanel;
    public GameObject HasKeyPanel;

    public Transform DungeonStartPoint;
    public Transform player;
    public InputReaderSO inputReader;

    private void Start()
    {
        HasKeyPanel.SetActive(false);
        NoKeyPanel.SetActive(false);
    }

    public void EnterDungeon()
    {
        //player.transform.position = DungeonStartPoint.position;
        inputReader.ondun();
        HasKeyPanel.SetActive(false);
        NoKeyPanel.SetActive(false);
    }
    private void OnTriggerEnter2D(Collider2D other)
    {
       
        if (other.gameObject.CompareTag("Player"))
        {
            if (InventoryBackend.Instance.hasItem(4))
            {
                HasKeyPanel.SetActive(true);
                NoKeyPanel.SetActive(false);
            }
            else
            {
                HasKeyPanel.SetActive(false);
                NoKeyPanel.SetActive(true);
            }
        }
    }

    private void OnTriggerExit2D(Collider2D other)
    {
       
        if (other.CompareTag("Player"))
        {
            HasKeyPanel.SetActive(false);
            NoKeyPanel.SetActive(false);
        }
    }
}
