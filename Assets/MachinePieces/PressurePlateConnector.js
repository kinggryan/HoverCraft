#pragma strict

public var pressurePlatePart : GameObject;
private var attachedPlatePart : GameObject;

public class PressurePlateConnector extends Connector
{
	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.position = worldSpaceSide;
		transform.rotation = Quaternion.LookRotation(Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x),worldSpaceDir);
		transform.position += transform.TransformDirection(Vector3.up*.1);
		GetComponent(FixedJoint).connectedBody = blockObject.rigidbody;
		
		// add second piece of piston
		attachedPlatePart = GameObject.Instantiate(pressurePlatePart,transform.TransformPoint(Vector3.up),transform.rotation);
		Physics.IgnoreCollision(attachedPlatePart.collider,collider);
		GetComponent(ConfigurableJoint).connectedBody = attachedPlatePart.rigidbody;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
	}
	
/*	function OnMouseDown()
	{
		var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
		if(ccc.actionMode == 4)
		{
			ccc.LinkObjects(this);
		}
		else if(ccc.actionMode == 5)
		{
			GameObject.Destroy(gameObject);
		}
	} */
	
	function Update()
	{
		// check for pressure plate being pushed all the way
		if(Vector3.Distance(transform.position,attachedPlatePart.transform.position) <= .01)
		{
			ActivateLinkedPiece();
		}
	}
}