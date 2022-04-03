using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using DG.Tweening;
public class DotweenTest : MonoBehaviour
{
    // Start is called before the first frame update
    public Ease ease;
    void Start()
    {
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            transform.DOScale(new Vector3(.7f, 1.3f, 1), .2f).SetEase(ease).OnComplete(() => { transform.DOScale(1, .2f).SetEase(ease); });

        }
    }
}
