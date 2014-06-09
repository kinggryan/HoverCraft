#pragma strict

private var MAXIMUM_FORWARD_VELOCITY = 20;
private var MAXIMUM_TURN_RATE = 2;
private var MAXIMUM_STRAFE_VELOCITY = 15;

function FixedUpdate()
{	
	// do player controlled movement
	var hMove = Input.GetAxis("Horizontal");
	var	vMove = Input.GetAxis("Vertical");
	var strafe : int;
	if(Input.GetKey("q"))
		strafe = -1;
	else if (Input.GetKey("e"))
		strafe = 1;
	
	// add force based on the desired motion compared to the current motion // -3.96
/*	rigidbody.AddRelativeForce(Vector3(0,0,18*(MAXIMUM_FORWARD_VELOCITY*vMove - transform.InverseTransformDirection(rigidbody.velocity).z)));
	rigidbody.AddForceAtPosition(transform.TransformDirection(Vector3(0,-3.96*(MAXIMUM_FORWARD_VELOCITY*vMove - transform.InverseTransformDirection(rigidbody.velocity).z),0)),transform.TransformPoint(Vector3(0,0,1)));
	rigidbody.AddRelativeTorque(Vector3(0,30*(MAXIMUM_TURN_RATE*hMove - transform.InverseTransformDirection(rigidbody.angularVelocity).y)),0);
	rigidbody.AddRelativeForce(Vector3(18*(MAXIMUM_STRAFE_VELOCITY*strafe - transform.InverseTransformDirection(rigidbody.velocity).x),0,0));
	rigidbody.AddForceAtPosition(transform.TransformDirection(Vector3(0,-5.1*(MAXIMUM_STRAFE_VELOCITY*strafe - transform.InverseTransformDirection(rigidbody.velocity).x),0)),transform.TransformPoint(Vector3(1,0,0)));
*/
	rigidbody.AddForce(20*Vector3.forward*vMove*(MAXIMUM_FORWARD_VELOCITY-transform.TransformDirection(rigidbody.velocity).z));
}