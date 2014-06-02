#pragma strict

// Targetting Camera Class. RGK 5-24-14
// This component is attached to a camera when the player who controls that camera goes into "targetting mode" for a piece.
// The camera behavior follows behind the piece and targets along its local y axis. The player can adjust the movement of the
// piece by moving the mouse.

public var objToFollow : Connector;
public var TARGET_HEIGHT = 15;
public var TARGET_FOLLOW_DISTANCE = 40;
public var CORRECTION_SPEED = 100;
public var LOOK_AHEAD_DISTANCE = 24.0;
public var MAX_TURN_SPEED_RADIANS = Mathf.PI;
private var targetLocation : Vector3;
private var targetLookAt : Vector3;
private var crosshair: Texture;
private var crosshairLocationWorldSpace : Vector3;
private var crosshairSize = 100;
private var mousePosition : Vector2;

function Start () {
	transform.position = Vector3(0,8,-12);
	transform.rotation = Quaternion.LookRotation( objToFollow.transform.position - transform.position,Vector3.up);
//	crosshair = AssetDatabase.LoadAssetAtPath("Assets/GameCamera/crosshair.png",Texture);
	Screen.showCursor = false;
	
	// attach configurable joint in place of fixed joint
	var attachedBody = objToFollow.mainJoint.connectedBody;
	objToFollow.Destroy(objToFollow.mainJoint);
	objToFollow.mainJoint = objToFollow.gameObject.AddComponent(ConfigurableJoint);
	objToFollow.mainJoint.connectedBody = attachedBody;
	
	// configure the joint
	var tempJoint : ConfigurableJoint = objToFollow.mainJoint;
	tempJoint.xMotion = ConfigurableJointMotion.Locked;
	tempJoint.yMotion = ConfigurableJointMotion.Locked;
	tempJoint.zMotion = ConfigurableJointMotion.Locked;
	tempJoint.angularXMotion = ConfigurableJointMotion.Limited;
	tempJoint.angularYMotion = ConfigurableJointMotion.Limited;
	tempJoint.angularZMotion = ConfigurableJointMotion.Limited;
	tempJoint.lowAngularXLimit.limit = 0;
	tempJoint.highAngularXLimit.limit = 0;
	tempJoint.angularZLimit.limit = 0;
	tempJoint.angularYLimit.limit = 0;
	tempJoint.anchor = Vector3.zero;
}

function Update () {
	var followDir : Vector3 = Vector3(-objToFollow.transform.up.x,0,-objToFollow.transform.up.z);
	
	if(followDir.magnitude != 0) {
		followDir *= TARGET_FOLLOW_DISTANCE / followDir.magnitude;
		//targetLookAt = followDir * -LOOK_AHEAD_DISTANCE / followDir.magnitude;
	}
	
	crosshairLocationWorldSpace = objToFollow.transform.position + LOOK_AHEAD_DISTANCE*objToFollow.transform.up;
	
	// modify crosshair based on mouse
	var modificationVector : Vector3 = (camera.ScreenToWorldPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,1)) - camera.ScreenToWorldPoint(Vector3(mousePosition.x,mousePosition.y,1)));
	modificationVector.Normalize();
//	crosshairLocationWorldSpace += LOOK_AHEAD_DISTANCE*modificationVector;
	
	targetLookAt = crosshairLocationWorldSpace;

	targetLocation = Vector3(objToFollow.transform.position.x+followDir.x,objToFollow.transform.position.y + TARGET_HEIGHT,objToFollow.transform.position.z+followDir.z);
	
	var step = Time.deltaTime * CORRECTION_SPEED;
		
//	transform.position = targetLocation;		
		
	transform.position = Vector3.MoveTowards(transform.position,targetLocation,step);
//	transform.position = objToFollow.transform.TransformPoint(Vector3(0,15,-6));
//	transform.LookAt(objToFollow.transform.position + targetLookAt);
	transform.LookAt(crosshairLocationWorldSpace);
//	crosshairLocationWorldSpace = objToFollow.transform.position + targetLookAt;
	
	// get the movement amount and rotate.
	var lookPoint = objToFollow.transform.position + 10*objToFollow.transform.up;
	Debug.Log(lookPoint);
	var rotatedUpwards = Vector3.RotateTowards(objToFollow.transform.up,crosshairLocationWorldSpace,.01,1);
	
	// break and reform joint
/*	var savedBody = objToFollow.mainJoint.connectedBody;
	objToFollow.Destroy(objToFollow.mainJoint);
	objToFollow.transform.rotation = Quaternion.LookRotation(objToFollow.transform.forward,rotatedUpwards);
	objToFollow.mainJoint = objToFollow.gameObject.AddComponent(FixedJoint);
	objToFollow.mainJoint.connectedBody = savedBody; */
	var tempJoint : ConfigurableJoint = objToFollow.mainJoint;
	
	if(Input.GetKeyDown(KeyCode.RightArrow)) {
	//	tempJoint.lowAngularXLimit.limit += 1;
	//	tempJoint.highAngularXLimit.limit += 1;
		//tempJoint.angularZLimit.limit += 15;
//		tempJoint.angularYLimit.limit += 15;
	}
	
	// store mouse pos
	mousePosition = Input.mousePosition;
}

function OnGUI () {
	var targetPoint : Vector3 = camera.WorldToScreenPoint(crosshairLocationWorldSpace);
	GUI.DrawTexture(Rect(targetPoint.x-50,targetPoint.y-50,100,100),crosshair);
}