#pragma strict

public class ShockPlateConnector extends Connector
{
	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.position = worldSpaceSide;
		transform.rotation = Quaternion.LookRotation(Vector3.up,worldSpaceDir);
		transform.position += transform.TransformDirection(.05*Vector3.up);
		GetComponent(ConfigurableJoint).connectedBody = blockObject.rigidbody;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
	}
	
	function addPieceGeneric()
	{
		var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
		// attach a piece
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		if(machinePieceInfo.connectedObjects[1] == machinePieceInfo.connectedObjects[0])
		{
			ccc.AddPieceToArm(gameObject, gameObject,Vector3(0,.05,0),Vector3.up);
		}
	}
}