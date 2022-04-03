using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class projectile_launcher_point : MonoBehaviour
{
    Vector2 calculated_pos;
    [SerializeField]
    float circle_raduis;
    float solution1,solution2;

      
    public float tes;
  

    // Update is called once per frame
    void Update()
    {
        //calculated_pos = calculate_position();
        X();
      
        //if(!float.IsNaN(calculated_pos.x) && !float.IsNaN(calculated_pos.y ))
        //{
        //    this.transform.position = calculated_pos;
        //}

   
    }

    void  X()
    {
        float X2 = Camera.main.ScreenToWorldPoint(Input.mousePosition).x;
        float Y2 = Camera.main.ScreenToWorldPoint(Input.mousePosition).y;
        Vector2 mousePos = new Vector2(X2, Y2);
        Vector2 playerPos = new Vector2(transform.parent.position.x, transform.parent.position.y);
        float angle = -1 *Vector2.SignedAngle((mousePos - playerPos),Vector2.right );


        float x = Mathf.Cos(angle * Mathf.Deg2Rad) * circle_raduis + transform.parent.position.x;
        float y = Mathf.Sin( angle * Mathf.Deg2Rad) * circle_raduis + transform.parent.position.y;

        this.transform.position = new Vector2(x, y);
    }

    Vector2  calculate_position()
    {
        
        float X1 = transform.parent.transform.position.x;
        float Y1 = transform.parent.transform.position.y;

       
        float X2 = Camera.main.ScreenToWorldPoint(Input.mousePosition).x;
        float Y2 = Camera.main.ScreenToWorldPoint(Input.mousePosition).y;
        
        float a,b;
        
        a = (Y2 - Y1) / (X2 - X1);


        b = Y1 - a * X1;

        calculateRacine(1 + a * a, -(2 * X1 - 2 * a * (b - Y1)), Mathf.Pow((b - Y1), 2) - Mathf.Pow(circle_raduis ,2) + X1*X1,ref solution1,ref solution2);


    
        float y_sol1 = a * solution1 + b;
        float y_sol2 = a * solution2 + b;


       
        if (float.IsNaN(solution1) || float.IsNaN(solution2) || Mathf.Abs(a) > 30 || Mathf.Abs(b) > 150)
        {
            //  Debug.Log(string.Format("player pos :({0},{1}) and mouse pos : ({2},{3}) and a,b = {4} {5}", X1, Y1, X2,Y2,a,b)) ;

            solution1 = X1;
            solution2 = X1;

            //(x-xc)2 + (y-yc)2 = r2
            y_sol1 = circle_raduis + Y1;
            y_sol2 = Y1 - circle_raduis;

        }


        Vector2 vect_sol1 = new Vector2(solution1, y_sol1);
        Vector2 vect_sol2 = new Vector2(solution2, y_sol2);

        Vector2 vect_sol1_distance = vect_sol1 - new Vector2(X2, Y2);
        Vector2 vect_sol2_distance = vect_sol2 - new Vector2(X2, Y2);

        Vector2 finalPosition = vect_sol1_distance.magnitude >= vect_sol2_distance.magnitude ? vect_sol2 : vect_sol1;
  

        return finalPosition;
    }
   public static void calculateRacine(float a, float b, float c ,ref float sol1,ref float sol2)
    {
        
         sol1 = (-b - Mathf.Sqrt(Mathf.Pow(b, 2) - 4 * a * c)) / (2 * a);
        sol2 = (-b + Mathf.Sqrt(Mathf.Pow(b, 2) - 4 * a * c)) / (2 * a);
    }
}
