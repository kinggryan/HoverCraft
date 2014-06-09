#pragma strict

// For use with wheel colliders

public var wheelAxis : WheelAxisConnector2;
private var wheelcolliders : WheelCollider[];
private var MAX_WHEEL_SPEED = 75;
public var WHEEL_SPEED = 75;
private var AntiRoll = 1000;
private var MAX_BRAKE_TORQUE = 25;
private var MAX_TURN_ANGLE = 5;
private var MAX_RPM = 120;
private var frontWheelIncrease = .02;
private var frontWheelDecrease = .02;
private var backWheelAdjustment = .02;
private var brakeTorque = 14.0;
private var brakeTorqueIncrease = .1;
private var brakeTorqueDecrease = .1;

// Convention : 0 = +x,+z, 1 = -x+z, 2 = +x-z, 3 = -x-z

function Start()
{
	wheelcolliders = new WheelCollider[4];
	for(var i = 0 ; i < 4 ; i++)
		wheelcolliders[i] = wheelAxis.wheels[i].GetComponent("WheelCollider");
}

function FixedUpdate()
{
	var hMove = Input.GetAxis("Horizontal");
	var	vMove = Input.GetAxis("Vertical");
	
//	Debug.Log("V Move : "+ vMove);
	
	var hit : WheelHit;
    var travelL : float;
    var travelR : float;

    var groundedL; 
    var groundedR;

	for(var j = 0 ; j < 2 ; j++)
	{
		var WheelL = wheelcolliders[2*j];
		var WheelR = wheelcolliders[(2*j)+1];
		travelL = 1.0;
		travelR = 1.0;
		
		groundedL = WheelL.GetGroundHit(hit);
	
    	if (groundedL)
        	travelL = (-WheelL.transform.InverseTransformPoint(hit.point).y - WheelL.radius) / WheelL.suspensionDistance;

    	groundedR = WheelR.GetGroundHit(hit);

    	if (groundedR)
        	travelR = (-WheelR.transform.InverseTransformPoint(hit.point).y - WheelR.radius) / WheelR.suspensionDistance;

    	var antiRollForce = (travelL - travelR) * AntiRoll;

    	if (groundedL)
        	rigidbody.AddForceAtPosition(WheelL.transform.up * -antiRollForce,WheelL.transform.position);  

    	if (groundedR)
        	rigidbody.AddForceAtPosition(WheelR.transform.up * antiRollForce,WheelR.transform.position); 
	} 
	
	wheelcolliders[0].steerAngle = hMove*MAX_TURN_ANGLE;
	wheelcolliders[1].steerAngle = hMove*MAX_TURN_ANGLE;
	
	brakeTorque = 0;
	wheelcolliders[0].motorTorque = WHEEL_SPEED*(vMove+Mathf.Max(-vMove/1.05,0));
	wheelcolliders[1].motorTorque = WHEEL_SPEED*(vMove+Mathf.Max(-vMove/1.05,0));
	for(wh in wheelcolliders)
	{
		wh.brakeTorque = 0;
	}
			
	// stabilize rpm around max rpm
	if((wheelcolliders[0].rpm + wheelcolliders[1].rpm)/2 > MAX_RPM)
	{
		WHEEL_SPEED -= frontWheelDecrease;
		frontWheelDecrease += .02;
		frontWheelIncrease = .02;
	}
	else
	{
		if(WHEEL_SPEED >= MAX_WHEEL_SPEED)
			WHEEL_SPEED = MAX_WHEEL_SPEED;
		else
		{
			WHEEL_SPEED += frontWheelIncrease;
			frontWheelIncrease += .02;
			frontWheelDecrease = .02;
		}
	}
	
	if(Input.GetKey("q"))
	{
		wheelcolliders[2].brakeTorque = MAX_BRAKE_TORQUE/(MAX_TURN_ANGLE+1-Mathf.Abs(wheelcolliders[0].steerAngle));
		wheelcolliders[3].brakeTorque = MAX_BRAKE_TORQUE/(MAX_TURN_ANGLE+1-Mathf.Abs(wheelcolliders[1].steerAngle));
	}
}