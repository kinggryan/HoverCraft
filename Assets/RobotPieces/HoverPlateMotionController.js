#pragma strict

class HoverPlateMotionController extends MotionController {

private var lifter : ConstantForce;
private var upwardsCorrectionAccelerations : float[];
private var downwardsCorrectionAccelerations : float[];
//private var upwardsCorrectionAcceleration = 0.2;
//private var downwardsCorrectionAcceleration = 0.2;
private var previousPoints : Vector3[];
private var previousDistances : float[];
private var ADJUSTMENT_CORRECTION_CHANGE_RATE = 10; //.24;
private var MAXIMUM_FORWARD_VELOCITY = 40;
private var MAXIMUM_TURN_RATE = 2;
private var MAXIMUM_STRAFE_VELOCITY = 30;
private var BACKWARDS_TO_FORWARDS_SPEED_RATIO = .5;

function Start()
{
//	lifter = gameObject.AddComponent("ConstantForce");
//	lifter.force = Vector3(0,19.6,0);
//	lifter.force = Vector3(0,9.8,0);
//	lifter.relativeForce = 43*Vector3(0,1,0);
	//rigidbody.freezeRotation = true;
	upwardsCorrectionAccelerations = new float[4];
	downwardsCorrectionAccelerations = new float[4];
	previousPoints = new Vector3[4];
	previousDistances = new float[4];
	
	for(var fl in upwardsCorrectionAccelerations)
		fl = .02;
	for(var fl in downwardsCorrectionAccelerations)
		fl = .02;
	
	var liftPoint = Vector3(.5,0,.4);
	
	for(var i = 0 ; i < 4 ; i++)
	{
		previousPoints[i] = transform.TransformPoint(liftPoint);
		
		if(i % 2 == 0)
			liftPoint.x *= -1;
		if(i == 1)
			liftPoint.z *= -1;
	} 
	
	//rigidbody.centerOfMass = Vector3(0,0,.4);
}

function FixedUpdate()
{	
	
	var liftPoint = Vector3(.5,0,.4);
	//var liftPoint = Vector3(0,0,0);
	
	for(var i = 0 ; i < 4 ; i++)
	{
		var forceAdjustment = 0;
		
		var hitInfo : RaycastHit;
		var layermask = 1 << 8;
		Physics.Raycast(transform.TransformPoint(liftPoint),Vector3.down,hitInfo,Mathf.Infinity,layermask);
	
	//	if((transform.TransformPoint(liftPoint) - previousPoints[i]).y > 0)
		if(hitInfo.distance - previousDistances[i] > 0)
		{
			forceAdjustment -= downwardsCorrectionAccelerations[i];
			downwardsCorrectionAccelerations[i] += ADJUSTMENT_CORRECTION_CHANGE_RATE;
			upwardsCorrectionAccelerations[i] = ADJUSTMENT_CORRECTION_CHANGE_RATE;
		}
	//	else if((transform.TransformPoint(liftPoint) - previousPoints[i]).y < 0)
		else if(hitInfo.distance - previousDistances[i] < 0)
		{
			forceAdjustment += upwardsCorrectionAccelerations[i];
			upwardsCorrectionAccelerations[i] += ADJUSTMENT_CORRECTION_CHANGE_RATE;
			downwardsCorrectionAccelerations[i] = ADJUSTMENT_CORRECTION_CHANGE_RATE;
		}
		
	//	rigidbody.AddForceAtPosition(((33*Vector3(0,Mathf.Min(Mathf.Pow(2.5-transform.TransformPoint(liftPoint).y,5),1000),0))+Vector3(0,forceAdjustment,0)),transform.TransformPoint(liftPoint));
		rigidbody.AddForceAtPosition(((99*Vector3(0,Mathf.Min(Mathf.Pow(5.5-hitInfo.distance,3),1000),0))+Vector3(0,forceAdjustment,0)),transform.TransformPoint(liftPoint));
	//	previousPoints[i] = transform.TransformPoint(liftPoint);

		previousDistances[i] = hitInfo.distance;
	
		if(i % 2 == 0)
			liftPoint.x *= -1;
		if(i == 1)
			liftPoint.z *= -1;
	}
	
	// do player controlled movement
//	var hMove = Input.GetAxis("Horizontal");
//	var	vMove = Input.GetAxis("Vertical");
	var hMove : float = 0;
	var vMove : float = 0;
	var strafe : float = 0;
	
	if(Input.GetKey(kForward))
		vMove = 1;
	if(Input.GetKey(kBackward))
		vMove -= 1 * BACKWARDS_TO_FORWARDS_SPEED_RATIO;
	if(Input.GetKey(kTurnRight))
		hMove += 1;
	if(Input.GetKey(kTurnLeft))
		hMove -= 1;
	if(Input.GetKey(kStrafeRight))
		strafe += 1;
	if(Input.GetKey(kStrafeLeft))
		strafe -= 1;
	
	// add force based on the desired motion compared to the current motion // -3.96
	rigidbody.AddRelativeForce(Vector3(0,0,36*(MAXIMUM_FORWARD_VELOCITY*vMove - transform.InverseTransformDirection(rigidbody.velocity).z)));
	rigidbody.AddForceAtPosition(transform.TransformDirection(Vector3(0,-7.92*(MAXIMUM_FORWARD_VELOCITY*vMove - transform.InverseTransformDirection(rigidbody.velocity).z),0)),transform.TransformPoint(Vector3(0,0,1)));
	rigidbody.AddRelativeTorque(Vector3(0,200*(MAXIMUM_TURN_RATE*hMove - transform.InverseTransformDirection(rigidbody.angularVelocity).y)),0);
	rigidbody.AddRelativeForce(Vector3(36*(MAXIMUM_STRAFE_VELOCITY*strafe - transform.InverseTransformDirection(rigidbody.velocity).x),0,0));
//	rigidbody.AddForceAtPosition(transform.TransformDirection(Vector3(36*(MAXIMUM_STRAFE_VELOCITY*strafe - transform.InverseTransformDirection(rigidbody.velocity).x),0,0)),transform.TransformPoint(Mathf.Pow(rigidbody.centerOfMass.magnitude,2)*rigidbody.centerOfMass));
	rigidbody.AddForceAtPosition(transform.TransformDirection(Vector3(0,-10.2*(MAXIMUM_STRAFE_VELOCITY*strafe - transform.InverseTransformDirection(rigidbody.velocity).x),0)),transform.TransformPoint(Vector3(1,0,0)));
}

}