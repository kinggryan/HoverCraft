#pragma strict

// DO NOT USE

public var connectedBody : GameObject;
public var jointVector : Vector3;
private var forwardDiff : Vector3;
private var upwardDiff : Vector3;
private var prevPoint : Vector3;

function SetUpJoint(body1 : Transform, body2 : Transform) {
	jointVector = body2.position - body1.position;
	forwardDiff = body2.transform.forward - body1.transform.forward;
	upwardDiff = body2.transform.up - body1.transform.up;
	prevPoint = transform.position;
	body1.transform.parent = body2.transform;
}

function Update () {
//	connectedBody.rigidbody.isKinematic = true;
	//connectedBody.transform.position = transform.position + transform.TransformDirection(jointVector);
//	connectedBody.rigidbody.isKinematic = false;
	connectedBody.transform.position = transform.position + jointVector;
//	connectedBody.transform.rotation = Quaternion.LookRotation(transform.forward + forwardDiff,transform.up + upwardDiff);
	//prevPoint = transform.position;
}