#pragma strict

public var wheelAxis : WheelAxisConnector;

// Convention : 0 = +x,+z, 1 = -x+z, 2 = +x-z, 3 = -x-z

function Update()
{
	var hMove = Input.GetAxis("Horizontal");
	var	vMove = Input.GetAxis("Vertical");
	
//	wheelAxis.wheels[0].AddMotion(vMove*6);
//	wheelAxis.wheels[1].AddMotion(vMove*-6);

	
	if(vMove > 0)
	{
		wheelAxis.wheels[0].EnableDisableMotor(true);
		wheelAxis.wheels[1].EnableDisableMotor(true);
		wheelAxis.wheels[2].EnableDisableMotor(false);
		wheelAxis.wheels[3].EnableDisableMotor(false);
		wheelAxis.wheels[0].AddMotion(vMove*450);
		wheelAxis.wheels[1].AddMotion(vMove*-450);
	}
	else if(vMove < 0)
	{
		wheelAxis.wheels[2].EnableDisableMotor(true);
		wheelAxis.wheels[3].EnableDisableMotor(true);
		wheelAxis.wheels[0].EnableDisableMotor(false);
		wheelAxis.wheels[1].EnableDisableMotor(false);
		wheelAxis.wheels[2].AddMotion(vMove*-450);
		wheelAxis.wheels[3].AddMotion(vMove*450);
	}
	
	wheelAxis.turnJoints[0].limits.min = -1*hMove*11;
	wheelAxis.turnJoints[0].limits.max = -1*hMove*11;
	wheelAxis.turnJoints[1].limits.min = hMove*11;
	wheelAxis.turnJoints[1].limits.max = hMove*11;	
}