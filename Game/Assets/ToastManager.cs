using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ToastManager : MonoBehaviour
{
    public static ToastManager Instance;

    [SerializeField]Transform ToastParent;
    [SerializeField] GameObject Toast;


    private void Start()
    {
        if (Instance == null)
            Instance = this;
        else
            Destroy(this);

    }

  
    public void AddToast(string text)
    {


        Toast OldestToast = null;
        foreach (RectTransform item in ToastParent.GetComponentInChildren<RectTransform>())
        {
            item.localPosition = new Vector3(item.localPosition.x, item.localPosition.y - item.rect.height - 3, item.localPosition.z);
           // item. = new Rect(item.rect.x, item.rect.y - item.rect.height - 3, item.rect.width, item.rect.height);
            if(OldestToast == null || OldestToast.timeAtCreation > item.GetComponent<Toast>().timeAtCreation)
            {
                OldestToast = item.GetComponent<Toast>();
            }
        
        }

        if(ToastParent.childCount > 2)
        {
            Destroy(OldestToast.gameObject);
        }

        Toast t = Instantiate(Toast, ToastParent).GetComponent<Toast>();
        t.UpdateText(text);
        Destroy(t.gameObject, 2);
    }
}
