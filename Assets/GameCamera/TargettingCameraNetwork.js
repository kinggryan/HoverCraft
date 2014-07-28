#pragma strict

// Targetting Camera Network Class. RGK 5-24-14
// This component is attached to a camera when the player who controls that camera goes into "targetting mode" for a piece.
// The camera behavior follows behind the piece and targets along its local y axis.

/**************
	
	Client-Only Class
	
	************/

public var objToFollow : Transform;
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

function Start () {
	// set crosshair location

	crosshairLocationWorldSpace = objToFollow.transform.TransformPoint(0,LOOK_AHEAD_DISTANCE,0);

	transform.position = objToFollow.position + -8*objToFollow.up + 4* Vector3.up;
//	transform.rotation = Quaternion.LookRotation( crosshairLocationWorldSpace - objToFollow.transform.position,Vector3.up);
	transform.LookAt(crosshairLocationWorldSpace);
	crosshair = Resources.Load("crosshair",Texture);
	Screen.showCursor = false;
	
	vectorToCrosshair = objToFollow.InverseTransformPoint(crosshairLocationWorldSpace);
}

function Update () {
	// positioin crosshair and camera
	crosshairLocationWorldSpace = objToFollow.position + LOOK_AHEAD_DISTANCE*objToFollow.up; //objToFollow.transform.TransformPoint(0,LOOK_AHEAD_DISTANCE,0);
		
	transform.position = objToFollow.position + -8*objToFollow.transform.up + 4*Vector3.up;//objToFollow.transform.TransformPoint(0,-8,0) + 4* Vector3.up;
	transform.LookAt(crosshairLocationWorldSpace);
}

function OnGUI () {
	var targetPoint : Vector3 = camera.WorldToScreenPoint(crosshairLocationWorldSpace);
	GUI.DrawTexture(Rect(targetPoint.x-50,targetPoint.y-50,100,100),crosshair);
}