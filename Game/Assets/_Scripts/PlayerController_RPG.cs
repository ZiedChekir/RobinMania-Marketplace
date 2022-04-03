using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController_RPG : MonoBehaviour
{
    //for testing purposes



    // Start is called before the first frame update
    Vector2 movePosition,LastMovePosition = Vector2.zero;
    public float speed =2;
    Rigidbody2D rb;
    Animator anim;
    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        anim = GetComponent<Animator>();
        rb.gravityScale = 0;
    }

    // Update is called once per frame
    void Update()
    {
        Move();

        Animate();
    }
    private void FixedUpdate()
    {
        ProcessMovement();
    }
    private void Move()
    {

        if (Input.GetAxis("Horizontal") == 0 && Input.GetAxis("Vertical") == 0 && (movePosition.x != 0 || movePosition.y != 0))
            LastMovePosition = movePosition;

        movePosition.x = Input.GetAxis("Horizontal");
        movePosition.y = Input.GetAxis("Vertical");

       
        if (movePosition.magnitude > 1)
        {
            movePosition = movePosition.normalized;
        }
    }
    private void Animate()
    {
        anim.SetFloat("Horizontal", movePosition.x);
        anim.SetFloat("Vertical", movePosition.y);

        anim.SetFloat("LastHorizontal", LastMovePosition.x);
        anim.SetFloat("LastVertical", LastMovePosition.y);

        anim.SetFloat("Speed", movePosition.magnitude);
    }
    private void ProcessMovement()
    {
         rb.MovePosition(rb.position + movePosition* speed * Time.fixedDeltaTime);
       // rb.velocity = movePosition * speed * Time.fixedDeltaTime;
        //transform.Translate(movePosition * speed * Time.fixedDeltaTime);
    }
}
