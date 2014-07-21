#pragma strict

class TargettingActivatorNetworked extends Activator {

	public var controlledByMe : boolean = false;
	
	private var keyPressed : boolean = false;
	
	var selected : boolean = false;
	var mainCamFollowPiece : GameObject;
	
	function Start() {
		if(Network.isServer) {
			attachedPiece = GetComponent(Connector);
		}
		else {
			mainCamFollowPiece = GameObject.Find("Main Camera");
		}
	}
	
	function Update()
	{
		if(controlledByMe) {
			if(Input.GetKeyDown(key))
				networkView.RPC("CallActivate",RPCMode.Server);
			if(Input.GetKeyUp(key))
				networkView.RPC("CallDeActivate",RPCMode.Server);
		}
	}
	
	/* ********************
	
		Server-side Functions 
		
		*********************/
	
	function FixedUpdate() {
		if(Network.isServer && keyPressed) {
			attachedPiece.FixedActivateNetworked();
		}
	}
	
	@RPC
	function CallActivate() {
		if(!selected) {
	/*		var CRF : CameraRobotFollower = relatedCamera.GetComponent("CameraRobotFollower");
			Debug.Log(CRF);
			mainCamFollowPiece = CRF.objToFollow;
			relatedCamera.Destroy(CRF);
			relatedCamera.Destroy(relatedCamera.GetComponent("TargettingCamera"));
			var TC : TargettingCamera = relatedCamera.AddComponent("TargettingCamera");
			TC.objToFollow = GetComponent("Connector"); */
			
			selected = true;
			networkView.RPC("AddOrDestroyTargetter",RPCMode.All,true);
		}
		else {
		/*	relatedCamera.Destroy(relatedCamera.GetComponent("CameraRobotFollower"));
			relatedCamera.Destroy(relatedCamera.GetComponent("TargettingCamera"));
			var camFollower : CameraRobotFollower = relatedCamera.AddComponent("CameraRobotFollower");
			camFollower.objToFollow = mainCamFollowPiece; */
			selected = false;
			networkView.RPC("AddOrDestroyTargetter",RPCMode.All,false);
		}
	}
	
	/****************
		
		Client-side Functions
		
		*****************/
	
	@RPC
	function AddOrDestroyTargetter(addTargetter : boolean) {
		if(addTargetter) { // add targetter component
			gameObject.AddComponent(TargetterNetworked);
		}
		else {	// destroy targetter component
			gameObject.Destroy(gameObject.GetComponent(TargetterNetworked));
		}
	}
	
	@RPC
	function SetController(player : NetworkPlayer) {
		if(Network.player == player) {
			controlledByMe = true;
			relatedCamera = GameObject.Find("Main Camera");
		}
	}
}