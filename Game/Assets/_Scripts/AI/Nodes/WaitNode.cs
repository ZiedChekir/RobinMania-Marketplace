using UnityEngine;


public class WaitNode : Node
{

    private float timer;
    private float interval;
    private bool isTimerStarted;
    EnemyAI ai;

    public WaitNode(float interval, EnemyAI ai)
    {
        this.interval = interval;
        this.timer = Time.timeSinceLevelLoad;
        this.isTimerStarted = false;
        this.ai = ai;
    }
    public override NodeState Evaluate()
    {
        Debug.Log("Waitf");
        if (isTimerStarted == false)
        {
           
            timer = Time.timeSinceLevelLoad;
            isTimerStarted = true;
        }

        if(Time.timeSinceLevelLoad >= timer + interval )
        {
            Debug.Log("Wait success");
            isTimerStarted = false;
            return NodeState.SUCCESS;
        }
        else
        {
            
            ai.SetColor(Color.black);
            return NodeState.RUNNING;
        }
    }
}