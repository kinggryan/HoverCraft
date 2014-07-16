#pragma strict

// Targetting Camera Class. RGK 5-24-14
// This component is attached to a camera when the player who controls that camera goes into "targetting mode" for a piece.
// The camera behavior follows behind the piece and targets along its local y axis. The player can adjust the movement of the
// piece by moving the mouse.

public var objToFollow : Connector;
public var TARGET_HEIGHT = 15;
public var TARGET_FOLLOW_DISTANCE = 20;
public var CORRECTION_SPEED = 100;
public var LOOK_AHEAD_DISTANCE = 24.0;
public var MAX_TURN_SPEED_RADIANS = Mathf.PI;
private var targetLocation : Vector3;
private var targetLookAt : Vector3;
private var crosshair: Texture;
public var crosshairLocationWorldSpace : Vector3;
private var crosshairSize = 100;
private var mousePosition : Vector2;
private var vectorToCrosshair : Vector3;

private var XAimLimits : float;
private var YAimLimits : float;
private var	xAngle : float;
private var yAngle : float;
private var aimSpeed : float;
private var initialRotation : Quaternion;

function Start () {
	crosshairLocationWorldSpace = objToFollow.transform.TransformPoint(0,LOOK_AHEAD_DISTANCE,0);
	
	Debug.Log(crosshairLocationWorldSpace);
	Debug.Log(objToFollow.transform.up);
	Debug.Log(objToFollow.transform.TransformPoint(0,0,0));
	Debug.Log(objToFollow.transform.TransformPoint(0,1,0));

	transform.position = objToFollow.transform.position + -8*objToFollow.transform.up + 4* Vector3.up;
//	transform.rotation = Quaternion.LookRotation( crosshairLocationWorldSpace - objToFollow.transform.position,Vector3.up);
	transform.LookAt(crosshairLocationWorldSpace);
	crosshair = Resources.Load("crosshair",Texture);
	Screen.showCursor = false;
	
	vectorToCrosshair = objToFollow.transform.InverseTransformPoint(crosshairLocationWorldSpace);
	
	// set up limits
	var BM : BattleManager = objToFollow.GetComponent(BattleManager);
	XAimLimits = BM.XAimLimits;
	YAimLimits = BM.YAimLimits;
	xAngle = 0;
	yAngle = 0;
	aimSpeed = BM.aimDegreesPerSecond;
	
	initialRotation = objToFollow.transform.localRotation;
}

function Update () {
	var sensitivityX = 15F;
	var sensitivityY = 15F;
	
	var aimSpeedDT = Time.deltaTime * aimSpeed;
	
	// get rotation
	var rotationY = Input.GetAxis("Mouse Y") * sensitivityY;
	rotationY = Mathf.Clamp (rotationY, -aimSpeedDT, aimSpeedDT);
	
	var rotationX = Input.GetAxis("Mouse X") * sensitivityX;
	rotationX = Mathf.Clamp(rotationX, -aimSpeedDT, aimSpeedDT);
	
	xAngle += rotationX;
	yAngle += rotationY;
	var diff : float;
	
	// apply limits
	if(xAngle > XAimLimits) {
		diff = xAngle - XAimLimits;
		xAngle = XAimLimits;
		rotationX -= diff;
	}
	if(xAngle < -XAimLimits) {
		diff = xAngle + XAimLimits;
		xAngle = -XAimLimits;
		rotationX -= diff;
	}
	if(yAngle > YAimLimits) {
		diff = yAngle - YAimLimits;
		yAngle = YAimLimits;
		rotationY -= diff;
	}
	if(yAngle < -YAimLimits) {
		diff = yAngle + YAimLimits;
		yAngle = -YAimLimits;
		rotationY -= diff;
	} 
	
	// rotate obj
	objToFollow.transform.Rotate(0, rotationX, 0, Space.World);
	objToFollow.transform.Rotate(rotationY,0,0);
	
	// positioin crosshair and camera
	crosshairLocationWorldSpace = objToFollow.transform.position + LOOK_AHEAD_DISTANCE*objToFollow.transform.up; //objToFollow.transform.TransformPoint(0,LOOK_AHEAD_DISTANCE,0);
		
	transform.position = objToFollow.transform.position + -8*objToFollow.transform.up + 4*Vector3.up;//objToFollow.transform.TransformPoint(0,-8,0) + 4* Vector3.up;
	transform.LookAt(crosshairLocationWorldSpace);
	
	// Activate piece
	if(Input.GetMouseButtonDown(0))
		objToFollow.Activate();
	if(Input.GetMouseButtonUp(0))
		objToFollow.DeActivate();
}

function FixedUpdate()
{
	if(Input.GetMouseButton(0))
	{
		objToFollow.FixedActivate();
	}
}

function OnGUI () {
	var targetPoint : Vector3 = camera.WorldToScreenPoint(crosshairLocationWorldSpace);
	GUI.DrawTexture(Rect(targetPoint.x-50,targetPoint.y-50,100,100),crosshair);
}

function OnDestroy() {
	objToFollow.transform.localRotation = initialRotation;
}