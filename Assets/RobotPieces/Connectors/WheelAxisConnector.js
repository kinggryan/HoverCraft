#pragma strict

public var wheels : Connector[];
public var joints : FixedJoint[];
public var wheelType : GameObject;
//public var axisType : GameObject;
//private var axes : GameObject[];
public var turnJoints : HingeJoint[];
public var chasisType : GameObject;

public class WheelAxisConnector extends Connector
{
	function Start()
	{
		wheels = new Connector[4];
//		joints = new FixedJoint[4];
//		axes = new GameObject[2];
//		turnJoints = new HingeJoint[2];
		
		var selfAttachedPieces : MachinePieceAttachments = GetComponent(MachinePieceAttachments);
		
	/*	axes[0] = GameObject.Instantiate(axisType,transform.TransformPoint(Vector3(0,-.5,.4)),transform.rotation);
		axes[1] = GameObject.Instantiate(axisType,transform.TransformPoint(Vector3(0,-.5,-.4)),transform.rotation);
		
		turnJoints[0] = gameObject.AddComponent(HingeJoint);
		turnJoints[0].anchor = Vector3(0,-.25,.4);
		turnJoints[0].connectedBody = axes[0].rigidbody;
		turnJoints[0].axis = Vector3(0,1,0);
		turnJoints[0].useLimits = true;
		turnJoints[0].limits.min = 0;
		turnJoints[0].limits.max = 0;
		
		turnJoints[1] = gameObject.AddComponent(HingeJoint);
		turnJoints[1].anchor = Vector3(0,-.25,-.4);
		turnJoints[1].connectedBody = axes[1].rigidbody;
		turnJoints[1].axis = Vector3(0,1,0);
		turnJoints[1].useLimits = true;
		turnJoints[1].limits.min = 0;
		turnJoints[1].limits.max = 0; */
		
		var makePosition : Vector3 = new Vector3(.5,-.3,.4);
		// Add the wheels. Convention : 0 = +x,+z, 1 = -x+z, 2 = +x-z, 3 = -x-z
		for(var i = 0; i < 4 ; i++)
		{
			wheels[i] = (GameObject.Instantiate(wheelType,Vector3.zero,Quaternion.LookRotation(transform.up,transform.right))).GetComponent(Connector);
		
			selfAttachedPieces.connectedObjects[i] = wheels[i].gameObject;
			//wheels[i].Connect(axes[i/2],makePosition,Vector3.right*makePosition.x/Mathf.Abs(makePosition.x));
			wheels[i].Connect(gameObject,makePosition,Vector3.right*makePosition.x/Mathf.Abs(makePosition.x));
			
			if(i % 2 == 0)
				makePosition.x *= -1;
			if(i == 1)
				makePosition.z *= -1;
				
			Physics.IgnoreCollision(collider,wheels[i].collider);
//			Physics.IgnoreCollision(axes[i/2].collider,wheels[i].collider);
				
//			Debug.Log("make pos " + makePosition);
		}
		
		selfAttachedPieces.connectedObjects[4] = GameObject.Instantiate(chasisType,transform.TransformPoint(Vector3(0,4.25,0)),transform.rotation);
		gameObject.AddComponent(FixedJoint).connectedBody = selfAttachedPieces.connectedObjects[4].rigidbody;
		
		for(var wh in wheels)
			Physics.IgnoreCollision(selfAttachedPieces.connectedObjects[4].collider, wh.collider);
	}	

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