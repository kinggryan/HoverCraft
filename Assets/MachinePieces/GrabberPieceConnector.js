#pragma strict

public class GrabberPieceConnector extends Connector
{
	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.rotation = Quaternion.LookRotation(Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x),worldSpaceDir);
		transform.position = worldSpaceSide + transform.TransformPoint(.5*Vector3.up);
		GetComponent(FixedJoint).connectedBody = blockObject.rigidbody;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
	}
}