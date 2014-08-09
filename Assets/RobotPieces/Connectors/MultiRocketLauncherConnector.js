#pragma strict

public var rotationGrabberType : GameObject;
public var projectileType : GameObject;
public var numberOfRocketsToFire : int = 3;
public var intraVolleyRocketDelay : float = .15;
public var reloadTime : float = 1.8;
public var maximumSpread : float = 7;
private var loaded = true;
private var battleManager : BattleManager;

public class MultiRocketLauncherConnector extends Connector
{
	function Connect (blockObject : GameObject , attachPoint : Vector3, attachDirection : Vector3){
		var worldSpaceSide : Vector3 = blockObject.transform.TransformPoint(attachPoint);
		var worldSpaceDir : Vector3 = blockObject.transform.TransformDirection(attachDirection);
		
		transform.position = worldSpaceSide;
		transform.rotation = Quaternion.LookRotation(worldSpaceDir,Vector3(worldSpaceDir.y,worldSpaceDir.z,worldSpaceDir.x));
		transform.position += .5 * worldSpaceDir;
		
		var machinePieceInfo : MachinePieceAttachments = GetComponent("MachinePieceAttachments");
		for(var currObj : GameObject in machinePieceInfo.connectedObjects)
			currObj = blockObject;
			
		transform.parent = blockObject.transform;
		
		if(Network.isServer)
			networkView.RPC("AddActivator",RPCMode.All,"KeyBindedActivatorNetworked","1");
		else if(!Network.isClient)
			gameObject.AddComponent(KeyBindedActivatorNetworked).key = "1";
			
		loaded = true;
	}
	
	function Start() {
		battleManager = GetComponent("BattleManager");
	}
	
	function rotatePieceGeneric()
	{
		// destroy other rotation grabbers and create a new rotation grabber for this object
		GameObject.Destroy(GameObject.Find("RotationGrabberObject"));
			
		var rGrabber : GameObject = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(0,4,0)),Quaternion.identity);
		var rGrabberData : RotationGrabber = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 4;
		rGrabberData.anchorPoint = transform.position;
		//rGrabberData.rotationAxis = transform.TransformDirection(Vector3.forward);
		rGrabberData.rotationAxis = Vector3.forward;
		rGrabberData.grabbedObj = this;
		
		rGrabber = Instantiate(rotationGrabberType,transform.TransformPoint(Vector3(4,0,0)),Quaternion.identity);
		rGrabberData = rGrabber.GetComponent("RotationGrabber");
		rGrabberData.radius = 4;
		rGrabberData.anchorPoint = transform.position;
		//rGrabberData.rotationAxis = transform.TransformDirection(Vector3.right);
		rGrabberData.rotationAxis = Vector3.up;
		rGrabberData.grabbedObj = this; 
		
		DrawRotationArrow();
	}
	
	function AddActivators() {
		if(Network.isServer)
			networkView.RPC("AddActivator",RPCMode.All,"KeyBindedActivatorNetworked","1");
	}
	
	function rotate(angleToRotate: float, axis : Vector3)
	{
		// rotate around the hinge joint
		var anchorPoint : Vector3 = Vector3.zero;
		transform.RotateAround(transform.TransformPoint(anchorPoint),axis,-angleToRotate);
	//	rigidbody.angularVelocity = Vector3.zero;
				
		DrawRotationArrow();
	}
	
	function DrawRotationArrow()
	{
		DrawArrow(transform.position,2*transform.TransformDirection(Vector3.up),Color(1,1,1));
	}
	
	function Activate()
	{
		if(loaded && !battleManager.IsOverHeated())
		{
			loaded = false;
			
			for(var i = 0 ; i < numberOfRocketsToFire ; i++) {
				var tempObj = GameObject.Instantiate(projectileType,transform.TransformPoint(-.4 + .8 * (1.0*i) / (numberOfRocketsToFire-1),0,0),transform.rotation);
				tempObj.transform.RotateAround(tempObj.transform.position,transform.forward,maximumSpread - (1.0*i/numberOfRocketsToFire * 2 * maximumSpread));
				//Debug.Log("Rotating: " + (-maximumSpread + (2.0*i/(numberOfRocketsToFire-1) * maximumSpread)));
				var tempObjM : RocketProjectileManager = tempObj.GetComponent("RocketProjectileManager");
				tempObjM.relatedBM = GetComponent("BattleManager");
		//		yield WaitForSeconds(intraVolleyRocketDelay);
			}
			
			StartCoroutine("Reload");
			battleManager.AddHeat();
		}
	}
	
	function ActivateNetworked()
	{
		if(loaded && !battleManager.IsOverHeated())
		{
			loaded = false;
			
			for(var i = 0 ; i < numberOfRocketsToFire ; i++) {
				var tempObj = Network.Instantiate(projectileType,transform.TransformPoint(-.4 + .8 * (1.0*i) / (numberOfRocketsToFire-1),0,0),transform.rotation,0);
				tempObj.transform.RotateAround(tempObj.transform.position,transform.forward,maximumSpread - (1.0*i/numberOfRocketsToFire * 2 * maximumSpread));
				//Debug.Log("Rotating: " + (-maximumSpread + (2.0*i/(numberOfRocketsToFire-1) * maximumSpread)));
				var tempObjM : RocketProjectileManager = tempObj.GetComponent("RocketProjectileManager");
				tempObjM.relatedBM = GetComponent("BattleManager");
		//		yield WaitForSeconds(intraVolleyRocketDelay);
			}
			
			StartCoroutine("Reload");
			battleManager.AddHeat();
		}
	}
	
	function Reload()
	{
		yield WaitForSeconds(reloadTime);
		loaded = true;
	}
}