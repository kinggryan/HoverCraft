#pragma strict

// For use with wheel colliders

public var wheelAxis : WheelAxisConnector;
private var wheelbodies : Rigidbody[];
public var WHEEL_SPEED = 25;

// Convention : 0 = +x,+z, 1 = -x+z, 2 = +x-z, 3 = -x-z

function Start()
{
	wheelbodies = new Rigidbody[4];
	for(var i = 0 ; i < 4 ; i++)
		wheelbodies[i] = wheelAxis.wheels[i].rigidbody;
}

function Update()
{
	var hMove = Input.GetAxis("Horizontal");
	var	vMove = Input.GetAxis("Vertical");
	
//	Debug.Log("V Move : "+ vMove);
	
	wheelbodies[0].AddRelativeForce(WHEEL_SPEED*Vector3.forward*vMove);
	wheelbodies[1].AddRelativeForce(WHEEL_SPEED*Vector3.forward*vMove);
}
