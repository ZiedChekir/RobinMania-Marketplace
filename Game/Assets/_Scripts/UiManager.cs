using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using UnityEngine.InputSystem;

public class UiManager : MonoBehaviour
{

    PlayerInput input;

    [SerializeField] GameObject UIMenusHolder;
    [SerializeField] GameObject UIMenu;


    private void Start()
    {
        UIMenu.SetActive(false);
        input = new PlayerInput();

       /* input.Ingame.pause.performed += ToggleMenu;
        input.Menu.pause.performed += ToggleMenu;
        input.Ingame.Enable();
        input.Menu.Disable();*/
    }
    private void OnDisable()
    {
       /* input.Ingame.pause.performed -= ToggleMenu;
        input.Menu.pause.performed -= ToggleMenu;*/
    }

    public void ToggleMenu(InputAction.CallbackContext context)
    {
       
        if (UIMenu.activeSelf)
        {
            Time.timeScale = 1;
            UIMenu.SetActive(false);
            /*input.Menu.Disable();
            input.Ingame.Enable();*/
           
        }
        else
        {
            bool areMenusOpen = false;
            foreach (Transform child in UIMenusHolder.transform.GetComponentInChildren<Transform>())
            {
                if (child.gameObject.activeSelf)
                {
                  
                    child.gameObject.SetActive(false);
                    areMenusOpen = true;
                }
            }
            
            if (!areMenusOpen)
            {
                Time.timeScale = 0;
                UIMenu.SetActive(true);
                /*input.Menu.Enable();
                input.Ingame.Disable();*/

            }
        }
    }

}
