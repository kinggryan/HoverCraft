#pragma strict

public var objToFollow : GameObject;
private var targetLocation : Vector3;
private var targetLookAt : Vector3;
private var TARGET_HEIGHT = 15;
private var TARGET_FOLLOW_DISTANCE = 40;
private var CORRECTION_SPEED = 100;
private var LOOK_AHEAD_DISTANCE = 24;

function Start () {
	var followDir : Vector3 = Vector3(-objToFollow.transform.forward.x,0,-objToFollow.transform.forward.z);
	
	if(followDir.magnitude != 0) {
		followDir *= TARGET_FOLLOW_DISTANCE / followDir.magnitude;
		targetLookAt = followDir * -LOOK_AHEAD_DISTANCE / followDir.magnitude;
	}

	targetLocation = Vector3(objToFollow.transform.position.x+followDir.x,objToFollow.transform.position.y + TARGET_HEIGHT,objToFollow.transform.position.z+followDir.z);

	transform.position = targetLocation;
	transform.rotation = Quaternion.LookRotation( objToFollow.transform.position - transform.position,Vector3.up);
}

function Update () {
	var followDir : Vector3 = Vector3(-objToFollow.transform.forward.x,0,-objToFollow.transform.forward.z);
	
	if(followDir.magnitude != 0) {
		followDir *= TARGET_FOLLOW_DISTANCE / followDir.magnitude;
		targetLookAt = followDir * -LOOK_AHEAD_DISTANCE / followDir.magnitude;
	}

	targetLocation = Vector3(objToFollow.transform.position.x+followDir.x,objToFollow.transform.position.y + TARGET_HEIGHT,objToFollow.transform.position.z+followDir.z);
	
	var step = Time.deltaTime * CORRECTION_SPEED;
		
//	transform.position = targetLocation;		
		
	transform.position = Vector3.MoveTowards(transform.position,targetLocation,step);
//	transform.position = objToFollow.transform.TransformPoint(Vector3(0,15,-6));
	transform.LookAt(objToFollow.transform.position + targetLookAt);
}