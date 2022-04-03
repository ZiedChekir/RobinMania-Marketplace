using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class ButtonHandler : MonoBehaviour, IPointerEnterHandler
{
    [SerializeField] AudioCueEventChannelSO SfxChannel;
    [SerializeField] AudioCueSO HoverButtonAudio;
    [SerializeField] AudioConfigSO config;

    public void OnPointerEnter(PointerEventData eventData)
    {
        SfxChannel.Raise(HoverButtonAudio, config);
    }
}
