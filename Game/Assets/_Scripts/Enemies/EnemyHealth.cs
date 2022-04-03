using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;



public class EnemyHealth : MonoBehaviour
{
    [SerializeField] private Slider slider;
    [SerializeField] private Slider SecondSlider;
    [SerializeField] private Color High;
    [SerializeField] private Color Low;

    public void InitHealth(float health, float maxhealth)
    {
        //slider.gameObject.SetActive(health < maxhealth);
        slider.maxValue = maxhealth;
        if (SecondSlider != null)
        {
            SecondSlider.value = health;
            SecondSlider.maxValue = maxhealth;
        }
            
        slider.value = health;
        
        
    }

    public void SetHealth(float health )
    {
        //if(!slider.gameObject.activeSelf)
        //    slider.gameObject.SetActive(true);
        //slider.value = health;
        DOTween.To(() => slider.value, x => slider.value = x, health, .2f);
        if (SecondSlider != null)
            DOTween.To(() => SecondSlider.value, x => SecondSlider.value = x, health, .7f);

        //slider.fillRect.GetComponentInChildren<Image>().color = Color.Lerp(Low, High, slider.normalizedValue);
    }





}
