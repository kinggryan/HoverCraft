#pragma strict

public var pistonPart : GameObject;
private var attachedPistonPart : GameObject;

public class PistonConnector extends Connector
{
	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.position = worldSpaceSide;
		transform.rotation = Quaternion.LookRotation(Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x),worldSpaceDir);
		transform.position += transform.TransformDirection(Vector3.up);
		GetComponent(FixedJoint).connectedBody = blockObject.rigidbody;
		
		// add second piece of piston
		attachedPistonPart = GameObject.Instantiate(pistonPart,transform.TransformPoint(Vector3.up * .25),transform.rotation);
		Physics.IgnoreCollision(attachedPistonPart.collider,collider);
		GetComponent(ConfigurableJoint).connectedBody = attachedPistonPart.rigidbody;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
	}
	
/*	function OnMouseDown() {
		var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
		if(ccc.actionMode == 0)
		{
			// attach a piece
			var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
			if(machinePieceInfo.connectedObjects[1] == machinePieceInfo.connectedObjects[0])
			{
				ccc.AddPieceToPiston(gameObject,attachedPistonPart,Vector3(0,.8,0),Vector3.up);
			}
		}
		else if(ccc.actionMode == 2)
		{	
			// change motor direction
			ChangeMotorDirection();
		}
		else if(ccc.actionMode == 4)
		{
			ccc.LinkObjects(this);
		}
		else if(ccc.actionMode == 5)
		{
			GameObject.Destroy(gameObject);
		}
	} */

	function addPieceGeneric()
	{
		var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
		// attach a piece
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		if(machinePieceInfo.connectedObjects[1] == machinePieceInfo.connectedObjects[0])
		{
			ccc.AddPieceToPiston(gameObject,attachedPistonPart,Vector3(0,.8,0),Vector3.up);
		}
	}

	function Activate() {
		// TODO figure out why this number needs to be so high
		GetComponent(ConfigurableJoint).targetVelocity = Vector3(0,3,0);
	}
}