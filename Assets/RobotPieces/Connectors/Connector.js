#pragma strict

protected var motorDirection : int;
protected var linkedPieces : Array;
public var mainJoint : Joint;		// this joint should link the piece to its parent body. Initialized as null.
protected var connectedCount : int;


function Start () {
	motorDirection = -1;
	linkedPieces = new Array();
}

function Update () {

}

// Both point and direction are given relative to block
function Connect (block : GameObject , attachPoint : Vector3, attachDirection : Vector3)
{
}

// This connect function is what's called during loading. We use objective saved rotations for this. Is overriden in some classes
function Connect(blockObject : GameObject, relativePosition : Vector3, rotation : Quaternion){
	//	var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(relativePosition);
		
		transform.position = relativePosition;
		transform.rotation = rotation;
		mainJoint.connectedBody = blockObject.rigidbody;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		machinePieceInfo.clearAttachments();
		machinePieceInfo.connectedObjects[0] = blockObject;
		for(var currObj : GameObject in machinePieceInfo.connectedObjects) {
			currObj = blockObject;
			Physics.IgnoreCollision(collider,blockObject.collider);
		}
		
		machinePieceInfo = blockObject.GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			Physics.IgnoreCollision(collider,blockObject.collider);
}

// This connect function is what's called during loading via Network.
@RPC
function Connect(objectView : NetworkViewID, relativePosition : Vector3, rotation : Quaternion){
	//	var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(relativePosition);
		var blockObject : GameObject = NetworkView.Find(objectView).gameObject;
		
		transform.position = relativePosition;
		transform.rotation = rotation;
		mainJoint.connectedBody = blockObject.rigidbody;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		machinePieceInfo.clearAttachments();
		machinePieceInfo.connectedObjects[0] = blockObject;
		for(var currObj : GameObject in machinePieceInfo.connectedObjects) {
			currObj = blockObject;
			Physics.IgnoreCollision(collider,blockObject.collider);
		}
		
		machinePieceInfo = blockObject.GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			Physics.IgnoreCollision(collider,blockObject.collider);
}

// Called to add an activator across the network
@RPC
function AddActivator(activatorType : String, key : String) {
	var activator : Activator = gameObject.AddComponent(activatorType);
	activator.key = key;
	activator.attachedPiece = this;
}	

// Called when we want a ONE TIME activation of the piece
function Activate () {}

// Called when we want a CONTINUOUS activation of the piece during the physics step
function FixedActivate() {}

// Called in Networked play
function ActivateNetworked() {}
function DeActivateNetworked() {}
function FixedActivateNetworked() {}

// Changes the direction of the motor
function ChangeMotorDirection() {
	// swap motor direction
	motorDirection *= -1;
}

// Handles various interactions with mouse clicks
function OnMouseDown()
{
	var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
	if(ccc.actionMode == 0)
		addPieceGeneric();
	if(ccc.actionMode == 2)
		ChangeMotorDirection();
	else if(ccc.actionMode == 3)
	{
		//rotatePieceGeneric();
		var bttn : RotationScrollerScript = GameObject.Find("ButtonRotateControls").GetComponent("RotationScrollerScript");
		bttn.relatedConnector = this;
	}
	else if(ccc.actionMode == 4)
		ccc.LinkObjects(this);
	else if(ccc.actionMode == 5)
	{
		// replace self with null in all connected machinepieces
		var machPieces : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj in machPieces.connectedObjects)
		{
			var connector : Connector = currObj.GetComponent("Connector");
			connector.connectedCount--;
			var otherMachPieces : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
			for(var index = 0 ; index < otherMachPieces.numberOfConnectedObjects ; index++)
				if(otherMachPieces.connectedObjects[index] == gameObject)
					otherMachPieces.connectedObjects[index] = null;
		}
		
		// destroy self
		GameObject.Destroy(gameObject);
	}
	else if(ccc.actionMode == 6) { // add keybinded activator
		var tempActivator = GetComponent("KeyBindedActivator");
		if(tempActivator != null)
			Destroy(tempActivator);
		ccc.AddKeyBindedActivator(this);
	}
}

function rotate(angleToRotate: float)
{
}

function addPieceGeneric()
{
}

function rotatePieceGeneric()
{}

function rotate(angleToRotate:float, axis:Vector3) {}

// Draws an arrow. Position is given relative to the gameobject
function DrawArrow(position : Vector3, direction : Vector3, color : Color)
{
	var arrow : LineRenderer = gameObject.GetComponent("LineRenderer");
	if(arrow == null)
		arrow = gameObject.AddComponent("LineRenderer");	
		
	arrow.SetVertexCount(5);
	arrow.SetColors(color,color);
	arrow.SetWidth(.1,.1);
	arrow.SetPosition(0,position);
	arrow.SetPosition(1,position+direction);
	
	// find the rotation that we used here
	var siderotation : Quaternion = Quaternion.AngleAxis(Vector3.Angle(Vector3.up,direction),Vector3.Cross(Vector3.up,direction));
	
	var sideVector = Vector3(.5,.5,0);
	var sideVector2 = Vector3(-.5,.5,0);
	
	arrow.SetPosition(2,position+direction-siderotation*sideVector);
	arrow.SetPosition(3,position+direction);
	arrow.SetPosition(4,position+direction-siderotation*sideVector2);
}

function RemoveArrow()
{
	Component.Destroy(GetComponent("LineRenderer"));
}

function DrawMotorArrow()
{
}

function DrawRotationArrow()
{
}

function ActivateLinkedPiece()
{
	for(var currPiece : Connector in linkedPieces)
		currPiece.Activate();
}

function GetLinkedPieceCount()
{
	return linkedPieces.Count;
}

function LinkPiece(piece : Connector)
{
	linkedPieces.push(piece);
}

function AddMotion(motion : float)
{}

function EnableDisableMotor(mode : boolean)
{}

function DeActivate()
{}

function AddMotionController() : MotionController
{ return null; }