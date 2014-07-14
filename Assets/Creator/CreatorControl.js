#pragma strict

public var machinePieceToCreate : GameObject;
public var actionMode : int;
public var highlightColor : Color;
private var linkedObj : Connector;
public var rootPiece : GameObject;
public var motionControllerType : MonoBehaviour;
public var chasisType : GameObject;
public var activatorKey : String;

function Start () {
//	machinePieceToCreate = null;
	linkedObj = null;
	Physics.gravity = Vector3(0,0,0);
	actionMode = 0; // 0 is add pieces
					// 1 is active
					// 2 is change activation direction
	highlightColor = Color(.5,.5,1);
	
	var plate : GameObject;
	
	// initialize start body	
	if(MachineDesignManager.loadFlag) {
		MachineDesignManager.LoadMachineDesign(MachineDesignManager.loadFileName);
		MachineDesignManager.loadFlag = false;
	}
	else {
		plate = GameObject.Find("HoverPlate");
		var plateAttachedPieces : MachinePieceAttachments = GameObject.Find("HoverPlate").GetComponent("MachinePieceAttachments");
		plateAttachedPieces.clearAttachments();
		plateAttachedPieces.connectedObjects[4] = GameObject.Instantiate(chasisType,plate.transform.TransformPoint(Vector3(0,3.5,0)),plate.transform.rotation);
		plate.gameObject.GetComponent(FixedJoint).connectedBody = plateAttachedPieces.connectedObjects[4].rigidbody;
		var otherAttachedPieces : MachinePieceAttachments = plateAttachedPieces.connectedObjects[4].GetComponent("MachinePieceAttachments");
		otherAttachedPieces.clearAttachments();
		otherAttachedPieces.connectedObjects[0] = plate.gameObject;
		//rootPiece = plateAttachedPieces.connectedObjects[4].gameObject;
		rootPiece = plate;
		plate.rigidbody.freezeRotation = true;
	}
	
	for(var currObj in GameObject.FindGameObjectsWithTag("piece")) {
		if(currObj.rigidbody != null)
			currObj.rigidbody.constraints = RigidbodyConstraints.FreezeAll;
	}
}

function AddPieceToBlock(block : GameObject, side : Vector3, direction : Vector3, index : int){
	var machinePieceInfo : MachinePieceAttachments = block.GetComponent("MachinePieceAttachments");

	if(machinePieceInfo.connectedObjects[index] == null)
	{
		// create new object, clear its attachments, and connect
		var newObj : GameObject = Instantiate(machinePieceToCreate,Vector3(0,0,0), Quaternion.identity);
		var newObjAttachments : MachinePieceAttachments = newObj.GetComponent("MachinePieceAttachments");
		newObjAttachments.clearAttachments();
		var connector : Connector = newObj.GetComponent("Connector");
		connector.Connect(block, side, direction);
		
		// as we're in build mode, make the object non-interactive with the other pieces.
	//	newObj.rigidbody.freezeRotation = true;
	//	newObj.rigidbody.detectCollisions = false;
	
		machinePieceInfo.connectedObjects[index] = newObj;
		
		var bttn : RotationScrollerScript = GameObject.Find("ButtonRotateControls").GetComponent("RotationScrollerScript");
		bttn.relatedConnector = newObj.GetComponent("Connector");
	}
	else
		Debug.Log("Slot is Full : " + index);
}

function AddPieceToArm(arm : GameObject, armJoint : GameObject, attachPoint : Vector3, attachDirection : Vector3)
{
	var newObj : GameObject = Instantiate(machinePieceToCreate,Vector3(0,0,0), Quaternion.identity);
	var newObjAttachments : MachinePieceAttachments = newObj.GetComponent("MachinePieceAttachments");
	newObjAttachments.clearAttachments();
	var connector : Connector = newObj.GetComponent("Connector");
	connector.Connect(armJoint,attachPoint,attachDirection);
	newObj.rigidbody.freezeRotation = true;
	newObj.rigidbody.detectCollisions = false;
	
	var machinePieceInfo : MachinePieceAttachments = arm.GetComponent("MachinePieceAttachments");
	machinePieceInfo.connectedObjects[1] = newObj;
	
	var bttn : RotationScrollerScript = GameObject.Find("ButtonRotateControls").GetComponent("RotationScrollerScript");
	bttn.relatedConnector = newObj.GetComponent("Connector");
}

function AddPieceToPiston(piston1 : GameObject, piston2 : GameObject, attachPoint : Vector3, attachDirection : Vector3)
{
	var newObj : GameObject = Instantiate(machinePieceToCreate,Vector3(0,0,0), Quaternion.identity);
	var newObjAttachments : MachinePieceAttachments = newObj.GetComponent("MachinePieceAttachments");
	newObjAttachments.clearAttachments();
	var connector : Connector = newObj.GetComponent("Connector");
	connector.Connect(piston2,attachPoint,attachDirection);
	newObj.rigidbody.freezeRotation = true;
	newObj.rigidbody.detectCollisions = false;
	
	var machinePieceInfo : MachinePieceAttachments = piston1.GetComponent("MachinePieceAttachments");
	machinePieceInfo.connectedObjects[1] = newObj;
}

function SetFirstLinkObj(piece : Connector)
{
	linkedObj = piece;
}

function LinkObjects(piece : Connector)
{
	// if you haven't clicked an object yet, store it. Otherwise, link the two and set stored obj to null.
	if(linkedObj == null)
		SetFirstLinkObj(piece);
	else
	{
		linkedObj.LinkPiece(piece);
		piece.LinkPiece(linkedObj);
		linkedObj = null;
	}	
}

// Adds a keybinded activator to a piece
function AddKeyBindedActivator(piece : Connector) {
	var kba : KeyBindedActivator = piece.gameObject.AddComponent("KeyBindedActivator");
	kba.key = activatorKey;
}

// Fixed Game Camera Behind Machine
function SwitchToPlayMode()
{
	var plate : GameObject;

	for(var currObj in GameObject.FindGameObjectsWithTag("piece")) {
		if(currObj.rigidbody != null)
			currObj.rigidbody.constraints = RigidbodyConstraints.None;
		if(currObj.GetComponent(HoverPlateConnector) != null)
			plate = currObj;
	}

	GameObject.Find("Main Camera").transform.position = Vector3(0,8,-12);
	Debug.Log("Switching To Play Mode");
	GameObject.Find("Main Camera").GetComponent(CameraMover).Destroy(GameObject.Find("Main Camera").GetComponent(CameraMover),0);
	var follower : CameraRobotFollower = GameObject.Find("Main Camera").AddComponent("CameraRobotFollower");
	follower.objToFollow = rootPiece;
	
	plate.AddComponent("HoverPlateMotionController");
}