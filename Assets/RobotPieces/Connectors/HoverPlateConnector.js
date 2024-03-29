﻿#pragma strict

public var chasisType : GameObject;

public class HoverPlateConnector extends Connector
{
	function Start()
	{	
/*		var selfAttachedPieces : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		selfAttachedPieces.connectedObjects[4] = GameObject.Instantiate(chasisType,transform.TransformPoint(Vector3(0,3.5,0)),transform.rotation);
		gameObject.GetComponent(FixedJoint).connectedBody = selfAttachedPieces.connectedObjects[4].rigidbody;
		var otherAttachedPieces : MachinePieceAttachments = selfAttachedPieces.connectedObjects[4].GetComponent("MachinePieceAttachments");
		otherAttachedPieces.connectedObjects[0] = gameObject;
		var ccc : CreatorControl = GameObject.Find("MainCreatorControl").GetComponent("CreatorControl");
		ccc.rootPiece = selfAttachedPieces.connectedObjects[4].gameObject; */
	}	

	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.position = worldSpaceSide;
		transform.rotation = Quaternion.LookRotation(Vector3.up,worldSpaceDir);
		transform.position += transform.TransformDirection(.05*Vector3.up);
		GetComponent(FixedJoint).connectedBody = blockObject.rigidbody;
		
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
	
	function AddMotionController() : MotionController {
		var cntlr : MotionController = gameObject.AddComponent("HoverPlateMotionController");
		return(cntlr);
	}
}