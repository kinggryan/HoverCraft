#pragma strict

public class ArmConnector extends Connector
{

	function Start () {

	}

	function Update () {

	}

/*	function Connect (blockObject : GameObject , side : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(.6*side);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(side);
		
		transform.position = worldSpaceSide;
		transform.rotation = Quaternion.LookRotation(Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x),worldSpaceDir);
		GetComponent(ConfigurableJoint).connectedBody = blockObject.rigidbody;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
	} */
}